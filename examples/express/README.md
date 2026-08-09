# Express example

The v1 Express demo lives in the repo root (`src/`).

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
```

Future articles will extract a reusable client and keep this folder as a thin Express wiring example.
