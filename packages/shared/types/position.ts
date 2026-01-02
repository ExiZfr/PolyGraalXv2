/**
 * Position side
 */
export type PositionSide = 'LONG' | 'SHORT';

/**
 * Position status
 */
export type PositionStatus = 'OPEN' | 'CLOSED' | 'LIQUIDATED';

/**
 * Position representation
 */
export interface Position {
    id: string;
    positionId: string; // On-chain ID
    marketId: string;
    userAddress: string;

    // Position Details
    side: PositionSide;
    size: string;
    entryPrice: string;
    margin: string;
    leverage: number;

    // PnL
    unrealizedPnl: string;
    realizedPnl: string;
    fundingPayment: string;

    // Status
    status: PositionStatus;
    liquidationPrice: string;

    // Timestamps
    openedAt: Date;
    closedAt?: Date;
}

/**
 * Position with market info
 */
export interface PositionWithMarket extends Position {
    market: {
        name: string;
        baseAsset: string;
    };
}
