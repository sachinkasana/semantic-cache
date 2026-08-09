import { Router } from "express";
import { createEmbedding } from "../services/embedding.service.js";
import { findSimilar, storeEntry } from "../services/cache.service.js";
import { generateResponse } from "../services/llm.service.js";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "prompt is required" });
    }

    const embedding = await createEmbedding(prompt);
    const hit = await findSimilar(embedding);

    if (hit) {
      return res.json({
        cached: true,
        similarity: hit.score,
        response: hit.response,
      });
    }

    const response = await generateResponse(prompt);
    await storeEntry({ prompt, embedding, response });

    res.json({ cached: false, response });
  } catch (err) {
    next(err);
  }
});

export default router;
