# Architecture

SemanticCacheJS sits between your app and an LLM provider.

```
Client → API → Embedding → Similarity lookup (Redis)
                              ├─ hit  → return cached response + metadata
                              └─ miss → LLM → store entry → return + metadata
```

## v1 components

| Component | Role |
|---|---|
| Embedding service | Vectorize prompts (OpenAI embeddings) |
| Similarity service | Cosine similarity + best-match above threshold |
| Cache service | Persist / load entries in Redis |
| LLM service | Generate responses on cache miss |
| Chat route | Orchestrates the flow and returns cache metadata |

See the diagram in the root README (`semantic-cache.png`).
