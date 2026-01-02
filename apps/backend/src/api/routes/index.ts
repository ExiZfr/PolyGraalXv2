import { FastifyInstance } from 'fastify';
import { healthRoutes } from './health';
import { marketsRoutes } from './markets';
import { positionsRoutes } from './positions';
import { ordersRoutes } from './orders';
import { accountRoutes } from './account';

/**
 * Register all API routes with /api prefix
 */
export async function registerRoutes(server: FastifyInstance): Promise<void> {
    // Health check (no prefix)
    await server.register(healthRoutes);

    // API routes
    await server.register(async (api) => {
        await api.register(marketsRoutes, { prefix: '/markets' });
        await api.register(positionsRoutes, { prefix: '/positions' });
        await api.register(ordersRoutes, { prefix: '/orders' });
        await api.register(accountRoutes, { prefix: '/account' });
    }, { prefix: '/api' });
}
