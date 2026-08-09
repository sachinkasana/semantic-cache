import { getDefaultCache } from "../config/defaultCache.js";

/**
 * @deprecated Prefer SemanticCache / CacheProvider. Kept for older imports.
 */
export async function findSimilar(embedding) {
  const cache = getDefaultCache();
  const entries = await cache.cacheProvider.getAll();
  const { findBestMatch } = await import("./similarity.service.js");
  return findBestMatch(embedding, entries, cache.threshold);
}

/**
 * @deprecated Prefer SemanticCache / CacheProvider. Kept for older imports.
 */
export async function storeEntry({ prompt, embedding, response }) {
  const cache = getDefaultCache();
  await cache.cacheProvider.add({
    prompt,
    embedding,
    response,
    createdAt: Date.now(),
  });
}
