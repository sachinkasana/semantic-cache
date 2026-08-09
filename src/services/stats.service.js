const TOKEN_COST_PER_1K = Number(process.env.TOKEN_COST_PER_1K || 0.00015);

const state = {
  cacheHits: 0,
  cacheMisses: 0,
  similaritySum: 0,
  savedTokens: 0,
};

function estimateTokens(text = "") {
  return Math.max(1, Math.ceil(String(text).length / 4));
}

export function recordHit({ similarity, response }) {
  state.cacheHits += 1;
  state.similaritySum += similarity;
  state.savedTokens += estimateTokens(response);
}

export function recordMiss() {
  state.cacheMisses += 1;
}

export function getStats() {
  const total = state.cacheHits + state.cacheMisses;
  const hitRate =
    total === 0 ? "0%" : `${((state.cacheHits / total) * 100).toFixed(1)}%`;
  const avgSimilarity =
    state.cacheHits === 0
      ? null
      : Number((state.similaritySum / state.cacheHits).toFixed(4));
  const estimatedCostSaved = (state.savedTokens / 1000) * TOKEN_COST_PER_1K;

  return {
    cacheHits: state.cacheHits,
    cacheMisses: state.cacheMisses,
    hitRate,
    avgSimilarity,
    savedTokens: state.savedTokens,
    estimatedCostSaved: `$${estimatedCostSaved.toFixed(2)}`,
  };
}

/** @internal test helper */
export function resetStats() {
  state.cacheHits = 0;
  state.cacheMisses = 0;
  state.similaritySum = 0;
  state.savedTokens = 0;
}
