import { Router } from "express";
import { resolvePrompt } from "../services/chat.service.js";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "prompt is required" });
    }

    const result = await resolvePrompt(prompt);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
