import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { env } from './env';
import * as schema from '../db/schema';

/**
 * PostgreSQL connection pool
 * Configured for production use with connection limits
 */
const pool = new Pool({
    connectionString: env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Log pool errors
pool.on('error', (err) => {
    console.error('Unexpected PostgreSQL pool error:', err);
});

/**
 * Drizzle ORM database client
 * Used throughout the application for type-safe queries
 */
export const db = drizzle(pool, { schema });

/**
 * Health check for database connection
 */
export async function checkDatabaseConnection(): Promise<boolean> {
    try {
        const client = await pool.connect();
        await client.query('SELECT 1');
        client.release();
        return true;
    } catch (error) {
        console.error('Database connection failed:', error);
        return false;
    }
}

/**
 * Graceful shutdown handler
 */
export async function closeDatabaseConnection(): Promise<void> {
    await pool.end();
}
