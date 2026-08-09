import openai from "../config/openai.js";

const MODEL = process.env.EMBEDDING_MODEL || "text-embedding-3-small";

export async function createEmbedding(text) {
  const { data } = await openai.embeddings.create({
    model: MODEL,
    input: text,
  });

  return data[0].embedding;
}
