import { OpenAIEmbeddingProvider } from "./openai/OpenAIEmbeddingProvider.js";

/**
 * @deprecated Prefer `new OpenAIEmbeddingProvider()`.
 */
export function createOpenAIEmbeddingProvider(options = {}) {
  return new OpenAIEmbeddingProvider(options);
}
