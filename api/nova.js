import { GoogleGenAI } from "@google/genai";

const MODEL_NAME = "gemini-2.5-flash";
const SYSTEM_PROMPT = "You are Nova, Cyber Nova's warm AI tutor, study assistant, and friendly learning companion. Answer the user's actual question directly instead of forcing every conversation into a lesson. Match the user's language: English, Bengali, or Banglish.";

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  const apiKey = String(process.env.GEMINI_API_KEY || "").trim();
  if (!apiKey) {
    return json(res, 503, {
      error: "Nova AI is not configured yet.",
      detail: "Missing GEMINI_API_KEY in Vercel environment variables.",
    });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const latest = messages.at(-1)?.content || "";

    if (!latest.trim()) return json(res, 400, { error: "Message is required." });

    const ai = new GoogleGenAI({ apiKey });

    const contents = messages.slice(-12).map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: String(msg.content || "") }],
    }));

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
        maxOutputTokens: 1200,
      },
    });

    const text = response.text;
    if (!text) {
      return json(res, 502, { error: "Nova returned an empty response." });
    }

    return json(res, 200, { text });
  } catch (error) {
    return json(res, 500, {
      error: "Nova is temporarily unavailable.",
      detail: error instanceof Error ? error.message : "Unknown runtime error.",
    });
  }
}