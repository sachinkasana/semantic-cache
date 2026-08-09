import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { cosineSimilarity } from "../src/utils/cosineSimilarity.js";
import { findBestMatch, scoreSimilarity } from "../src/services/similarity.service.js";

describe("cosineSimilarity", () => {
  it("returns 1 for identical vectors", () => {
    assert.equal(cosineSimilarity([1, 0, 0], [1, 0, 0]), 1);
  });

  it("returns 0 for orthogonal vectors", () => {
    assert.ok(Math.abs(cosineSimilarity([1, 0], [0, 1])) < 1e-10);
  });

  it("rejects mismatched lengths", () => {
    assert.throws(() => cosineSimilarity([1], [1, 2]));
  });
});

describe("similarity.service", () => {
  it("scores via cosineSimilarity", () => {
    assert.equal(scoreSimilarity([1, 0], [1, 0]), 1);
  });

  it("returns best match above threshold", () => {
    const hit = findBestMatch(
      [1, 0],
      [{ embedding: [0.99, 0.01], response: "cached" }],
      0.9,
    );
    assert.equal(hit.response, "cached");
    assert.ok(hit.score >= 0.9);
  });

  it("returns null when nothing meets threshold", () => {
    const miss = findBestMatch(
      [1, 0],
      [{ embedding: [0, 1], response: "nope" }],
      0.9,
    );
    assert.equal(miss, null);
  });
});
