import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { SemanticCache } from "../src/SemanticCache.js";
import { MemoryCacheProvider } from "../src/cache/MemoryCacheProvider.js";
import { resetStats } from "../src/services/stats.service.js";

function fakeEmbeddingProvider(map) {
  return {
    async embed(text) {
      if (!map[text]) throw new Error(`no embedding for: ${text}`);
      return map[text];
    },
  };
}

function fakeLLMProvider(answer = "fresh answer") {
  let calls = 0;
  return {
    get calls() {
      return calls;
    },
    async complete(prompt) {
      calls += 1;
      return `${answer}:${prompt}`;
    },
  };
}

describe("SemanticCache.ask end-to-end", () => {
  beforeEach(() => resetStats());

  it("embeds, misses, calls LLM, then hits on similar prompt", async () => {
    const llm = fakeLLMProvider("cached");
    const cache = new SemanticCache({
      threshold: 0.9,
      cacheProvider: new MemoryCacheProvider(),
      embeddingProvider: fakeEmbeddingProvider({
        "What is caching?": [1, 0],
        "Explain caching": [0.99, 0.01],
      }),
      llmProvider: llm,
      provider: "openai",
      cache: "memory",
    });

    const miss = await cache.ask("What is caching?");
    assert.equal(miss.cached, false);
    assert.equal(miss.provider, "openai");
    assert.equal(llm.calls, 1);

    const hit = await cache.ask("Explain caching");
    assert.equal(hit.cached, true);
    assert.equal(hit.provider, "memory");
    assert.ok(hit.similarity >= 0.9);
    assert.equal(llm.calls, 1);
    assert.match(hit.response, /^cached:/);

    const stats = cache.stats();
    assert.equal(stats.cacheHits, 1);
    assert.equal(stats.cacheMisses, 1);
  });

  it("requires a prompt string", async () => {
    const cache = new SemanticCache({
      cacheProvider: new MemoryCacheProvider(),
      embeddingProvider: { async embed() { return [1]; } },
      llmProvider: { async complete() { return "x"; } },
    });
    await assert.rejects(() => cache.ask(""), /prompt is required/);
  });
});
