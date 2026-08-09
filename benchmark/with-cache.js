/**
 * Simulates semantic cache: first call pays LLM cost, similar prompts hit cache.
 * Run: node benchmark/with-cache.js
 */

import { cosineSimilarity } from "../src/utils/cosineSimilarity.js";

const ITERATIONS = Number(process.env.BENCH_ITERATIONS || 5);
const LLM_LATENCY_MS = Number(process.env.BENCH_LLM_MS || 4800);
const EMBED_LATENCY_MS = Number(process.env.BENCH_EMBED_MS || 180);
const CACHE_LOOKUP_MS = Number(process.env.BENCH_CACHE_MS || 40);
const THRESHOLD = Number(process.env.BENCH_THRESHOLD || 0.5);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Tiny deterministic bag-of-words embedding for local benchmarks (no API). */
function embed(text) {
  const vocab = [
    "what",
    "is",
    "semantic",
    "caching",
    "cache",
    "explain",
    "how",
    "does",
    "work",
    "benefit",
    "define",
    "llm",
    "simply",
  ];
  return vocab.map((word) => {
    const tokens = text.toLowerCase().split(/\W+/).filter(Boolean);
    return tokens.filter((t) => t.includes(word) || word.includes(t)).length;
  });
}

const store = [];

async function resolve(prompt) {
  await sleep(EMBED_LATENCY_MS);
  const embedding = embed(prompt);

  let best = null;
  for (const entry of store) {
    const score = cosineSimilarity(embedding, entry.embedding);
    if (score >= THRESHOLD && (!best || score > best.score)) {
      best = { ...entry, score };
    }
  }

  if (best) {
    await sleep(CACHE_LOOKUP_MS);
    return { cached: true, score: best.score, ms: EMBED_LATENCY_MS + CACHE_LOOKUP_MS };
  }

  await sleep(LLM_LATENCY_MS);
  store.push({ embedding, response: "Cached answer" });
  return { cached: false, score: null, ms: EMBED_LATENCY_MS + LLM_LATENCY_MS };
}

const prompts = [
  "What is semantic caching?",
  "What is semantic caching for LLMs?",
  "Explain what semantic caching is",
  "Can you define semantic caching?",
  "Tell me what a semantic cache is",
];

console.log(`With semantic cache — ${ITERATIONS} iterations\n`);

const times = [];
let hits = 0;

for (let i = 0; i < ITERATIONS; i++) {
  const prompt = prompts[i % prompts.length];
  const start = Date.now();
  const result = await resolve(prompt);
  const ms = Date.now() - start;
  times.push(ms);
  if (result.cached) hits += 1;
  console.log(
    `  [${i + 1}] ${ms}ms cached=${result.cached} sim=${result.score?.toFixed?.(3) ?? "n/a"} — ${prompt}`,
  );
}

const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
console.log(`\nHits: ${hits}/${ITERATIONS}`);
console.log(`Avg latency: ${avg}ms`);
console.log(`Total: ${times.reduce((a, b) => a + b, 0)}ms`);
