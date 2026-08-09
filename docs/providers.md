# Providers & backends

## Interfaces

| Contract | Method |
|---|---|
| `EmbeddingProvider` | `embed(text) → number[]` |
| `LLMProvider` | `complete(prompt) → string` |
| `CacheProvider` | `getAll()`, `add(entry)` |

## Current implementations

| Kind | Class |
|---|---|
| Embeddings + chat | `providers/openai/OpenAIEmbeddingProvider`, `OpenAIChatProvider` |
| Cache | `cache/RedisCacheProvider`, `cache/MemoryCacheProvider` |

## Planned providers (same interfaces)

- Gemini
- Anthropic
- Ollama
- Voyage / Cohere

Add a folder under `providers/<name>/`, implement the interface, and register it in `SemanticCache` factories — no cache logic changes.
