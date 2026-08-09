import { resolvePrompt } from "../services/chat.service.js";

/**
 * Express middleware for semantic caching.
 *
 * @example
 * app.use(express.json());
 * app.use(
 *   semanticCache({
 *     threshold: 0.92, // reserved for future per-request overrides
 *   }),
 * );
 *
 * Or mount on a path and let it handle `req.body.prompt` end-to-end:
 * app.post("/chat", semanticCache(), (req, res) => res.json(res.locals.semanticCache));
 *
 * Default behavior: resolve the prompt and send JSON (terminal middleware).
 * Pass `{ passthrough: true }` to attach the result on `res.locals.semanticCache` and call next().
 */
export function semanticCache(options = {}) {
  const { passthrough = false, ...resolveOptions } = options;

  return async function semanticCacheMiddleware(req, res, next) {
    try {
      const prompt = req.body?.prompt;

      if (!prompt || typeof prompt !== "string") {
        if (passthrough) return next();
        return res.status(400).json({ error: "prompt is required" });
      }

      const result = await resolvePrompt(prompt, resolveOptions);
      res.locals.semanticCache = result;

      if (passthrough) return next();
      return res.json(result);
    } catch (err) {
      return next(err);
    }
  };
}
