import type { PositionSide } from './position';

/**
 * Order type
 */
export type OrderType = 'MARKET' | 'LIMIT';

/**
 * Order status
 */
export type OrderStatus = 'PENDING' | 'FILLED' | 'CANCELLED' | 'EXPIRED';

/**
 * Order representation
 */
export interface Order {
    id: string;
    orderId: string; // On-chain ID
    marketId: string;
    positionId?: string;
    userAddress: string;

    // Order Details
    side: PositionSide;
    type: OrderType;
    size: string;
    price?: string;
    leverage: number;

    // Execution
    filledSize: string;
    avgFillPrice?: string;
    fee: string;

    // Status
    status: OrderStatus;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
    expiresAt?: Date;
}

/**
 * Create order request
 */
export interface CreateOrderRequest {
    marketId: string;
    side: PositionSide;
    type: OrderType;
    size: string;
    price?: string;
    leverage: number;
}
