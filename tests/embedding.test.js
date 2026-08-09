import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { embedWith } from "../src/providers/embedding.provider.js";

describe("embedding provider interface", () => {
  it("delegates to provider.embed", async () => {
    const provider = {
      async embed(text) {
        return [text.length, 1, 0];
      },
    };

    const vector = await embedWith(provider, "abcd");
    assert.deepEqual(vector, [4, 1, 0]);
  });

  it("rejects providers without embed()", async () => {
    await assert.rejects(() => embedWith({}, "hi"), /EmbeddingProvider/);
  });

  it("supports swapping providers without cache changes", async () => {
    const voyageLike = {
      name: "voyage",
      async embed(text) {
        return text.split("").map((ch) => ch.charCodeAt(0) / 255);
      },
    };

    const openaiLike = {
      name: "openai",
      async embed() {
        return [0.1, 0.2, 0.3];
      },
    };

    const a = await embedWith(voyageLike, "ab");
    const b = await embedWith(openaiLike, "ab");
    assert.equal(a.length, 2);
    assert.deepEqual(b, [0.1, 0.2, 0.3]);
  });
});
