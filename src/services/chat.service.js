import { getDefaultCache } from "../config/defaultCache.js";
import { buildResult } from "../utils/responseMeta.js";

export { buildResult };

/**
 * Resolve a prompt through the shared SemanticCache instance.
 * Pass `{ cache }` to use a custom instance (tests / middleware).
 */
export async function resolvePrompt(prompt, options = {}) {
  const cache = options.cache || getDefaultCache();
  return cache.ask(prompt);
}
