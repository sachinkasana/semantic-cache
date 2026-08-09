import OpenAI from "openai";
import { assertLLMProvider } from "../../interfaces/LLMProvider.js";

/**
 * OpenAI chat completions provider.
 */
export class OpenAIChatProvider {
  /**
   * @param {{ apiKey?: string, model?: string, client?: import("openai").default }} [options]
   */
  constructor(options = {}) {
    this.model = options.model || process.env.CHAT_MODEL || "gpt-4o-mini";
    this.client =
      options.client ||
      new OpenAI({ apiKey: options.apiKey || process.env.OPENAI_API_KEY });
    assertLLMProvider(this);
  }

  /** @param {string} prompt */
  async complete(prompt) {
    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages: [{ role: "user", content: prompt }],
    });
    return completion.choices[0].message.content;
  }
}
