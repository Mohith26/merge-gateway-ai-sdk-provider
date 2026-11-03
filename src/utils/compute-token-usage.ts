import type { JSONObject, LanguageModelV3Usage } from "@ai-sdk/provider";

/**
 * Map Gateway/OpenAI usage to AI SDK usage format.
 */
export function computeTokenUsage(usage: {
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
  prompt_tokens_details?: { cached_tokens?: number };
  completion_tokens_details?: { reasoning_tokens?: number };
}): LanguageModelV3Usage {
  const total = usage.prompt_tokens ?? 0;
  const cacheRead = usage.prompt_tokens_details?.cached_tokens;
  const reasoning = usage.completion_tokens_details?.reasoning_tokens;
  return {
    inputTokens: {
      total,
      // Input tokens not served from cache. Consumers such as OpenCode read this
      // as the uncached input count, so leaving it undefined reports 0 input tokens.
      noCache: Math.max(0, total - (cacheRead ?? 0)),
      cacheRead,
      cacheWrite: undefined,
    },
    outputTokens: {
      total: usage.completion_tokens ?? 0,
      text: undefined,
      reasoning,
    },
    raw: usage as JSONObject,
  };
}

export function emptyUsage(): LanguageModelV3Usage {
  return {
    inputTokens: {
      total: 0,
      noCache: 0,
      cacheRead: undefined,
      cacheWrite: undefined,
    },
    outputTokens: { total: 0, text: undefined, reasoning: undefined },
  };
}
