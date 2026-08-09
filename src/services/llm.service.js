import { getDefaultCache } from "../config/defaultCache.js";

/**
 * @deprecated Prefer LLMProvider / SemanticCache.
 */
export async function generateResponse(prompt) {
  return getDefaultCache().llmProvider.complete(prompt);
}
