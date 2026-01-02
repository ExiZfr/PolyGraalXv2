import { Log, decodeEventLog } from 'viem';
import { db, positions, markets } from '../../db/client';
import { eq } from 'drizzle-orm';
import { redis, REDIS_CHANNELS } from '../../config/redis';

const PositionOpenedAbi = {
    type: 'event',
    name: 'PositionOpened',
    inputs: [
        { name: 'positionId', type: 'bytes32', indexed: true },
        { name: 'trader', type: 'address', indexed: true },
        { name: 'marketId', type: 'bytes32', indexed: true },
        { name: 'isLong', type: 'bool', indexed: false },
        { name: 'size', type: 'uint256', indexed: false },
        { name: 'margin', type: 'uint256', indexed: false },
        { name: 'leverage', type: 'uint256', indexed: false },
        { name: 'entryPrice', type: 'uint256', indexed: false },
        { name: 'liquidationPrice', type: 'uint256', indexed: false },
    ],
} as const;

/**
 * Handle PositionOpened event
 * Creates a new position record in the database
 */
export async function handlePositionOpened(log: Log): Promise<void> {
    try {
        const decoded = decodeEventLog({
            abi: [PositionOpenedAbi],
            data: log.data,
            topics: log.topics,
        });

        const { positionId, trader, marketId, isLong, size, margin, leverage, entryPrice, liquidationPrice } = decoded.args;

        // Find the market
        const market = await db.query.markets.findFirst({
            where: eq(markets.marketId, marketId),
        });

        if (!market) {
            console.warn(`Market not found for ID: ${marketId}`);
            return;
        }

        // Insert position record
        await db.insert(positions).values({
            positionId,
            marketId: market.id,
            userAddress: trader.toLowerCase(),
            side: isLong ? 'LONG' : 'SHORT',
            size: size.toString(),
            entryPrice: entryPrice.toString(),
            margin: margin.toString(),
            leverage: Number(leverage),
            liquidationPrice: liquidationPrice.toString(),
            status: 'OPEN',
        });

        // Publish to WebSocket channel
        await redis.publish(
            REDIS_CHANNELS.POSITIONS,
            JSON.stringify({
                type: 'POSITION_OPENED',
                data: {
                    positionId,
                    trader,
                    marketId,
                    side: isLong ? 'LONG' : 'SHORT',
                    size: size.toString(),
                    leverage: Number(leverage),
                },
            })
        );

        console.log(`✅ Position opened: ${positionId} by ${trader}`);
    } catch (error) {
        console.error('Error handling PositionOpened:', error);
        throw error;
    }
}
