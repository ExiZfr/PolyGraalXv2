/**
 * Format a number as USD currency
 */
export function formatUSD(value: number | string, decimals = 2): string {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(num);
}

/**
 * Format a number with compact notation (1K, 1M, 1B)
 */
export function formatCompact(value: number | string): string {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short',
    }).format(num);
}

/**
 * Format a price with appropriate decimals
 */
export function formatPrice(value: number | string, decimals = 4): string {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return num.toFixed(decimals);
}

/**
 * Format a percentage
 */
export function formatPercent(value: number | string, decimals = 2): string {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    const sign = num >= 0 ? '+' : '';
    return `${sign}${num.toFixed(decimals)}%`;
}

/**
 * Format an address with ellipsis
 */
export function formatAddress(address: string, chars = 4): string {
    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format size with units (e.g., 1.5K, 2.3M)
 */
export function formatSize(value: number | string): string {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (num >= 1_000_000) {
        return `${(num / 1_000_000).toFixed(2)}M`;
    }
    if (num >= 1_000) {
        return `${(num / 1_000).toFixed(2)}K`;
    }
    return num.toFixed(2);
}
