import { FastifyInstance } from 'fastify';
import { db, positions, trades } from '../../db/client';
import { eq, sql, and } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth';

/**
 * Account API routes
 */
export async function accountRoutes(server: FastifyInstance): Promise<void> {
    // Apply auth middleware to all routes
    server.addHook('preHandler', authMiddleware);

    // Get account summary
    server.get('/summary', async (request, reply) => {
        const userAddress = (request as any).user?.address;

        if (!userAddress) {
            return reply.status(401).send({
                success: false,
                error: 'Authentication required',
            });
        }

        const address = userAddress.toLowerCase();

        // Get position stats
        const openPositions = await db.query.positions.findMany({
            where: and(
                eq(positions.userAddress, address),
                eq(positions.status, 'OPEN')
            ),
        });

        // Calculate totals
        const totalMargin = openPositions.reduce(
            (sum, p) => sum + parseFloat(p.margin),
            0
        );
        const totalUnrealizedPnl = openPositions.reduce(
            (sum, p) => sum + parseFloat(p.unrealizedPnl || '0'),
            0
        );

        // Get trade count
        const tradeStats = await db
            .select({
                count: sql<number>`count(*)`,
                volume: sql<string>`sum(${trades.size}::numeric * ${trades.price}::numeric)`,
            })
            .from(trades)
            .where(eq(trades.userAddress, address));

        return reply.send({
            success: true,
            data: {
                address: userAddress,
                openPositions: openPositions.length,
                totalMargin: totalMargin.toString(),
                totalUnrealizedPnl: totalUnrealizedPnl.toString(),
                totalTrades: tradeStats[0]?.count || 0,
                totalVolume: tradeStats[0]?.volume || '0',
            },
        });
    });

    // Get trade history
    server.get('/trades', async (request, reply) => {
        const userAddress = (request as any).user?.address;

        const userTrades = await db.query.trades.findMany({
            where: eq(trades.userAddress, userAddress?.toLowerCase() || ''),
            with: {
                market: {
                    columns: { name: true, baseAsset: true },
                },
            },
            orderBy: (trades, { desc }) => [desc(trades.executedAt)],
            limit: 100,
        });

        return reply.send({
            success: true,
            data: userTrades,
        });
    });
}
