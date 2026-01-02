import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { checkDatabaseConnection } from '../../db/client';
import { checkRedisConnection } from '../../config/redis';

interface HealthResponse {
    status: 'ok' | 'degraded' | 'unhealthy';
    timestamp: string;
    services: {
        database: boolean;
        redis: boolean;
    };
    version: string;
}

/**
 * Health check routes for monitoring
 */
export async function healthRoutes(server: FastifyInstance): Promise<void> {
    // Simple health check
    server.get('/health', async (_request: FastifyRequest, reply: FastifyReply) => {
        return reply.status(200).send({ status: 'ok' });
    });

    // Detailed health check
    server.get('/api/health', async (_request: FastifyRequest, reply: FastifyReply) => {
        const [dbHealthy, redisHealthy] = await Promise.all([
            checkDatabaseConnection(),
            checkRedisConnection(),
        ]);

        const allHealthy = dbHealthy && redisHealthy;
        const status: HealthResponse['status'] = allHealthy
            ? 'ok'
            : (dbHealthy || redisHealthy)
                ? 'degraded'
                : 'unhealthy';

        const response: HealthResponse = {
            status,
            timestamp: new Date().toISOString(),
            services: {
                database: dbHealthy,
                redis: redisHealthy,
            },
            version: process.env.npm_package_version || '0.1.0',
        };

        return reply.status(allHealthy ? 200 : 503).send(response);
    });
}
