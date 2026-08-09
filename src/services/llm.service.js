import openai from "../config/openai.js";

const MODEL = process.env.CHAT_MODEL || "gpt-4o-mini";

export async function generateResponse(prompt) {
  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
  });

  return completion.choices[0].message.content;
}
