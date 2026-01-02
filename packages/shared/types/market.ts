/**
 * Market representation
 */
export interface Market {
    id: string;
    marketId: string; // On-chain ID
    name: string;
    description?: string;
    baseAsset: string;
    quoteAsset: string;

    // vAMM Parameters
    kValue: string;
    baseReserve: string;
    quoteReserve: string;

    // Trading Parameters
    maxLeverage: number;
    maintenanceMargin: string;
    takerFee: string;
    makerFee: string;

    // Market Status
    isActive: boolean;
    expiryTimestamp?: Date;
    settlementPrice?: string;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Market price data
 */
export interface MarketPrice {
    marketId: string;
    markPrice: string;
    indexPrice: string;
    fundingRate: string;
    volume24h: string;
    change24h: string;
    high24h: string;
    low24h: string;
    openInterest: string;
    timestamp: number;
}

/**
 * Orderbook data
 */
export interface OrderbookLevel {
    price: string;
    size: string;
}

export interface Orderbook {
    bids: OrderbookLevel[];
    asks: OrderbookLevel[];
    lastUpdate: number;
}
