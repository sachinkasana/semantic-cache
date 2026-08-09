import { assertEmbeddingProvider } from "./interfaces/EmbeddingProvider.js";
import { assertCacheProvider } from "./interfaces/CacheProvider.js";
import { assertLLMProvider } from "./interfaces/LLMProvider.js";
import { OpenAIEmbeddingProvider, OpenAIChatProvider } from "./providers/openai/index.js";
import { MemoryCacheProvider } from "./cache/MemoryCacheProvider.js";
import { RedisCacheProvider } from "./cache/RedisCacheProvider.js";
import { findBestMatch } from "./services/similarity.service.js";
import { buildResult } from "./utils/responseMeta.js";
import {
  getStats,
  recordHit,
  recordMiss,
  resetStats,
} from "./services/stats.service.js";

/**
 * Core semantic cache — embed → similarity search → hit/miss → LLM.
 *
 * @example
 * import { SemanticCache } from "semantic-cache-js";
 *
 * const cache = new SemanticCache({
 *   provider: "openai",
 *   cache: "redis",
 *   redisUrl: process.env.REDIS_URL,
 *   threshold: 0.92,
 * });
 *
 * const result = await cache.ask("What is semantic caching?");
 */
export class SemanticCache {
  /**
   * @param {object} [options]
   * @param {"openai"} [options.provider]
   * @param {"redis"|"memory"} [options.cache]
   * @param {string} [options.apiKey]
   * @param {string} [options.redisUrl]
   * @param {number} [options.threshold]
   * @param {import("./interfaces/EmbeddingProvider.js").EmbeddingProvider} [options.embeddingProvider]
   * @param {import("./interfaces/LLMProvider.js").LLMProvider} [options.llmProvider]
   * @param {import("./interfaces/CacheProvider.js").CacheProvider} [options.cacheProvider]
   */
  constructor(options = {}) {
    this.threshold = Number(
      options.threshold ?? process.env.SIMILARITY_THRESHOLD ?? 0.92,
    );

    this.embeddingProvider =
      options.embeddingProvider ||
      createEmbeddingProvider(options.provider || "openai", options);
    this.llmProvider =
      options.llmProvider ||
      createLLMProvider(options.provider || "openai", options);
    this.cacheProvider =
      options.cacheProvider ||
      createCacheProvider(options.cache || "redis", options);

    assertEmbeddingProvider(this.embeddingProvider);
    assertLLMProvider(this.llmProvider);
    assertCacheProvider(this.cacheProvider);

    this.cacheBackendName =
      options.cacheProvider?.constructor?.name?.replace("CacheProvider", "").toLowerCase() ||
      options.cache ||
      "redis";
    this.llmProviderName = options.provider || "openai";
  }

  /**
   * Resolve a prompt through the semantic cache.
   * @param {string} prompt
   */
  async ask(prompt) {
    if (!prompt || typeof prompt !== "string") {
      throw new Error("prompt is required");
    }

    const startedAt = Date.now();
    const embedding = await this.embeddingProvider.embed(prompt);
    const entries = await this.cacheProvider.getAll();
    const hit = findBestMatch(embedding, entries, this.threshold);

    if (hit) {
      recordHit({ similarity: hit.score, response: hit.response });
      return buildResult({
        cached: true,
        similarity: hit.score,
        provider: this.cacheBackendName,
        response: hit.response,
        startedAt,
      });
    }

    recordMiss();
    const response = await this.llmProvider.complete(prompt);
    await this.cacheProvider.add({
      prompt,
      embedding,
      response,
      createdAt: Date.now(),
    });

    return buildResult({
      cached: false,
      similarity: null,
      provider: this.llmProviderName,
      response,
      startedAt,
    });
  }

  stats() {
    return getStats();
  }

  resetStats() {
    resetStats();
  }
}

function createEmbeddingProvider(name, options) {
  if (name === "openai") {
    return new OpenAIEmbeddingProvider({
      apiKey: options.apiKey,
      model: options.embeddingModel,
      client: options.openaiClient,
    });
  }
  throw new Error(`Unsupported embedding provider: ${name}`);
}

function createLLMProvider(name, options) {
  if (name === "openai") {
    return new OpenAIChatProvider({
      apiKey: options.apiKey,
      model: options.chatModel,
      client: options.openaiClient,
    });
  }
  throw new Error(`Unsupported LLM provider: ${name}`);
}

function createCacheProvider(name, options) {
  if (name === "memory") {
    return new MemoryCacheProvider();
  }
  if (name === "redis") {
    return new RedisCacheProvider({
      redisUrl: options.redisUrl,
      client: options.redisClient,
      key: options.cacheKey,
    });
  }
  throw new Error(`Unsupported cache backend: ${name}`);
}
