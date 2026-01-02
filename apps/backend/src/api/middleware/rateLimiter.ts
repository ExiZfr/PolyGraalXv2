import { redis, REDIS_KEYS } from '../../config/redis';
import { env } from '../../config/env';

const WINDOW_SIZE = 60; // 1 minute
const MAX_REQUESTS = 100;

/**
 * Redis-based rate limiter for distributed limiting
 */
export async function checkRateLimit(ip: string): Promise<{
    allowed: boolean;
    remaining: number;
    resetAt: number;
}> {
    const key = REDIS_KEYS.RATE_LIMIT(ip);
    const now = Math.floor(Date.now() / 1000);
    const windowStart = now - WINDOW_SIZE;

    // Use Redis sorted set for sliding window
    const pipeline = redis.pipeline();

    // Remove old entries
    pipeline.zremrangebyscore(key, 0, windowStart);

    // Add current request
    pipeline.zadd(key, now, `${now}-${Math.random()}`);

    // Count requests in window
    pipeline.zcard(key);

    // Set expiry
    pipeline.expire(key, WINDOW_SIZE);

    const results = await pipeline.exec();
    const requestCount = results?.[2]?.[1] as number || 0;

    return {
        allowed: requestCount <= MAX_REQUESTS,
        remaining: Math.max(0, MAX_REQUESTS - requestCount),
        resetAt: now + WINDOW_SIZE,
    };
}
