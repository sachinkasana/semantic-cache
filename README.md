# SemanticCacheJS

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-green.svg)](https://nodejs.org/)
[![Redis](https://img.shields.io/badge/Cache-Redis-red.svg)](https://redis.io/)
[![OpenAI](https://img.shields.io/badge/Embeddings-OpenAI-412991.svg)](https://openai.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

A production-ready semantic caching library for OpenAI, Anthropic, Gemini, and other LLM providers.

Reduce repeated LLM calls, cut token costs, and lower latency by caching responses by **meaning** — not exact string match.

## Architecture

![SemanticCacheJS architecture](./semantic-cache.png)

## Quick Start (5 minutes)

```bash
git clone https://github.com/sachinkasana/semantic-cache.git
cd semantic-cache
npm install
cp .env.example .env
# set OPENAI_API_KEY in .env

docker compose up -d
npm run demo
```

You should see a **Cache MISS** (~seconds) then a **Cache HIT** (~milliseconds) for a paraphrased prompt — with step-by-step logs in the terminal.

Offline preview (no API key, same log format for screenshots):

```bash
npm run demo:simulate
```

### Express API

```bash
npm run dev
```

```bash
# 1) Miss — calls OpenAI, stores in Redis
curl -s http://localhost:3000/chat \
  -H 'Content-Type: application/json' \
  -d '{"prompt":"What is semantic caching?"}'

# 2) Hit — similar meaning, cached response
curl -s http://localhost:3000/chat \
  -H 'Content-Type: application/json' \
  -d '{"prompt":"Explain semantic caching"}'

# 3) Operational metrics
curl -s http://localhost:3000/stats
```

Example HIT payload:

```json
{
  "cached": true,
  "similarity": 0.94,
  "latency": "120ms",
  "provider": "redis",
  "response": "..."
}
```

Example `/stats` payload:

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

### Library API

```js
import { SemanticCache } from "./src/index.js";

const cache = new SemanticCache({
  provider: "openai",
  cache: "redis",
  redisUrl: process.env.REDIS_URL,
  threshold: 0.85,
});

const result = await cache.ask("What is semantic caching?");
```

## How It Works

1. `ask(prompt)` embeds the prompt via `EmbeddingProvider`
2. Load entries from `CacheProvider` (Redis or Memory)
3. Cosine similarity finds the best match ≥ threshold
4. **Hit** → return cached response + metadata
5. **Miss** → `LLMProvider.complete()`, store entry, return + metadata

```
EmbeddingProvider  →  OpenAIEmbeddingProvider   (+ Gemini / Ollama later)
CacheProvider      →  RedisCacheProvider | MemoryCacheProvider
LLMProvider        →  OpenAIChatProvider
```

## API

### `POST /chat`

Body: `{ "prompt": "..." }`

| Field | Description |
|---|---|
| `cached` | Whether the response came from cache |
| `similarity` | Best cosine match (`null` on miss) |
| `latency` | End-to-end request time |
| `provider` | `redis` on hit, `openai` on miss |
| `response` | Answer text |

### `GET /stats`

```json
{
  "cacheHits": 182,
  "cacheMisses": 24,
  "hitRate": "88.3%",
  "avgSimilarity": 0.93,
  "savedTokens": 158230,
  "estimatedCostSaved": "$21.48"
}
```

### `GET /health`

```json
{ "status": "ok" }
```

### Express middleware

```js
import { semanticCache } from "./src/middleware/semanticCache.js";

app.post("/chat", semanticCache({ threshold: 0.92 }));
```

See [examples/express](./examples/express).

## Benchmark

| Scenario | Latency |
|---|---|
| No Cache | **~2.8s** |
| Semantic Cache (HIT) | **~140ms** |

```bash
npm run benchmark
npm run demo:simulate
```

Details: [benchmark/results.md](./benchmark/results.md)

## Publish checklist

- [x] Clone → `npm install` → `docker compose up -d` → run (no code changes)
- [x] End-to-end: embed → Redis search → similarity → hit/miss → OpenAI → cache → return
- [x] Cache HIT demo with logs (`npm run demo` / `demo:simulate`)
- [x] `GET /stats` with hit rate, tokens saved, estimated cost
- [x] Benchmark centerpiece (`npm run benchmark`)

## Project layout

```
semantic-cache/
├── src/
│   ├── SemanticCache.js      # cache.ask(prompt)
│   ├── index.js              # package exports
│   ├── interfaces/           # Embedding / Cache / LLM contracts
│   ├── providers/openai/     # OpenAI adapters (more providers later)
│   ├── cache/                # Redis + Memory backends
│   ├── services/             # similarity, stats
│   ├── middleware/           # Express middleware
│   └── routes/               # Express demo API
├── examples/
├── docs/
├── benchmark/
├── tests/
└── README.md
```

## Roadmap

| Version | Focus |
|---|---|
| **v1** | Semantic Cache (Express + Redis + OpenAI) |
| **v2** | Redis Vector Search |
| **v3** | Qdrant support |
| **v4** | Pinecone support |
| **v5** | Prometheus / observability |
| **v6** | Multi-tenant support |
| **v7** | LangGraph adapter |
| **v8** | NestJS module |

Longer term: monorepo packages (`semantic-cache`, `express-middleware`, `nestjs`, `langchain`, `langgraph`) plus a playground.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Issues and PRs are welcome — especially providers, examples, and benchmarks.

```bash
npm test
```

## License

MIT
