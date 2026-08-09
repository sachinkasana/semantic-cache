/**
 * Provider-agnostic embedding interface.
 *
 * @typedef {Object} EmbeddingProvider
 * @property {(text: string) => Promise<number[]>} embed
 */

/**
 * @param {EmbeddingProvider} provider
 * @param {string} text
 * @returns {Promise<number[]>}
 */
export async function embedWith(provider, text) {
  if (!provider?.embed) {
    throw new Error("EmbeddingProvider.embed(text) is required");
  }
  return provider.embed(text);
}
