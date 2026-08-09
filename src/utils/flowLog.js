const enabled =
  process.env.SEMANTIC_CACHE_LOG !== "0" &&
  process.env.SEMANTIC_CACHE_LOG !== "false";

export function flowLog(enabledOverride, ...args) {
  if (enabledOverride === false) return;
  if (enabledOverride !== true && !enabled) return;
  console.log(...args);
}

export function formatLatency(ms) {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`;
}
