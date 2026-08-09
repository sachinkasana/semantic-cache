import { getDefaultCache } from "../config/defaultCache.js";

/**
 * @deprecated Prefer EmbeddingProvider / SemanticCache.
 */
export async function createEmbedding(text) {
  return getDefaultCache().embeddingProvider.embed(text);
}
