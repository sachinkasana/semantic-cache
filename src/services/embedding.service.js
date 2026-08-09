import { createOpenAIEmbeddingProvider } from "../providers/openai.embedding.js";
import { embedWith } from "../providers/embedding.provider.js";

const defaultProvider = createOpenAIEmbeddingProvider();

/**
 * Create an embedding for text using the configured provider.
 * Swap providers later (Gemini, Voyage, Cohere, Ollama) without touching cache logic.
 */
export async function createEmbedding(text, provider = defaultProvider) {
  return embedWith(provider, text);
}
