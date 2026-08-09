import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  getStats,
  recordHit,
  recordMiss,
  resetStats,
} from "../src/services/stats.service.js";
import { findBestMatch } from "../src/services/similarity.service.js";
import { buildResult } from "../src/utils/responseMeta.js";

describe("cache metadata + stats", () => {
  beforeEach(() => resetStats());

  it("tracks hits, misses, and hit rate", () => {
    recordMiss();
    recordHit({ similarity: 0.95, response: "hello world" });
    recordHit({ similarity: 0.91, response: "more text here" });

    const stats = getStats();
    assert.equal(stats.cacheHits, 2);
    assert.equal(stats.cacheMisses, 1);
    assert.equal(stats.hitRate, "66.7%");
    assert.equal(stats.avgSimilarity, 0.93);
    assert.ok(stats.savedTokens > 0);
    assert.match(stats.estimatedCostSaved, /^\$/);
  });

  it("finds semantic cache hits above threshold", () => {
    const hit = findBestMatch(
      [1, 0],
      [
        { embedding: [0.2, 0.8], response: "far" },
        { embedding: [0.99, 0.01], response: "near" },
      ],
      0.9,
    );
    assert.equal(hit.response, "near");
  });

  it("builds response metadata", () => {
    const startedAt = Date.now() - 42;
    const result = buildResult({
      cached: true,
      similarity: 0.94123,
      provider: "redis",
      response: "ok",
      startedAt,
    });
    assert.equal(result.cached, true);
    assert.equal(result.similarity, 0.9412);
    assert.equal(result.provider, "redis");
    assert.match(result.latency, /ms$/);
  });
});
