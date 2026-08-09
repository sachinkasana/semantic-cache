# Semantic Cache

A production-ready semantic cache starter built with Node.js, Express, Redis, and OpenAI Embeddings.

## Goals

- Reduce repeated LLM calls
- Lower latency and token costs
- Cache by semantic similarity instead of exact text

## Structure

```
src/
  app.js
  server.js
  config/         # OpenAI + Redis clients
  services/       # Embedding, cache, similarity, LLM
  routes/         # HTTP routes
  middleware/     # Request logger
  utils/          # Cosine similarity math
```

## Tech Stack

- Node.js + Express
- Redis
- OpenAI Embeddings API
- Cosine Similarity

## Architecture

![Semantic Cache architecture](./semantic-cache.png)

**Request flow**

1. Client sends a prompt to `POST /chat`
2. Embedding service turns the prompt into a vector
3. Cache service loads entries from Redis and similarity service finds the best cosine match
4. **Hit** — return the cached response (no LLM call)
5. **Miss** — call the LLM, store `{prompt, embedding, response}` in Redis, return the fresh response

## Quick start

```bash
cp .env.example .env
# set OPENAI_API_KEY in .env

docker compose up -d
npm install
npm run dev
```

## Try it

```bash
curl -s http://localhost:3000/chat \
  -H 'Content-Type: application/json' \
  -d '{"prompt":"What is semantic caching?"}'
```

A second, similarly worded prompt should return `"cached": true` when similarity ≥ `SIMILARITY_THRESHOLD` (default `0.92`).

## Roadmap

- [x] Express API
- [x] Redis integration
- [x] Embedding service
- [x] Semantic similarity
- [x] Semantic cache service
- [x] Docker Compose
- [ ] Metrics
