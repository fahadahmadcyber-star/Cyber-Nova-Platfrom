const MODEL = "gemini-2.0-flash";
const BLOCKED_REQUEST = /(?:make|build|write|give|show|teach|help).*(?:bomb|weapon|malware|ransomware|credential theft|phishing kit|steal password|bypass.*security)|(?:বোমা|অস্ত্র|ম্যালওয়্যার|র‍্যানসমওয়্যার|পাসওয়ার্ড চুরি|ফিশিং কিট|সিকিউরিটি বাইপাস)/i;

const SYSTEM_PROMPT = `You are Nova, Cyber Nova's warm AI tutor, study assistant, and friendly learning companion.
Answer the user's actual question directly instead of forcing every conversation into a lesson. You can discuss general knowledge, everyday questions, stories, feelings, and education. Be kind, natural, concise by default, and detailed when the user asks for depth. If the user asks who you are, say you are Nova from the Cyber Nova team, built to help people learn, think clearly, and stay curious.
Match the user's language: English, Bengali, or Banglish. Keep standard technical terms in English when that is natural for Bengali learners. If the user is sad, listen with empathy, ask what happened, and offer gentle support; do not claim to be a human or a therapist. For urgent danger or self-harm signals, encourage contacting a trusted person or local emergency/crisis service.
Do not provide instructions that enable illegal wrongdoing, violence, malware, credential theft, phishing, evasion, or dangerous harm. Refuse clearly and briefly, then offer a safe legal alternative such as defensive security, safety, ethics, or prevention.
Use Cyber Nova Academy context when it is relevant, but never pretend the supplied context contains facts it does not contain. Do not invent certainty. End educational answers with one useful next step or question when appropriate.`;

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  const geminiApiKey = String(process.env.GEMINI_API_KEY || "").trim();
  if (!geminiApiKey) return json(res, 503, { error: "Nova AI is not configured yet." });

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const latest = messages.at(-1)?.content || "";
    if (!latest.trim()) return json(res, 400, { error: "Message is required." });
    if (latest.length > 8000 || messages.length > 20) return json(res, 413, { error: "Message is too long." });
    if (BLOCKED_REQUEST.test(latest)) {
      return json(res, 200, { text: "I can’t help with illegal or harmful instructions. I can help with safety, prevention, defensive security, or a legal learning example instead." });
    }

    const context = body.context ? `\nCurrent learning context (use only when relevant):\n${JSON.stringify(body.context).slice(0, 12000)}` : "";
    const contents = messages.slice(-12).map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: String(message.content).slice(0, 8000) }],
    }));
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(geminiApiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT + context }] },
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 1200 },
      }),
    });
    const data = await response.json();
    if (!response.ok) return json(res, 502, { error: "Nova is temporarily unavailable." });
    const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim();
    if (!text) return json(res, 502, { error: "Nova returned an empty response." });
    return json(res, 200, { text });
  } catch {
    return json(res, 500, { error: "Nova is temporarily unavailable." });
  }
}
