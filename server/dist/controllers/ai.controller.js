"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseResumeViaAI = exports.chat = exports.generateInsight = void 0;
const generative_ai_1 = require("@google/generative-ai");
const enterprise_controller_1 = require("./enterprise.controller");
const client_1 = __importDefault(require("../prisma/client"));
const ai_tools_service_1 = require("../services/ai-tools.service");
/**
 * AI Controller - Nexus IQ Intelligence Layer
 * Unified handler for insights, agentic chat, and technical parsing.
 */
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new generative_ai_1.GoogleGenerativeAI(apiKey) : null;
const generateInsight = async (req, res) => {
    if (!ai) {
        return res.status(503).json({ error: 'AI service unavailable. No API key configured.' });
    }
    try {
        const { contextType, data } = req.body;
        // Mask sensitive PII
        const sanitizedData = { ...data };
        if (sanitizedData.bankAccountNumber)
            delete sanitizedData.bankAccountNumber;
        if (sanitizedData.pin)
            delete sanitizedData.pin;
        const prompt = `
You are an expert HR Analyst for "Nexus HR". 
Analyze the following context representing an "${contextType}".
Return STRICTLY a JSON object matching this schema:
{
  "title": "A punchy title",
  "summary": "1-2 sentence overview",
  "recommendation": "Actionable HR advice",
  "confidence": number,
  "insights": [{ "id": "uuid", "type": "SUCCESS|WARNING|CRITICAL|NEUTRAL", "label": "string", "description": "string", "impact": number }],
  "suggestedTargets": [{ "title": "string", "description": "string", "priority": "LOW|MEDIUM|HIGH" }]
}
Context Data:
${JSON.stringify(sanitizedData, null, 2)}
`;
        const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.2, responseMimeType: 'application/json' }
        });
        const jsonResult = JSON.parse(result.response.text());
        res.json(jsonResult);
    }
    catch (err) {
        console.error('[AI] Insight Generation Error:', err.message);
        res.status(500).json({ error: 'Failed to generate AI insight.' });
    }
};
exports.generateInsight = generateInsight;
/**
 * Agentic Chat (Cortex)
 * Supports Autonomous Tool Execution via Function Calling.
 */
const chat = async (req, res) => {
    if (!ai)
        return res.status(503).json({ error: 'AI Assistant unavailable.' });
    try {
        const { message, history } = req.body;
        const orgId = (0, enterprise_controller_1.getOrgId)(req) || 'default-tenant';
        const user = req.user;
        // 1. Fetch organizational baseline for context
        const [empCount, depts] = await Promise.all([
            client_1.default.user.count({ where: { organizationId: orgId, isArchived: false, role: { not: 'DEV' } } }),
            client_1.default.department.findMany({ where: { organizationId: orgId }, select: { name: true } })
        ]);
        const sysPrompt = `You are "Cortex", the Nexus HR Agent for an org with ${empCount} employees. 
Assistant to: ${user.fullName} (Rank: ${user.rank}, Role: ${user.role}).
You have autonomous tools to search employees, check metrics, and request leave. 
Be concise, elite, and proactive. If a user asks to do something you have a tool for, USE THE TOOL.`;
        // 2. Initialize Model with Tools
        const model = ai.getGenerativeModel({
            model: 'gemini-1.5-flash',
            tools: [{ functionDeclarations: ai_tools_service_1.functionDeclarations }],
        });
        // 3. Prepare Chat History
        const formattedHistory = history?.map((h) => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }]
        })) || [];
        // Ensure system prompt is known
        if (formattedHistory.length === 0) {
            formattedHistory.push({ role: 'user', parts: [{ text: `System Instruction: ${sysPrompt}` }] });
            formattedHistory.push({ role: 'model', parts: [{ text: "Acknowledged. Cortex is online and ready to assist with institutional operations." }] });
        }
        const chatSession = model.startChat({ history: formattedHistory });
        // 4. Send Message & Handle Tool Execution Loop
        let result = await chatSession.sendMessage(message);
        let response = result.response;
        let calls = response.functionCalls();
        // Iterate until AI stops calling functions
        while (calls && calls.length > 0) {
            const toolResults = await Promise.all(calls.map(async (call) => {
                try {
                    const data = await (0, ai_tools_service_1.executeTool)(call.name, call.args, user);
                    return {
                        functionResponse: {
                            name: call.name,
                            response: { content: data }
                        }
                    };
                }
                catch (error) {
                    return {
                        functionResponse: {
                            name: call.name,
                            response: { error: error.message }
                        }
                    };
                }
            }));
            // Send tool results back to model
            result = await chatSession.sendMessage(toolResults);
            response = result.response;
            calls = response.functionCalls();
        }
        res.json({ reply: response.text() });
    }
    catch (err) {
        console.error('[Cortex Agent] Chat Error:', err.message);
        res.status(500).json({ error: 'Elite Intelligence layer experienced a synchronization fault.' });
    }
};
exports.chat = chat;
const parseResumeViaAI = async (req, res) => {
    if (!ai)
        return res.status(503).json({ error: 'AI parsing unavailable.' });
    try {
        const { candidateId } = req.body;
        const organizationId = req.user?.organizationId || 'default-tenant';
        const candidate = await client_1.default.candidate.findUnique({
            where: { id: candidateId, organizationId },
            include: { jobPosition: true }
        });
        if (!candidate || !candidate.jobPosition)
            return res.status(404).json({ error: 'Job context missing.' });
        const prompt = `Analyze candidate fit for '${candidate.jobPosition.title}'. 
Email: ${candidate.email} | Notes: ${candidate.notes || 'None'}
Return STRICTLY JSON: { "matchScore": number, "summary": "string", "strengths": [], "weaknesses": [] }`;
        const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' }
        });
        res.json(JSON.parse(result.response.text()));
    }
    catch (err) {
        console.error('[AI] Resume Parse Error:', err.message);
        res.status(500).json({ error: 'Parsing failure.' });
    }
};
exports.parseResumeViaAI = parseResumeViaAI;
