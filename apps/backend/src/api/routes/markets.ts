import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db, markets } from '../../db/client';
import { eq } from 'drizzle-orm';

/**
 * Markets API routes
 */
export async function marketsRoutes(server: FastifyInstance): Promise<void> {
    // Get all active markets
    server.get('/', async (_request, reply) => {
        const allMarkets = await db.query.markets.findMany({
            where: eq(markets.isActive, true),
            orderBy: (markets, { desc }) => [desc(markets.createdAt)],
        });

        return reply.send({
            success: true,
            data: allMarkets,
        });
    });

    // Get market by ID
    server.get<{ Params: { marketId: string } }>('/:marketId', async (request, reply) => {
        const { marketId } = request.params;

        const market = await db.query.markets.findFirst({
            where: eq(markets.marketId, marketId),
            with: {
                fundingRates: {
                    limit: 24,
                    orderBy: (fr, { desc }) => [desc(fr.timestamp)],
                },
            },
        });

        if (!market) {
            return reply.status(404).send({
                success: false,
                error: 'Market not found',
            });
        }

        return reply.send({
            success: true,
            data: market,
        });
    });

    // Get market orderbook (from Redis)
    server.get<{ Params: { marketId: string } }>('/:marketId/orderbook', async (request, reply) => {
        const { marketId } = request.params;

        // TODO: Fetch from Redis orderbook
        // const orderbook = await redis.get(REDIS_KEYS.ORDERBOOK(marketId));

        return reply.send({
            success: true,
            data: {
                bids: [],
                asks: [],
                lastUpdate: Date.now(),
            },
        });
    });

    // Get recent trades for a market
    server.get<{ Params: { marketId: string }; Querystring: { limit?: number } }>(
        '/:marketId/trades',
        async (request, reply) => {
            const { marketId } = request.params;
            const limit = request.query.limit || 50;

            const market = await db.query.markets.findFirst({
                where: eq(markets.marketId, marketId),
            });

            if (!market) {
                return reply.status(404).send({
                    success: false,
                    error: 'Market not found',
                });
            }

            const recentTrades = await db.query.trades.findMany({
                where: eq(markets.id, market.id),
                limit: Math.min(limit, 100),
                orderBy: (trades, { desc }) => [desc(trades.executedAt)],
            });

            return reply.send({
                success: true,
                data: recentTrades,
            });
        }
    );
}
