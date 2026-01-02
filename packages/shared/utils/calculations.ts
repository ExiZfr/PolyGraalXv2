import type { PositionSide } from '../types/position';

/**
 * Calculate unrealized PnL for a position
 */
export function calculateUnrealizedPnL(
    side: PositionSide,
    entryPrice: string,
    currentPrice: string,
    size: string
): string {
    const entry = parseFloat(entryPrice);
    const current = parseFloat(currentPrice);
    const posSize = parseFloat(size);

    const priceDiff = side === 'LONG'
        ? current - entry
        : entry - current;

    return (priceDiff * posSize).toString();
}

/**
 * Calculate liquidation price
 */
export function calculateLiquidationPrice(
    side: PositionSide,
    entryPrice: string,
    leverage: number,
    maintenanceMargin: number = 0.0625 // 6.25%
): string {
    const entry = parseFloat(entryPrice);
    const marginRequired = 1 / leverage;
    const liquidationThreshold = marginRequired - maintenanceMargin;

    if (side === 'LONG') {
        return (entry * (1 - liquidationThreshold)).toString();
    } else {
        return (entry * (1 + liquidationThreshold)).toString();
    }
}

/**
 * Calculate position value
 */
export function calculatePositionValue(
    size: string,
    currentPrice: string
): string {
    return (parseFloat(size) * parseFloat(currentPrice)).toString();
}

/**
 * Calculate margin required
 */
export function calculateMarginRequired(
    size: string,
    price: string,
    leverage: number
): string {
    const notional = parseFloat(size) * parseFloat(price);
    return (notional / leverage).toString();
}

/**
 * Calculate ROE (Return on Equity)
 */
export function calculateROE(
    pnl: string,
    margin: string
): string {
    const pnlNum = parseFloat(pnl);
    const marginNum = parseFloat(margin);

    if (marginNum === 0) return '0';

    return ((pnlNum / marginNum) * 100).toString();
}

/**
 * Calculate vAMM price
 * price = quoteReserve / baseReserve
 */
export function calculateVAMMPrice(
    baseReserve: string,
    quoteReserve: string
): string {
    const base = parseFloat(baseReserve);
    const quote = parseFloat(quoteReserve);

    if (base === 0) return '0';

    return (quote / base).toString();
}

/**
 * Calculate slippage for a trade
 */
export function calculateSlippage(
    side: PositionSide,
    size: string,
    baseReserve: string,
    quoteReserve: string
): { newPrice: string; slippage: string } {
    const base = parseFloat(baseReserve);
    const quote = parseFloat(quoteReserve);
    const tradeSize = parseFloat(size);
    const k = base * quote;

    const currentPrice = quote / base;

    let newBase: number;
    let newQuote: number;

    if (side === 'LONG') {
        // Buying base with quote
        newBase = base - tradeSize;
        newQuote = k / newBase;
    } else {
        // Selling base for quote
        newBase = base + tradeSize;
        newQuote = k / newBase;
    }

    const newPrice = newQuote / newBase;
    const slippagePercent = Math.abs((newPrice - currentPrice) / currentPrice) * 100;

    return {
        newPrice: newPrice.toString(),
        slippage: slippagePercent.toString(),
    };
}
