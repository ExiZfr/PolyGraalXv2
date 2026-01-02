import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db, orders } from '../../db/client';
import { eq } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth';

const createOrderSchema = z.object({
    marketId: z.string(),
    side: z.enum(['LONG', 'SHORT']),
    type: z.enum(['MARKET', 'LIMIT']),
    size: z.string(), // BigNumber as string
    price: z.string().optional(), // Required for limit orders
    leverage: z.number().int().min(1).max(100),
});

/**
 * Orders API routes
 */
export async function ordersRoutes(server: FastifyInstance): Promise<void> {
    // Apply auth middleware to all routes
    server.addHook('preHandler', authMiddleware);

    // Create new order
    server.post('/', async (request, reply) => {
        const userAddress = (request as any).user?.address;

        if (!userAddress) {
            return reply.status(401).send({
                success: false,
                error: 'Authentication required',
            });
        }

        try {
            const body = createOrderSchema.parse(request.body);

            // Validate limit order has price
            if (body.type === 'LIMIT' && !body.price) {
                return reply.status(400).send({
                    success: false,
                    error: 'Price required for limit orders',
                });
            }

            // TODO: Submit to smart contract and get orderId
            // For now, return placeholder
            return reply.status(201).send({
                success: true,
                data: {
                    message: 'Order submitted. Sign the transaction in your wallet.',
                    order: {
                        ...body,
                        userAddress,
                        status: 'PENDING',
                    },
                },
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send({
                    success: false,
                    error: 'Invalid order parameters',
                    details: error.errors,
                });
            }
            throw error;
        }
    });

    // Get user's orders
    server.get('/', async (request, reply) => {
        const userAddress = (request as any).user?.address;

        const userOrders = await db.query.orders.findMany({
            where: eq(orders.userAddress, userAddress?.toLowerCase() || ''),
            with: {
                market: true,
            },
            orderBy: (orders, { desc }) => [desc(orders.createdAt)],
            limit: 100,
        });

        return reply.send({
            success: true,
            data: userOrders,
        });
    });

    // Cancel order
    server.delete<{ Params: { orderId: string } }>('/:orderId', async (request, reply) => {
        const userAddress = (request as any).user?.address;
        const { orderId } = request.params;

        const order = await db.query.orders.findFirst({
            where: eq(orders.orderId, orderId),
        });

        if (!order) {
            return reply.status(404).send({
                success: false,
                error: 'Order not found',
            });
        }

        if (order.userAddress.toLowerCase() !== userAddress?.toLowerCase()) {
            return reply.status(403).send({
                success: false,
                error: 'Not authorized to cancel this order',
            });
        }

        if (order.status !== 'PENDING') {
            return reply.status(400).send({
                success: false,
                error: 'Only pending orders can be cancelled',
            });
        }

        // TODO: Submit cancel to smart contract
        return reply.send({
            success: true,
            data: {
                message: 'Cancel order submitted. Sign the transaction in your wallet.',
            },
        });
    });
}
