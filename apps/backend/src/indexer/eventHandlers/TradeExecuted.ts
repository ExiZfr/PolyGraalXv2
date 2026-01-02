import { Log, decodeEventLog } from 'viem';
import { db, trades, orders, markets } from '../../db/client';
import { eq } from 'drizzle-orm';
import { redis, REDIS_CHANNELS } from '../../config/redis';

const TradeExecutedAbi = {
    type: 'event',
    name: 'TradeExecuted',
    inputs: [
        { name: 'orderId', type: 'bytes32', indexed: true },
        { name: 'trader', type: 'address', indexed: true },
        { name: 'marketId', type: 'bytes32', indexed: true },
        { name: 'isLong', type: 'bool', indexed: false },
        { name: 'size', type: 'uint256', indexed: false },
        { name: 'price', type: 'uint256', indexed: false },
        { name: 'fee', type: 'uint256', indexed: false },
    ],
} as const;

/**
 * Handle TradeExecuted event from the PerpetualEngine contract
 * Updates trades table and publishes to WebSocket channel
 */
export async function handleTradeExecuted(log: Log): Promise<void> {
    try {
        const decoded = decodeEventLog({
            abi: [TradeExecutedAbi],
            data: log.data,
            topics: log.topics,
        });

        const { orderId, trader, marketId, isLong, size, price, fee } = decoded.args;

        // Find the market
        const market = await db.query.markets.findFirst({
            where: eq(markets.marketId, marketId),
        });

        if (!market) {
            console.warn(`Market not found for ID: ${marketId}`);
            return;
        }

        // Insert trade record
        const [trade] = await db
            .insert(trades)
            .values({
                txHash: log.transactionHash!,
                blockNumber: Number(log.blockNumber),
                marketId: market.id,
                userAddress: trader.toLowerCase(),
                side: isLong ? 'LONG' : 'SHORT',
                size: size.toString(),
                price: price.toString(),
                fee: fee.toString(),
            })
            .returning();

        // Update order status if exists
        const order = await db.query.orders.findFirst({
            where: eq(orders.orderId, orderId),
        });

        if (order) {
            await db
                .update(orders)
                .set({
                    status: 'FILLED',
                    filledSize: size.toString(),
                    avgFillPrice: price.toString(),
                    fee: fee.toString(),
                    updatedAt: new Date(),
                })
                .where(eq(orders.orderId, orderId));
        }

        // Publish to WebSocket channel
        await redis.publish(
            REDIS_CHANNELS.TRADES,
            JSON.stringify({
                type: 'TRADE',
                data: {
                    marketId,
                    side: isLong ? 'LONG' : 'SHORT',
                    size: size.toString(),
                    price: price.toString(),
                    timestamp: Date.now(),
                },
            })
        );

        console.log(`✅ Trade recorded: ${trader} ${isLong ? 'LONG' : 'SHORT'} ${size} @ ${price}`);
    } catch (error) {
        console.error('Error handling TradeExecuted:', error);
        throw error;
    }
}
