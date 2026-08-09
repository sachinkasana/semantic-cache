/**
 * @typedef {Object} EmbeddingProvider
 * @property {(text: string) => Promise<number[]>} embed
 */

/**
 * @param {unknown} provider
 * @returns {asserts provider is EmbeddingProvider}
 */
export function assertEmbeddingProvider(provider) {
  if (!provider || typeof provider.embed !== "function") {
    throw new Error("EmbeddingProvider must implement embed(text)");
  }
}
