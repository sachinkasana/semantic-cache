import redis from "../config/redis.js";
import { findBestMatch } from "./similarity.service.js";

const CACHE_KEY = "semantic-cache:entries";
const THRESHOLD = Number(process.env.SIMILARITY_THRESHOLD || 0.92);

export async function findSimilar(embedding) {
  const raw = await redis.lrange(CACHE_KEY, 0, -1);
  const entries = raw.map((item) => JSON.parse(item));
  return findBestMatch(embedding, entries, THRESHOLD);
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
