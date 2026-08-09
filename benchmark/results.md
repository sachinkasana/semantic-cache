# Benchmark results

Centerpiece numbers for the Medium article. Regenerate anytime:

```bash
npm run benchmark
```

## Centerpiece

| Scenario | Latency |
|---|---|
| No Cache | **~2.8s** |
| Semantic Cache (HIT) | **~140ms** |

Typical speedup on paraphrased follow-ups: **~15–20×**.

## Per request (miss → hit)

| Request | No Cache | Semantic Cache |
|---|---|---|
| "What is semantic caching?" | ~2.8s | ~2.9s (MISS — embed + OpenAI) |
| "Explain semantic caching" | ~2.8s | ~140ms (HIT) |

## Terminal demo (logs + screenshot)

```bash
npm run demo:simulate   # offline, same HIT/MISS logs
npm run demo            # live OpenAI + Redis
```

```
── Cache MISS ──
Calling OpenAI...
Latency: 2.8s

── Cache HIT ──
Similarity: 0.99
Latency: 120ms
```

## Live API stats

After a few `/chat` calls:

```bash
curl -s http://localhost:3000/stats
```

```json
{
  "cacheHits": 19,
  "cacheMisses": 3,
  "hitRate": "86.4%",
  "avgSimilarity": 0.93,
  "savedTokens": 12450,
  "estimatedCostSaved": "$1.87"
}
```

## Other scripts

| Script | Purpose |
|---|---|
| `benchmark.js` | Article centerpiece (this file) |
| `without-cache.js` | No-cache only |
| `with-cache.js` | Semantic cache only |
| `../scripts/demo.js` | Full HIT/MISS flow logs |
