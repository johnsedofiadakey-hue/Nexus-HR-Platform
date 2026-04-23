import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { getOrgId } from './enterprise.controller';
import prisma from '../prisma/client';

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateInsight = async (req: Request, res: Response) => {
  if (!ai) {
    return res.status(503).json({ error: 'AI service is currently unavailable. No API key configured.' });
  }

  try {
    const { contextType, data } = req.body;
    
    // Mask sensitive PII before sending to Gemini
    const sanitizedData = { ...data };
    if (sanitizedData.bankAccountNumber) delete sanitizedData.bankAccountNumber;
    if (sanitizedData.pin) delete sanitizedData.pin;
    
    const prompt = `
You are an expert HR Analyst for the "Nexus HR Platform". 
Analyze the following JSON context data representing an "${contextType}".
Generate a strategic human resources verdict. Return the response STRICTLY as a JSON object matching this schema:
{
  "title": "string (A punchy, 2-4 word title)",
  "summary": "string (A 1-2 sentence overview of the situation)",
  "recommendation": "string (Actionable HR advice)",
  "confidence": "number (0.0 to 1.0 representing your certainty)",
  "insights": [
    {
      "id": "string (unique short ID)",
      "type": "'SUCCESS' | 'WARNING' | 'CRITICAL' | 'NEUTRAL'",
      "label": "string (1-3 word label)",
      "description": "string (1 sentence description)",
      "impact": "number (0 to 100)"
    }
  ],
  "suggestedTargets": [
    {
      "title": "string (Actionable target title)",
      "description": "string",
      "priority": "'LOW' | 'MEDIUM' | 'HIGH'"
    }
  ]
}

Context Data:
${JSON.stringify(sanitizedData, null, 2)}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2, // Low temp for more consistent JSON structure
      }
    });

    const text = response.text || '{}';
    const jsonResult = JSON.parse(text);

    res.json(jsonResult);
  } catch (err: any) {
    console.error('[AI] Insight Generation Error:', err.message);
    res.status(500).json({ error: 'Failed to generate AI insight.' });
  }
};

export const chat = async (req: Request, res: Response) => {
  if (!ai) {
    return res.status(503).json({ error: 'AI Assistant is currently unavailable.' });
  }

  try {
    const { message, history } = req.body;
    const orgId = getOrgId(req) || 'default-tenant';
    const user = (req as any).user;

    // Fetch minimal context to enrich the conversation (RAG-lite)
    const [empCount, depts] = await Promise.all([
      prisma.user.count({ where: { organizationId: orgId, isArchived: false, role: { not: 'DEV' } } }),
      prisma.department.findMany({ where: { organizationId: orgId }, select: { name: true } })
    ]);

    const sysPrompt = `
You are "Cortex", the Nexus HR Assistant for an organization with ${empCount} employees across departments: ${depts.map(d => d.name).join(', ')}.
You are assisting ${user.fullName} (Role: ${user.role}).
Be concise, professional, and helpful. Do not reveal sensitive systemic IDs. Focus on HR, management, and operational efficiency.
`;
    
    // Construct the contents array combining history and the new message
    const contents = [];
    
    // Add system instructions manually as first user message or part of history
    // Since @google/genai syntax for chat session uses multi-turn, we can do:
    if (!history || history.length === 0) {
        contents.push({ role: 'user', parts: [{ text: `System Instruction: ${sysPrompt}\n\nUser Message: ${message}` }] });
    } else {
        // Map history to the required format
        const formattedHistory = history.map((h: any) => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }]
        }));
        contents.push(...formattedHistory);
        contents.push({ role: 'user', parts: [{ text: message }] });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      // Pass the system instruction in config if the model supports it natively
      config: {
        systemInstruction: sysPrompt,
      }
    });

    res.json({ reply: response.text });
  } catch (err: any) {
    console.error('[AI] Chat Error:', err.message);
    res.status(500).json({ error: 'Failed to process chat message.' });
  }
};

export const parseResumeViaAI = async (req: Request, res: Response) => {
  if (!ai) {
    return res.status(503).json({ error: 'AI Assistant is currently unavailable.' });
  }

  try {
    const { candidateId } = req.body;
    const organizationId = req.user?.organizationId || 'default-tenant';

    if (!candidateId) return res.status(400).json({ error: 'candidateId is required.' });

    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId, organizationId },
      include: { jobPosition: true }
    });

    if (!candidate || !candidate.jobPosition) {
       return res.status(404).json({ error: 'Candidate or Job details not found.' });
    }

    const jobDescription = candidate.jobPosition.description || candidate.jobPosition.title;

    // Simulate extracting text or passing URL to model.
    // In production, you would fetch candidate.resumeUrl buffer and pass it as base64 inlineData.
    const prompt = `
You are an expert ATS (Applicant Tracking System) built into the Nexus HR Platform.
Your task is to analyze the candidate's operational fit against the provided Job Description.
Since we only have limited context right now, evaluate based on the candidate's profile notes and source:
Candidate Email: '${candidate.email}'
Candidate Source: '${candidate.source || 'Direct'}'
Candidate Notes: '${candidate.notes || 'No extra notes provided. Assume standard competence based on source.'}'

Job Description/Title to Match Against: 
${jobDescription.substring(0, 3000)}

Return STRICTLY JSON matching this schema:
{
  "matchScore": number (0 to 100),
  "strengths": [ "string", "string" ],
  "weaknesses": [ "string", "string" ],
  "summary": "string (2-3 sentences evaluating the candidate's fit)"
}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.1,
      }
    });

    const text = response.text || '{}';
    const jsonResult = JSON.parse(text);

    // Save the score back to the candidate row if we had a column. For now, just return.
    res.json(jsonResult);
  } catch (err: any) {
    console.error('[AI] Resume Parse Error:', err.message);
    res.status(500).json({ error: 'Failed to process AI parsing.' });
  }
};
