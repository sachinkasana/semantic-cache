import { SemanticCache } from "../SemanticCache.js";

let defaultCache;

/**
 * Shared SemanticCache instance for the Express demo (Redis + OpenAI).
 */
export function getDefaultCache() {
  if (!defaultCache) {
    defaultCache = new SemanticCache({
      provider: "openai",
      cache: "redis",
      redisUrl: process.env.REDIS_URL,
      threshold: Number(process.env.SIMILARITY_THRESHOLD || 0.92),
    });
  }
  return defaultCache;
}

/** @internal tests */
export function setDefaultCache(cache) {
  defaultCache = cache;
}
