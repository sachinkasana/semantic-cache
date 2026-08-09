/**
 * @typedef {Object} LLMProvider
 * @property {(prompt: string) => Promise<string>} complete
 */

/**
 * @param {unknown} provider
 * @returns {asserts provider is LLMProvider}
 */
export function assertLLMProvider(provider) {
  if (!provider || typeof provider.complete !== "function") {
    throw new Error("LLMProvider must implement complete(prompt)");
  }
}
