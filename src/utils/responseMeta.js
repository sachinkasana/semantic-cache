export function buildResult({ cached, similarity, provider, response, startedAt }) {
  return {
    cached,
    similarity: similarity == null ? null : Number(similarity.toFixed(4)),
    latency: `${Date.now() - startedAt}ms`,
    provider,
    response,
  };
}
