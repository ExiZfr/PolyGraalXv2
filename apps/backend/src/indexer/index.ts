import { createPublicClient, http, parseAbiItem, Log } from 'viem';
import { polygon } from 'viem/chains';
import { env } from '../config/env';
import { db, indexerState } from '../db/client';
import { eq } from 'drizzle-orm';
import { handleTradeExecuted } from './eventHandlers/TradeExecuted';
import { handlePositionOpened } from './eventHandlers/PositionOpened';
import { handlePositionClosed } from './eventHandlers/PositionClosed';
import { handleLiquidationEvent } from './eventHandlers/LiquidationEvent';
import { handleMarketCreated } from './eventHandlers/MarketCreated';

// Event signatures
const EVENTS = {
    TradeExecuted: parseAbiItem('event TradeExecuted(bytes32 indexed orderId, address indexed trader, bytes32 indexed marketId, bool isLong, uint256 size, uint256 price, uint256 fee)'),
    PositionOpened: parseAbiItem('event PositionOpened(bytes32 indexed positionId, address indexed trader, bytes32 indexed marketId, bool isLong, uint256 size, uint256 margin, uint256 leverage)'),
    PositionClosed: parseAbiItem('event PositionClosed(bytes32 indexed positionId, address indexed trader, int256 pnl)'),
    Liquidation: parseAbiItem('event Liquidation(bytes32 indexed positionId, address indexed trader, address indexed liquidator, uint256 penalty)'),
    MarketCreated: parseAbiItem('event MarketCreated(bytes32 indexed marketId, string name, uint256 maxLeverage)'),
};

/**
 * Blockchain indexer for processing on-chain events
 * Listens to contract events and updates PostgreSQL database
 */
export class Indexer {
    private client;
    private isRunning = false;
    private lastBlock = 0;

    constructor() {
        this.client = createPublicClient({
            chain: polygon,
            transport: http(env.RPC_URL),
        });
    }

    /**
     * Start the indexer
     */
    async start(): Promise<void> {
        if (this.isRunning) return;
        this.isRunning = true;

        console.log('🔍 Starting blockchain indexer...');

        // Get last processed block from database
        const state = await db.query.indexerState.findFirst({
            where: eq(indexerState.id, 1),
        });

        this.lastBlock = state?.lastProcessedBlock || env.INDEXER_START_BLOCK;
        console.log(`📦 Resuming from block ${this.lastBlock}`);

        // Start polling loop
        this.poll();
    }

    /**
     * Stop the indexer
     */
    stop(): void {
        this.isRunning = false;
        console.log('🛑 Indexer stopped');
    }

    /**
     * Poll for new blocks
     */
    private async poll(): Promise<void> {
        while (this.isRunning) {
            try {
                await this.processNewBlocks();
            } catch (error) {
                console.error('Indexer error:', error);
            }

            // Wait before next poll
            await new Promise((resolve) =>
                setTimeout(resolve, env.INDEXER_POLL_INTERVAL)
            );
        }
    }

    /**
     * Process new blocks since last checkpoint
     */
    private async processNewBlocks(): Promise<void> {
        const currentBlock = await this.client.getBlockNumber();

        if (currentBlock <= BigInt(this.lastBlock)) {
            return; // No new blocks
        }

        const fromBlock = BigInt(this.lastBlock + 1);
        const toBlock = currentBlock;

        // Skip if no contract addresses configured
        if (!env.PERPETUAL_ENGINE_ADDRESS) {
            this.lastBlock = Number(toBlock);
            return;
        }

        console.log(`📦 Processing blocks ${fromBlock} to ${toBlock}`);

        // Fetch all relevant events
        const logs = await this.client.getLogs({
            address: env.PERPETUAL_ENGINE_ADDRESS as `0x${string}`,
            fromBlock,
            toBlock,
        });

        // Process each log
        for (const log of logs) {
            await this.processLog(log);
        }

        // Update checkpoint
        await this.updateCheckpoint(Number(toBlock));
    }

    /**
     * Process a single log entry
     */
    private async processLog(log: Log): Promise<void> {
        const topic0 = log.topics[0];

        try {
            // Match event by topic
            if (topic0 === '0x...') { // TradeExecuted topic
                await handleTradeExecuted(log);
            } else if (topic0 === '0x...') { // PositionOpened topic
                await handlePositionOpened(log);
            } else if (topic0 === '0x...') { // PositionClosed topic
                await handlePositionClosed(log);
            } else if (topic0 === '0x...') { // Liquidation topic
                await handleLiquidationEvent(log);
            } else if (topic0 === '0x...') { // MarketCreated topic
                await handleMarketCreated(log);
            }
        } catch (error) {
            console.error('Error processing log:', error, log);
        }
    }

    /**
     * Update the last processed block in database
     */
    private async updateCheckpoint(blockNumber: number): Promise<void> {
        await db
            .insert(indexerState)
            .values({ id: 1, lastProcessedBlock: blockNumber })
            .onConflictDoUpdate({
                target: indexerState.id,
                set: {
                    lastProcessedBlock: blockNumber,
                    updatedAt: new Date(),
                },
            });

        this.lastBlock = blockNumber;
    }
}

// Singleton instance
export const indexer = new Indexer();
