import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const isUpstashConfigured = Boolean(upstashUrl && upstashToken);

const redis = isUpstashConfigured
  ? new Redis({
      url: upstashUrl!,
      token: upstashToken!,
    })
  : null;

// Distributed Upstash limiters
export const authRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "60 s"),
      analytics: true,
      prefix: "quickfix:ratelimit:auth",
    })
  : null;

export const generalRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(60, "60 s"),
      analytics: true,
      prefix: "quickfix:ratelimit:general",
    })
  : null;

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

// In-memory fallback for local dev/testing without Upstash
const memoryStore = new Map<string, { count: number; resetAt: number }>();

function inMemoryRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const entry = memoryStore.get(identifier);

  if (!entry || entry.resetAt <= now) {
    memoryStore.set(identifier, { count: 1, resetAt: now + windowMs });
    return { success: true, limit, remaining: limit - 1, reset: now + windowMs };
  }

  if (entry.count < limit) {
    entry.count += 1;
    return {
      success: true,
      limit,
      remaining: limit - entry.count,
      reset: entry.resetAt,
    };
  }

  return {
    success: false,
    limit,
    remaining: 0,
    reset: entry.resetAt,
  };
}

/**
 * Checks rate limit for a specific identifier (e.g. client IP or user ID).
 * Automatically uses Upstash when configured, otherwise falls back to local memory.
 */
export async function checkRateLimit(
  identifier: string,
  type: "auth" | "general" = "general"
): Promise<RateLimitResult> {
  const limiter = type === "auth" ? authRatelimit : generalRatelimit;

  if (limiter) {
    return await limiter.limit(identifier);
  }

  // In-memory fallback: 10/min for auth, 60/min for general
  const limit = type === "auth" ? 10 : 60;
  const windowMs = 60 * 1000;
  return inMemoryRateLimit(`${type}:${identifier}`, limit, windowMs);
}
