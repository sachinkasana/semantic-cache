import openai from "../config/openai.js";

const MODEL = process.env.EMBEDDING_MODEL || "text-embedding-3-small";

/**
 * OpenAI embeddings adapter.
 * @returns {import("./embedding.provider.js").EmbeddingProvider}
 */
export function createOpenAIEmbeddingProvider(options = {}) {
  const model = options.model || MODEL;
  const client = options.client || openai;

  return {
    async embed(text) {
      const { data } = await client.embeddings.create({
        model,
        input: text,
      });
      return data[0].embedding;
    },
  };
}
