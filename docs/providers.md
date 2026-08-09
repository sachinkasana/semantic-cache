# Embedding providers

SemanticCacheJS talks to embeddings through a tiny interface:

```js
/**
 * @typedef {Object} EmbeddingProvider
 * @property {(text: string) => Promise<number[]>} embed
 */
```

v1 ships with OpenAI (`src/providers/openai.embedding.js`).

Planned adapters (same cache logic):

- Gemini
- Voyage AI
- Cohere
- Ollama
