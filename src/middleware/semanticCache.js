import { SemanticCache } from "../SemanticCache.js";
import { getDefaultCache } from "../config/defaultCache.js";

/**
 * Express middleware for semantic caching.
 *
 * @example
 * app.post("/chat", semanticCache({ threshold: 0.92 }));
 *
 * // or inject an existing instance
 * app.post("/chat", semanticCache({ cache }));
 */
export function semanticCache(options = {}) {
  const { passthrough = false, cache, ...cacheOptions } = options;

  let instance = cache || null;
  if (!instance && Object.keys(cacheOptions).length > 0) {
    instance = new SemanticCache(cacheOptions);
  }

  return async function semanticCacheMiddleware(req, res, next) {
    try {
      const prompt = req.body?.prompt;

      if (!prompt || typeof prompt !== "string") {
        if (passthrough) return next();
        return res.status(400).json({ error: "prompt is required" });
      }

      const result = await (instance || getDefaultCache()).ask(prompt);
      res.locals.semanticCache = result;

      if (passthrough) return next();
      return res.json(result);
    } catch (err) {
      return next(err);
    }
  };
}
