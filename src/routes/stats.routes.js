import { Router } from "express";
import { getDefaultCache } from "../config/defaultCache.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json(getDefaultCache().stats());
});

export default router;
