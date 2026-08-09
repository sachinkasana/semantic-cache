import { assertCacheProvider } from "../interfaces/CacheProvider.js";

/**
 * In-memory cache backend — great for tests and local demos.
 */
export class MemoryCacheProvider {
  constructor() {
    /** @type {import("../interfaces/CacheProvider.js").CacheEntry[]} */
    this.entries = [];
    assertCacheProvider(this);
  }

  async getAll() {
    return [...this.entries];
  }

  async add(entry) {
    this.entries.unshift(entry);
  }

  async clear() {
    this.entries = [];
  }
}
