#!/usr/bin/env node
/**
 * Article-ready demo: miss → hit with terminal logging.
 *
 * Real (needs OPENAI_API_KEY + Redis):
 *   npm run demo
 *
 * Offline simulation (for screenshots without API keys):
 *   npm run demo:simulate
 */
import "dotenv/config";
import { SemanticCache } from "../src/SemanticCache.js";
import { MemoryCacheProvider } from "../src/cache/MemoryCacheProvider.js";
import { resetStats } from "../src/services/stats.service.js";

const simulate = process.argv.includes("--simulate");

const prompts = [
  "What is semantic caching?",
  "Explain semantic caching",
];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function createSimulatedCache() {
  const vectors = {
    "What is semantic caching?": [1, 0.05, 0],
    "Explain semantic caching": [0.98, 0.1, 0.02],
  };

  return new SemanticCache({
    verbose: true,
    threshold: 0.9,
    cacheProvider: new MemoryCacheProvider(),
    embeddingProvider: {
      async embed(text) {
        await sleep(120);
        return vectors[text] || [0, 1, 0];
      },
    },
    llmProvider: {
      async complete(prompt) {
        await sleep(2700);
        return `Semantic caching stores LLM answers by meaning so paraphrases like "${prompt}" reuse prior work.`;
      },
    },
    cache: "memory",
    provider: "openai",
  });
}

function createLiveCache() {
  if (!process.env.OPENAI_API_KEY) {
    console.error("Missing OPENAI_API_KEY. Set it in .env or run: npm run demo:simulate");
    process.exit(1);
  }

  return new SemanticCache({
    provider: "openai",
    cache: process.env.DEMO_CACHE || "redis",
    redisUrl: process.env.REDIS_URL,
    threshold: Number(process.env.SIMILARITY_THRESHOLD || 0.85),
    verbose: true,
  });
}

async function main() {
  resetStats();
  const cache = simulate ? createSimulatedCache() : createLiveCache();

  console.log("SemanticCacheJS demo");
  console.log(simulate ? "Mode: simulate (offline)" : "Mode: live (OpenAI + Redis)");
  console.log("─".repeat(48));

  const rows = [];

  for (const prompt of prompts) {
    const result = await cache.ask(prompt);
    rows.push({
      request: prompt,
      cached: result.cached,
      latency: result.latency,
      similarity: result.similarity,
    });
    console.log(`Response: ${result.response.slice(0, 100)}${result.response.length > 100 ? "…" : ""}`);
  }

  console.log("\n" + "─".repeat(48));
  console.log("Benchmark (this run)\n");
  console.log("| Request | Result | Latency | Similarity |");
  console.log("|---|---|---|---|");
  for (const row of rows) {
    console.log(
      `| "${row.request}" | ${row.cached ? "HIT" : "MISS"} | ${row.latency} | ${row.similarity ?? "—"} |`,
    );
  }

  if (rows.length >= 2) {
    console.log("\nArticle table shape:\n");
    console.log("| Request | First Call | Second Call |");
    console.log("|---|---|---|");
    console.log(
      `| "${prompts[0]}" | ${rows[0].latency} (MISS) | — |`,
    );
    console.log(
      `| "${prompts[1]}" | — | ${rows[1].latency} (${rows[1].cached ? "HIT" : "MISS"}) |`,
    );
  }

  console.log("\nStats:", cache.stats());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
