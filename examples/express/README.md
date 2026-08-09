# Express example

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

app.post(
  "/chat",
  semanticCache({
    threshold: 0.92,
  }),
);

app.listen(3000);
```

Passthrough mode if you want to enrich the response yourself:

```js
app.post("/chat", semanticCache({ passthrough: true }), (req, res) => {
  res.json({
    ...res.locals.semanticCache,
    requestId: req.headers["x-request-id"],
  });
});
```
