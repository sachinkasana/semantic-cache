# Benchmarks

Local simulations that do **not** require OpenAI or Redis — ideal for article screenshots and CI.

| Script | Purpose |
|---|---|
| `without-cache.js` | Every prompt pays full LLM latency |
| `with-cache.js` | Semantic hits after the first related miss |
| `results.md` | Published summary table |

```bash
npm run benchmark:without
npm run benchmark:with
```

See [results.md](./results.md) for the comparison table used in the README.
