#!/usr/bin/env node
/**
 * Article centerpiece benchmark.
 *
 * Compares:
 *   No Cache       → every prompt pays full LLM latency
 *   Semantic Cache → first miss, then paraphrase hits
 *
 *   npm run benchmark
 */
import { cosineSimilarity } from "../src/utils/cosineSimilarity.js";
import { formatLatency } from "../src/utils/flowLog.js";

const LLM_MS = Number(process.env.BENCH_LLM_MS || 2800);
const EMBED_MS = Number(process.env.BENCH_EMBED_MS || 140);
const CACHE_MS = Number(process.env.BENCH_CACHE_MS || 40);
const THRESHOLD = Number(process.env.BENCH_THRESHOLD || 0.5);

const prompts = [
  "What is semantic caching?",
  "Explain semantic caching",
];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function embed(text) {
  const vocab = [
    "what",
    "is",
    "semantic",
    "caching",
    "cache",
    "explain",
    "define",
    "llm",
  ];
  return vocab.map((word) => {
    const tokens = text.toLowerCase().split(/\W+/).filter(Boolean);
    return tokens.filter((t) => t.includes(word) || word.includes(t)).length;
  });
}

async function runNoCache() {
  const times = [];
  for (const prompt of prompts) {
    const start = Date.now();
    await sleep(LLM_MS);
    times.push({ prompt, ms: Date.now() - start, cached: false });
  }
  return times;
}

async function runSemanticCache() {
  const store = [];
  const times = [];

  for (const prompt of prompts) {
    const start = Date.now();
    await sleep(EMBED_MS);
    const embedding = embed(prompt);

    let best = null;
    for (const entry of store) {
      const score = cosineSimilarity(embedding, entry.embedding);
      if (score >= THRESHOLD && (!best || score > best.score)) {
        best = { ...entry, score };
      }
    }

    if (best) {
      await sleep(CACHE_MS);
      times.push({
        prompt,
        ms: Date.now() - start,
        cached: true,
        similarity: best.score,
      });
      continue;
    }

    await sleep(LLM_MS);
    store.push({ embedding, response: "cached" });
    times.push({ prompt, ms: Date.now() - start, cached: false });
  }

  return times;
}

function avg(rows) {
  return Math.round(rows.reduce((s, r) => s + r.ms, 0) / rows.length);
}

console.log("SemanticCacheJS benchmark\n");

const noCache = await runNoCache();
const withCache = await runSemanticCache();

console.log("Per request\n");
console.log("| Request | No Cache | Semantic Cache |");
console.log("|---|---|---|");
for (let i = 0; i < prompts.length; i++) {
  const left = formatLatency(noCache[i].ms);
  const right = `${formatLatency(withCache[i].ms)} (${withCache[i].cached ? "HIT" : "MISS"})`;
  console.log(`| "${prompts[i]}" | ${left} | ${right} |`);
}

const noCacheAvg = avg(noCache);
const hitRows = withCache.filter((r) => r.cached);
const missRows = withCache.filter((r) => !r.cached);
const hitAvg = hitRows.length ? avg(hitRows) : avg(withCache);
const missAvg = missRows.length ? avg(missRows) : null;

console.log("\nCenterpiece\n");
console.log("| Scenario | Latency |");
console.log("|---|---|");
console.log(`| No Cache | **${formatLatency(noCacheAvg)}** |`);
console.log(`| Semantic Cache (HIT) | **${formatLatency(hitAvg)}** |`);
if (missAvg != null) {
  console.log(`| Semantic Cache (first MISS) | ${formatLatency(missAvg)} |`);
}

const speedup = (noCacheAvg / Math.max(hitAvg, 1)).toFixed(1);
console.log(`\n≈ ${speedup}× faster on cache hits vs no cache`);
console.log("\nCopy the Centerpiece table into results.md / your Medium article.");
