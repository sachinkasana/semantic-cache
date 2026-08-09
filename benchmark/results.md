# Benchmark results

## Article demo (miss → hit)

Run the screenshot-ready flow:

```bash
# Offline preview (no API key) — great for terminal screenshots
npm run demo:simulate

# Live OpenAI + Redis
cp .env.example .env   # set OPENAI_API_KEY
docker compose up -d
npm run demo
```

### Example output (simulate)

```
▶ Prompt: "What is semantic caching?"
Generating embedding...
Searching memory for similar prompts...
── Cache MISS ──
No match ≥ 0.9
Calling OpenAI...
Saving to memory...
Latency: 2.8s

▶ Prompt: "Explain semantic caching"
Generating embedding...
Searching memory for similar prompts...
── Cache HIT ──
Similarity: 0.99
Returning cached response
Latency: 120ms
```

### Numbers readers care about

| Request | First Call | Second Call |
|---|---|---|
| "What is semantic caching?" | **~2.8s** (MISS → OpenAI) | — |
| "Explain semantic caching" | — | **~120ms** (HIT) |

With live OpenAI, replace these with your `npm run demo` timings before publishing the article.

## Scenario averages (local simulation scripts)

```bash
npm run benchmark:without
npm run benchmark:with
```

| Scenario | Avg Latency | Notes |
|---|---|---|
| Without Cache | **~4.8s** | Every prompt pays full LLM latency |
| Exact Prompt Cache | **~1.3s** | Helps only on identical strings |
| Semantic Cache | **~320ms** | Paraphrases reuse prior answers |

## Reproduce simulation scripts

```bash
BENCH_ITERATIONS=5 BENCH_LLM_MS=4800 node benchmark/without-cache.js
BENCH_ITERATIONS=5 BENCH_LLM_MS=4800 BENCH_EMBED_MS=180 BENCH_CACHE_MS=40 node benchmark/with-cache.js
```
