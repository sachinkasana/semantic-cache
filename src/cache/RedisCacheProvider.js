import Redis from "ioredis";
import { assertCacheProvider } from "../interfaces/CacheProvider.js";

/**
 * Redis list-backed cache provider.
 */
export class RedisCacheProvider {
  /**
   * @param {{ redisUrl?: string, key?: string, client?: import("ioredis").default }} [options]
   */
  constructor(options = {}) {
    this.key = options.key || "semantic-cache:entries";
    this.client =
      options.client ||
      new Redis(options.redisUrl || process.env.REDIS_URL || "redis://localhost:6379");
    assertCacheProvider(this);
  }

  async getAll() {
    const raw = await this.client.lrange(this.key, 0, -1);
    return raw.map((item) => JSON.parse(item));
  }

  async add(entry) {
    await this.client.lpush(this.key, JSON.stringify(entry));
  }
}
