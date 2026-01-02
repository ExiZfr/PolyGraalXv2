import Redis from 'ioredis';
import { env } from './env';

/**
 * Redis client for real-time orderbook and caching
 * Supports pub/sub for WebSocket updates
 */
export const redis = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
});

/**
 * Redis subscriber client for pub/sub channels
 * Separate connection for subscriptions
 */
export const redisSub = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
});

// Log connection events
redis.on('connect', () => console.log('✅ Redis connected'));
redis.on('error', (err) => console.error('❌ Redis error:', err));

/**
 * Health check for Redis connection
 */
export async function checkRedisConnection(): Promise<boolean> {
    try {
        const pong = await redis.ping();
        return pong === 'PONG';
    } catch (error) {
        console.error('Redis connection failed:', error);
        return false;
    }
}

/**
 * Graceful shutdown handler
 */
export async function closeRedisConnection(): Promise<void> {
    await redis.quit();
    await redisSub.quit();
}

/**
 * Redis key prefixes for different data types
 */
export const REDIS_KEYS = {
    ORDERBOOK: (marketId: string) => `orderbook:${marketId}`,
    MARKET_PRICE: (marketId: string) => `price:${marketId}`,
    USER_SESSION: (userId: string) => `session:${userId}`,
    RATE_LIMIT: (ip: string) => `ratelimit:${ip}`,
} as const;

/**
 * Pub/Sub channel names
 */
export const REDIS_CHANNELS = {
    TRADES: 'channel:trades',
    ORDERBOOK: 'channel:orderbook',
    POSITIONS: 'channel:positions',
    PRICES: 'channel:prices',
} as const;
