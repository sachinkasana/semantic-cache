import { createEmbedding } from "./embedding.service.js";
import { findSimilar, storeEntry } from "./cache.service.js";
import { generateResponse } from "./llm.service.js";
import { recordHit, recordMiss } from "./stats.service.js";
import { buildResult } from "../utils/responseMeta.js";

export { buildResult };

/**
 * Core semantic-cache flow used by routes and middleware.
 */
export async function resolvePrompt(prompt, options = {}) {
  const startedAt = Date.now();
  const embed = options.embed || createEmbedding;
  const generate = options.generate || generateResponse;

  const embedding = await embed(prompt);
  const hit = await findSimilar(embedding);

  if (hit) {
    recordHit({ similarity: hit.score, response: hit.response });
    return buildResult({
      cached: true,
      similarity: hit.score,
      provider: "redis",
      response: hit.response,
      startedAt,
    });
  }

  recordMiss();
  const response = await generate(prompt);
  await storeEntry({ prompt, embedding, response });

  return buildResult({
    cached: false,
    similarity: null,
    provider: options.providerName || "openai",
    response,
    startedAt,
  });
}
