import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import websocket from '@fastify/websocket';
import { env } from '../config/env';
import { registerRoutes } from './routes';
import { registerWebSocket } from '../websocket';

/**
 * Create and configure the Fastify server
 */
export async function createServer(): Promise<FastifyInstance> {
    const server = Fastify({
        logger: {
            level: env.LOG_LEVEL,
            transport: env.NODE_ENV === 'development' ? {
                target: 'pino-pretty',
                options: { colorize: true },
            } : undefined,
        },
        trustProxy: true,
    });

    // Security middleware
    await server.register(helmet, {
        contentSecurityPolicy: false, // Disabled for API
    });

    // CORS configuration
    await server.register(cors, {
        origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN.split(','),
        credentials: true,
    });

    // Rate limiting
    await server.register(rateLimit, {
        max: 100,
        timeWindow: '1 minute',
        keyGenerator: (request) => request.ip,
    });

    // WebSocket support
    await server.register(websocket, {
        options: { maxPayload: 1048576 }, // 1MB
    });

    // Register REST routes
    await registerRoutes(server);

    // Register WebSocket handlers
    await registerWebSocket(server);

    return server;
}
