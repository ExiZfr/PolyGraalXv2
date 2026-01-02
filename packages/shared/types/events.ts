import type { PositionSide } from './position';

/**
 * WebSocket event types
 */
export type WSEventType =
    | 'CONNECTED'
    | 'SUBSCRIBED'
    | 'UNSUBSCRIBED'
    | 'TRADE'
    | 'ORDERBOOK_UPDATE'
    | 'POSITION_OPENED'
    | 'POSITION_CLOSED'
    | 'LIQUIDATION'
    | 'PRICE_UPDATE'
    | 'PONG';

/**
 * Base WebSocket message
 */
export interface WSMessage<T = unknown> {
    type: WSEventType;
    data?: T;
    timestamp?: number;
}

/**
 * Trade event data
 */
export interface TradeEvent {
    marketId: string;
    side: PositionSide;
    size: string;
    price: string;
    timestamp: number;
}

/**
 * Orderbook update event
 */
export interface OrderbookUpdateEvent {
    marketId: string;
    bids: Array<{ price: string; size: string }>;
    asks: Array<{ price: string; size: string }>;
}

/**
 * Price update event
 */
export interface PriceUpdateEvent {
    marketId: string;
    markPrice: string;
    indexPrice: string;
    fundingRate: string;
}

/**
 * Position event data
 */
export interface PositionEvent {
    positionId: string;
    trader: string;
    marketId?: string;
    pnl?: string;
}

/**
 * Liquidation event data
 */
export interface LiquidationEvent {
    positionId: string;
    trader: string;
    liquidator: string;
    penalty: string;
}
