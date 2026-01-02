import { createServer } from './api/server';
import { indexer } from './indexer';
import { closeDatabaseConnection } from './config/database';
import { closeRedisConnection } from './config/redis';
import { env } from './config/env';

/**
 * Main application entry point
 * Starts the API server and blockchain indexer
 */
async function main(): Promise<void> {
    console.log('🚀 Starting PolyGraalX Backend...');
    console.log(`📦 Environment: ${env.NODE_ENV}`);

    try {
        // Create and start API server
        const server = await createServer();

        await server.listen({
            port: env.API_PORT,
            host: env.API_HOST,
        });

        console.log(`✅ API Server running on http://${env.API_HOST}:${env.API_PORT}`);

        // Start blockchain indexer
        await indexer.start();

        // Graceful shutdown handler
        const shutdown = async (signal: string): Promise<void> => {
            console.log(`\n${signal} received. Shutting down gracefully...`);

            // Stop indexer
            indexer.stop();

            // Close server
            await server.close();

            // Close database connection
            await closeDatabaseConnection();

            // Close Redis connection
            await closeRedisConnection();

            console.log('👋 Goodbye!');
            process.exit(0);
        };

        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));

    } catch (error) {
        console.error('❌ Failed to start application:', error);
        process.exit(1);
    }
}

main();
