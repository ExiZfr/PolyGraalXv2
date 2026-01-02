import { Log, decodeEventLog } from 'viem';
import { db, positions } from '../../db/client';
import { eq } from 'drizzle-orm';
import { redis, REDIS_CHANNELS } from '../../config/redis';

const PositionClosedAbi = {
    type: 'event',
    name: 'PositionClosed',
    inputs: [
        { name: 'positionId', type: 'bytes32', indexed: true },
        { name: 'trader', type: 'address', indexed: true },
        { name: 'pnl', type: 'int256', indexed: false },
    ],
} as const;

/**
 * Handle PositionClosed event
 * Updates position status to CLOSED and records PnL
 */
export async function handlePositionClosed(log: Log): Promise<void> {
    try {
        const decoded = decodeEventLog({
            abi: [PositionClosedAbi],
            data: log.data,
            topics: log.topics,
        });

        const { positionId, trader, pnl } = decoded.args;

        // Update position
        await db
            .update(positions)
            .set({
                status: 'CLOSED',
                realizedPnl: pnl.toString(),
                closedAt: new Date(),
            })
            .where(eq(positions.positionId, positionId));

        // Publish to WebSocket channel
        await redis.publish(
            REDIS_CHANNELS.POSITIONS,
            JSON.stringify({
                type: 'POSITION_CLOSED',
                data: {
                    positionId,
                    trader,
                    pnl: pnl.toString(),
                },
            })
        );

        console.log(`✅ Position closed: ${positionId} with PnL ${pnl}`);
    } catch (error) {
        console.error('Error handling PositionClosed:', error);
        throw error;
    }
}
