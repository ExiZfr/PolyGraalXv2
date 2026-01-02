import { Log, decodeEventLog } from 'viem';
import { db, positions } from '../../db/client';
import { eq } from 'drizzle-orm';
import { redis, REDIS_CHANNELS } from '../../config/redis';

const LiquidationAbi = {
    type: 'event',
    name: 'Liquidation',
    inputs: [
        { name: 'positionId', type: 'bytes32', indexed: true },
        { name: 'trader', type: 'address', indexed: true },
        { name: 'liquidator', type: 'address', indexed: true },
        { name: 'penalty', type: 'uint256', indexed: false },
    ],
} as const;

/**
 * Handle Liquidation event
 * Updates position status to LIQUIDATED
 */
export async function handleLiquidationEvent(log: Log): Promise<void> {
    try {
        const decoded = decodeEventLog({
            abi: [LiquidationAbi],
            data: log.data,
            topics: log.topics,
        });

        const { positionId, trader, liquidator, penalty } = decoded.args;

        // Update position
        await db
            .update(positions)
            .set({
                status: 'LIQUIDATED',
                closedAt: new Date(),
            })
            .where(eq(positions.positionId, positionId));

        // Publish to WebSocket channel
        await redis.publish(
            REDIS_CHANNELS.POSITIONS,
            JSON.stringify({
                type: 'LIQUIDATION',
                data: {
                    positionId,
                    trader,
                    liquidator,
                    penalty: penalty.toString(),
                },
            })
        );

        console.log(`⚠️ Position liquidated: ${positionId} by ${liquidator}`);
    } catch (error) {
        console.error('Error handling Liquidation:', error);
        throw error;
    }
}
