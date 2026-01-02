import { Log, decodeEventLog } from 'viem';
import { db, markets } from '../../db/client';

const MarketCreatedAbi = {
    type: 'event',
    name: 'MarketCreated',
    inputs: [
        { name: 'marketId', type: 'bytes32', indexed: true },
        { name: 'name', type: 'string', indexed: false },
        { name: 'baseAsset', type: 'string', indexed: false },
        { name: 'maxLeverage', type: 'uint256', indexed: false },
        { name: 'kValue', type: 'uint256', indexed: false },
        { name: 'baseReserve', type: 'uint256', indexed: false },
        { name: 'quoteReserve', type: 'uint256', indexed: false },
    ],
} as const;

/**
 * Handle MarketCreated event
 * Creates a new market record in the database
 */
export async function handleMarketCreated(log: Log): Promise<void> {
    try {
        const decoded = decodeEventLog({
            abi: [MarketCreatedAbi],
            data: log.data,
            topics: log.topics,
        });

        const { marketId, name, baseAsset, maxLeverage, kValue, baseReserve, quoteReserve } = decoded.args;

        // Insert market record
        await db.insert(markets).values({
            marketId,
            name,
            baseAsset,
            quoteAsset: 'USDC',
            maxLeverage: Number(maxLeverage),
            kValue: kValue.toString(),
            baseReserve: baseReserve.toString(),
            quoteReserve: quoteReserve.toString(),
            isActive: true,
        });

        console.log(`✅ Market created: ${name} (${marketId})`);
    } catch (error) {
        console.error('Error handling MarketCreated:', error);
        throw error;
    }
}
