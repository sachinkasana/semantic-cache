/**
 * Simulates repeated LLM calls with no caching.
 * Run: node benchmark/without-cache.js
 */

const ITERATIONS = Number(process.env.BENCH_ITERATIONS || 5);
const LLM_LATENCY_MS = Number(process.env.BENCH_LLM_MS || 4800);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fakeLlmCall() {
  const jitter = Math.floor(Math.random() * 400) - 200;
  await sleep(Math.max(100, LLM_LATENCY_MS + jitter));
  return "Uncached LLM response";
}

const prompts = [
  "What is semantic caching?",
  "Explain semantic caching simply",
  "How does a semantic cache work?",
  "What are benefits of semantic caches?",
  "Define semantic caching for LLMs",
];

const times = [];

console.log(`Without cache — ${ITERATIONS} iterations (simulated LLM ~${LLM_LATENCY_MS}ms)\n`);

for (let i = 0; i < ITERATIONS; i++) {
  const prompt = prompts[i % prompts.length];
  const start = Date.now();
  await fakeLlmCall(prompt);
  const ms = Date.now() - start;
  times.push(ms);
  console.log(`  [${i + 1}] ${ms}ms — ${prompt}`);
}

const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
console.log(`\nAvg latency: ${avg}ms`);
console.log(`Total: ${times.reduce((a, b) => a + b, 0)}ms`);
