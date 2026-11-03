import { describe, it, expect } from "vitest";
import { computeTokenUsage, emptyUsage } from "../src/utils/compute-token-usage";

describe("computeTokenUsage", () => {
  it("maps prompt_tokens to inputTokens", () => {
    const usage = computeTokenUsage({ prompt_tokens: 10, completion_tokens: 5 });
    expect(usage.inputTokens.total).toBe(10);
  });

  it("maps completion_tokens to outputTokens", () => {
    const usage = computeTokenUsage({ prompt_tokens: 10, completion_tokens: 5 });
    expect(usage.outputTokens.total).toBe(5);
  });

  it("handles missing fields with defaults of 0", () => {
    const usage = computeTokenUsage({});
    expect(usage.inputTokens.total).toBe(0);
    expect(usage.outputTokens.total).toBe(0);
  });

  it("sets noCache to the input tokens not read from cache", () => {
    const usage = computeTokenUsage({
      prompt_tokens: 89846,
      completion_tokens: 326,
      prompt_tokens_details: { cached_tokens: 88960 },
    });
    expect(usage.inputTokens.total).toBe(89846);
    expect(usage.inputTokens.cacheRead).toBe(88960);
    expect(usage.inputTokens.noCache).toBe(886);
  });

  it("sets noCache to the full input when nothing was cached", () => {
    const usage = computeTokenUsage({ prompt_tokens: 120, completion_tokens: 5 });
    expect(usage.inputTokens.noCache).toBe(120);
    expect(usage.inputTokens.cacheRead).toBeUndefined();
  });

  it("never reports negative noCache", () => {
    const usage = computeTokenUsage({
      prompt_tokens: 10,
      prompt_tokens_details: { cached_tokens: 12 },
    });
    expect(usage.inputTokens.noCache).toBe(0);
  });

  it("handles partial usage", () => {
    const usage = computeTokenUsage({ prompt_tokens: 15 });
    expect(usage.inputTokens.total).toBe(15);
    expect(usage.outputTokens.total).toBe(0);
  });
});

describe("emptyUsage", () => {
  it("returns zero tokens", () => {
    const usage = emptyUsage();
    expect(usage.inputTokens.total).toBe(0);
    expect(usage.inputTokens.noCache).toBe(0);
    expect(usage.outputTokens.total).toBe(0);
  });
});
