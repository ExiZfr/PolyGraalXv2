import { z } from 'zod';

/**
 * Environment variable schema with validation
 * Ensures all required config is present at startup
 */
const envSchema = z.object({
    // General
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),

    // API Server
    API_PORT: z.coerce.number().default(4000),
    API_HOST: z.string().default('0.0.0.0'),
    JWT_SECRET: z.string().min(32),
    CORS_ORIGIN: z.string().default('*'),

    // Database
    DATABASE_URL: z.string().url(),

    // Redis
    REDIS_URL: z.string(),

    // Blockchain
    RPC_URL: z.string().url(),
    CHAIN_ID: z.coerce.number().default(137),

    // Contract Addresses
    PERPETUAL_ENGINE_ADDRESS: z.string().optional(),
    VAMM_ADDRESS: z.string().optional(),
    MARKET_REGISTRY_ADDRESS: z.string().optional(),
    INSURANCE_FUND_ADDRESS: z.string().optional(),

    // Indexer
    INDEXER_START_BLOCK: z.coerce.number().default(0),
    INDEXER_POLL_INTERVAL: z.coerce.number().default(2000),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validate and parse environment variables
 * Throws on invalid configuration
 */
function validateEnv(): Env {
    const result = envSchema.safeParse(process.env);

    if (!result.success) {
        console.error('❌ Invalid environment variables:');
        console.error(result.error.flatten().fieldErrors);
        process.exit(1);
    }

    return result.data;
}

export const env = validateEnv();
