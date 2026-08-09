import { cosineSimilarity } from "../utils/cosineSimilarity.js";

/**
 * Score how similar two embeddings are (cosine similarity).
 */
export function scoreSimilarity(a, b) {
  return cosineSimilarity(a, b);
}

/**
 * Return the best matching cache entry at or above threshold, or null.
 */
export function findBestMatch(queryEmbedding, entries, threshold) {
  let best = null;

  for (const entry of entries) {
    const score = scoreSimilarity(queryEmbedding, entry.embedding);

    if (score >= threshold && (!best || score > best.score)) {
      best = { ...entry, score };
    }
  }

  return best;
}
