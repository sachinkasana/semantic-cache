# Express example

## Library-style usage

```js
import { SemanticCache } from "../../src/index.js";

const cache = new SemanticCache({
  provider: "openai",
  cache: "redis",
  redisUrl: process.env.REDIS_URL,
  threshold: 0.92,
});

const result = await cache.ask("Explain semantic caching");
```

## Option A — routes (repo default)

```bash
npm install
docker compose up -d
cp .env.example .env   # add OPENAI_API_KEY
npm run dev
```

```bash
curl -s http://localhost:3000/chat \
  -H 'Content-Type: application/json' \
  -d '{"prompt":"Explain semantic caching in one sentence"}'

curl -s http://localhost:3000/stats
```

## Option B — middleware

```js
import express from "express";
import { semanticCache } from "../../src/middleware/semanticCache.js";

const app = express();
app.use(express.json());
app.post("/chat", semanticCache({ threshold: 0.92 }));
app.listen(3000);
```
