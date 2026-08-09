/**
 * Cosine similarity between two equal-length vectors.
 * Returns a value in [-1, 1]; closer to 1 means more similar.
 */
export function cosineSimilarity(a, b) {
  if (!a?.length || a.length !== b?.length) {
    throw new Error("Vectors must be non-empty and the same length");
  }

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}
