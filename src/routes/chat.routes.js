import { Router } from "express";
import { createEmbedding } from "../services/embedding.service.js";
import { findSimilar, storeEntry } from "../services/cache.service.js";
import { generateResponse } from "../services/llm.service.js";

const router = Router();

function buildResult({ cached, similarity, provider, response, startedAt }) {
  return {
    cached,
    similarity: similarity == null ? null : Number(similarity.toFixed(4)),
    latency: `${Date.now() - startedAt}ms`,
    provider,
    response,
  };
}

router.post("/", async (req, res, next) => {
  const startedAt = Date.now();

  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "prompt is required" });
    }

    const embedding = await createEmbedding(prompt);
    const hit = await findSimilar(embedding);

    if (hit) {
      return res.json(
        buildResult({
          cached: true,
          similarity: hit.score,
          provider: "redis",
          response: hit.response,
          startedAt,
        }),
      );
    }

    const response = await generateResponse(prompt);
    await storeEntry({ prompt, embedding, response });

    res.json(
      buildResult({
        cached: false,
        similarity: null,
        provider: "openai",
        response,
        startedAt,
      }),
    );
  } catch (err) {
    next(err);
  }
});

export default router;
