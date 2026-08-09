# Contributing to SemanticCacheJS

Thanks for helping grow this into a production-ready semantic cache for Node.js.

## Development

```bash
npm install
cp .env.example .env
docker compose up -d
npm test
npm run dev
```

## Guidelines

- Prefer small, focused PRs (one feature or fix)
- Add or update tests when you change cache / similarity / provider behavior
- Use conventional commits: `feat`, `fix`, `docs`, `test`, `chore`, `refactor`
- Keep the embedding layer provider-agnostic (`EmbeddingProvider.embed`)
- Do not commit secrets (`.env`)

## Good first contributions

- New embedding providers (Gemini, Voyage, Cohere, Ollama)
- Framework examples (Fastify, NestJS, Next.js)
- Benchmark improvements with real latency captures
- Docs / typo fixes

## Questions

Open an issue describing what you want to build — we can help scope it to a version on the roadmap.
