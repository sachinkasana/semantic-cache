import { Router } from "express";
import { getStats } from "../services/stats.service.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json(getStats());
});

export default router;
