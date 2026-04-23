import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getOrgId } from './enterprise.controller';
import prisma from '../prisma/client';
import { executeTool, functionDeclarations } from '../services/ai-tools.service';

/**
 * AI Controller - Nexus IQ Intelligence Layer
 * Unified handler for insights, agentic chat, and technical parsing.
 */

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const generateInsight = async (req: Request, res: Response) => {
  if (!ai) {
    return res.status(503).json({ error: 'AI service unavailable. No API key configured.' });
  }

  try {
    const { contextType, data } = req.body;
    
    // Mask sensitive PII
    const sanitizedData = { ...data };
    if (sanitizedData.bankAccountNumber) delete sanitizedData.bankAccountNumber;
    if (sanitizedData.pin) delete sanitizedData.pin;
    
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
  } catch (err: any) {
    console.error('[AI] Insight Generation Error:', err.message);
    res.status(500).json({ error: 'Failed to generate AI insight.' });
  }
};

/**
 * Agentic Chat (Cortex)
 * Supports Autonomous Tool Execution via Function Calling.
 */
export const chat = async (req: Request, res: Response) => {
  if (!ai) return res.status(503).json({ error: 'AI Assistant unavailable.' });

  try {
    const { message, history } = req.body;
    const orgId = getOrgId(req) || 'default-tenant';
    const user = (req as any).user;

    // 1. Fetch organizational baseline for context
    const [empCount, depts] = await Promise.all([
      prisma.user.count({ where: { organizationId: orgId, isArchived: false, role: { not: 'DEV' } } }),
      prisma.department.findMany({ where: { organizationId: orgId }, select: { name: true } })
    ]);

    const sysPrompt = `You are "Cortex", the Nexus HR Agent for an org with ${empCount} employees. 
Assistant to: ${user.fullName} (Rank: ${user.rank}, Role: ${user.role}).
You have autonomous tools to search employees, check metrics, and request leave. 
Be concise, elite, and proactive. If a user asks to do something you have a tool for, USE THE TOOL.`;

    // 2. Initialize Model with Tools
    const model = ai.getGenerativeModel({
      model: 'gemini-1.5-flash',
      tools: [{ functionDeclarations } as any],
    });

    // 3. Prepare Chat History
    const formattedHistory = history?.map((h: any) => ({
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
    let calls = response.getFunctionCalls();

    // Iterate until AI stops calling functions
    while (calls && calls.length > 0) {
      const toolResults = await Promise.all(
        calls.map(async (call) => {
          try {
            const data = await executeTool(call.name, call.args, user);
            return {
              functionResponse: {
                name: call.name,
                response: { content: data }
              }
            };
          } catch (error: any) {
            return {
              functionResponse: {
                name: call.name,
                response: { error: error.message }
              }
            };
          }
        })
      );

      // Send tool results back to model
      result = await chatSession.sendMessage(toolResults as any);
      response = result.response;
      calls = response.getFunctionCalls();
    }

    res.json({ reply: response.text() });
  } catch (err: any) {
    console.error('[Cortex Agent] Chat Error:', err.message);
    res.status(500).json({ error: 'Elite Intelligence layer experienced a synchronization fault.' });
  }
};

export const parseResumeViaAI = async (req: Request, res: Response) => {
  if (!ai) return res.status(503).json({ error: 'AI parsing unavailable.' });

  try {
    const { candidateId } = req.body;
    const organizationId = req.user?.organizationId || 'default-tenant';

    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId, organizationId },
      include: { jobPosition: true }
    });

    if (!candidate || !candidate.jobPosition) return res.status(404).json({ error: 'Job context missing.' });

    const prompt = `Analyze candidate fit for '${candidate.jobPosition.title}'. 
Email: ${candidate.email} | Notes: ${candidate.notes || 'None'}
Return STRICTLY JSON: { "matchScore": number, "summary": "string", "strengths": [], "weaknesses": [] }`;

    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' }
    });

    res.json(JSON.parse(result.response.text()));
  } catch (err: any) {
    console.error('[AI] Resume Parse Error:', err.message);
    res.status(500).json({ error: 'Parsing failure.' });
  }
};
