/**
 * Cache backend contract. Stores prompt/embedding/response entries.
 * Similarity search stays in SemanticCache so backends stay swappable.
 *
 * @typedef {Object} CacheEntry
 * @property {string} prompt
 * @property {number[]} embedding
 * @property {string} response
 * @property {number} createdAt
 *
 * @typedef {Object} CacheProvider
 * @property {() => Promise<CacheEntry[]>} getAll
 * @property {(entry: CacheEntry) => Promise<void>} add
 */

/**
 * @param {unknown} provider
 * @returns {asserts provider is CacheProvider}
 */
export function assertCacheProvider(provider) {
  if (
    !provider ||
    typeof provider.getAll !== "function" ||
    typeof provider.add !== "function"
  ) {
    throw new Error("CacheProvider must implement getAll() and add(entry)");
  }
}
