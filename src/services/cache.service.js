import redis from "../config/redis.js";
import { cosineSimilarity } from "../utils/cosineSimilarity.js";

const CACHE_KEY = "semantic-cache:entries";
const THRESHOLD = Number(process.env.SIMILARITY_THRESHOLD || 0.92);

export async function findSimilar(embedding) {
  const raw = await redis.lrange(CACHE_KEY, 0, -1);
  let best = null;

  for (const item of raw) {
    const entry = JSON.parse(item);
    const score = cosineSimilarity(embedding, entry.embedding);

    if (score >= THRESHOLD && (!best || score > best.score)) {
      best = { ...entry, score };
    }
  }

  return best;
}

export async function storeEntry({ prompt, embedding, response }) {
  const entry = JSON.stringify({
    prompt,
    embedding,
    response,
    createdAt: Date.now(),
  });

  await redis.lpush(CACHE_KEY, entry);
}
