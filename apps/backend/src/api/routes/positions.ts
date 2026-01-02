import { FastifyInstance } from 'fastify';
import { db, positions } from '../../db/client';
import { eq, and } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth';

/**
 * Positions API routes
 */
export async function positionsRoutes(server: FastifyInstance): Promise<void> {
    // Apply auth middleware to all routes
    server.addHook('preHandler', authMiddleware);

    // Get all positions for authenticated user
    server.get('/', async (request, reply) => {
        const userAddress = (request as any).user?.address;

        if (!userAddress) {
            return reply.status(401).send({
                success: false,
                error: 'Authentication required',
            });
        }

        const userPositions = await db.query.positions.findMany({
            where: eq(positions.userAddress, userAddress.toLowerCase()),
            with: {
                market: true,
            },
            orderBy: (positions, { desc }) => [desc(positions.openedAt)],
        });

        return reply.send({
            success: true,
            data: userPositions,
        });
    });

    // Get open positions only
    server.get('/open', async (request, reply) => {
        const userAddress = (request as any).user?.address;

        if (!userAddress) {
            return reply.status(401).send({
                success: false,
                error: 'Authentication required',
            });
        }

        const openPositions = await db.query.positions.findMany({
            where: and(
                eq(positions.userAddress, userAddress.toLowerCase()),
                eq(positions.status, 'OPEN')
            ),
            with: {
                market: true,
            },
        });

        return reply.send({
            success: true,
            data: openPositions,
        });
    });

    // Get position by ID
    server.get<{ Params: { positionId: string } }>('/:positionId', async (request, reply) => {
        const userAddress = (request as any).user?.address;
        const { positionId } = request.params;

        const position = await db.query.positions.findFirst({
            where: and(
                eq(positions.positionId, positionId),
                eq(positions.userAddress, userAddress?.toLowerCase() || '')
            ),
            with: {
                market: true,
                orders: true,
            },
        });

        if (!position) {
            return reply.status(404).send({
                success: false,
                error: 'Position not found',
            });
        }

        return reply.send({
            success: true,
            data: position,
        });
    });
}
