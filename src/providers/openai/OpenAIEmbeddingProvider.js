import OpenAI from "openai";
import { assertEmbeddingProvider } from "../../interfaces/EmbeddingProvider.js";

/**
 * OpenAI embeddings provider.
 */
export class OpenAIEmbeddingProvider {
  /**
   * @param {{ apiKey?: string, model?: string, client?: import("openai").default }} [options]
   */
  constructor(options = {}) {
    this.model = options.model || process.env.EMBEDDING_MODEL || "text-embedding-3-small";
    this.client =
      options.client ||
      new OpenAI({ apiKey: options.apiKey || process.env.OPENAI_API_KEY });
    assertEmbeddingProvider(this);
  }

  /** @param {string} text */
  async embed(text) {
    const { data } = await this.client.embeddings.create({
      model: this.model,
      input: text,
    });
    return data[0].embedding;
  }
}
