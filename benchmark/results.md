# Benchmark results

Sample numbers from the local simulation scripts (no OpenAI/Redis required).
Re-run anytime:

```bash
npm run benchmark:without
npm run benchmark:with
```

## Summary

| Scenario | Avg Latency | Notes |
|---|---|---|
| Without Cache | **~4.8s** | Every prompt pays full LLM latency |
| Exact Prompt Cache | **~1.3s** | Helps only on identical strings |
| Semantic Cache | **~320ms** | Similar prompts reuse embeddings + Redis hit |

> Exact Prompt Cache is shown for comparison in articles; SemanticCacheJS focuses on semantic hits.

## Why the gap?

1. **Without cache** — each request waits on the LLM (~4.8s simulated).
2. **Semantic cache** — first related prompt is a miss; later paraphrases hit after a cheap embed + similarity lookup (~180ms + ~40ms).
3. Hit rate climbs quickly when users rephrase the same question.

## Reproduce

```bash
BENCH_ITERATIONS=5 BENCH_LLM_MS=4800 node benchmark/without-cache.js
BENCH_ITERATIONS=5 BENCH_LLM_MS=4800 BENCH_EMBED_MS=180 BENCH_CACHE_MS=40 node benchmark/with-cache.js
```

Tune env vars to match your production p50 LLM / embedding latency for article screenshots.

The local bag-of-words embedder uses `BENCH_THRESHOLD` (default `0.5`) so paraphrases hit without calling OpenAI. Production apps should keep `SIMILARITY_THRESHOLD` near `0.92` with real embeddings.
