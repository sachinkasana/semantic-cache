import { assertEmbeddingProvider } from "../interfaces/EmbeddingProvider.js";

/**
 * Call an EmbeddingProvider.embed(text).
 * @param {import("../interfaces/EmbeddingProvider.js").EmbeddingProvider} provider
 * @param {string} text
 */
export async function embedWith(provider, text) {
  assertEmbeddingProvider(provider);
  return provider.embed(text);
}
