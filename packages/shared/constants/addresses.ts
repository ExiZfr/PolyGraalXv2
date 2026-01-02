/**
 * Contract addresses by chain ID
 */
export const ADDRESSES = {
    // Polygon Mainnet
    137: {
        PERPETUAL_ENGINE: '' as `0x${string}`,
        VAMM: '' as `0x${string}`,
        MARKET_REGISTRY: '' as `0x${string}`,
        INSURANCE_FUND: '' as `0x${string}`,
        USDC: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359' as `0x${string}`,
    },
    // Polygon Amoy Testnet
    80002: {
        PERPETUAL_ENGINE: '' as `0x${string}`,
        VAMM: '' as `0x${string}`,
        MARKET_REGISTRY: '' as `0x${string}`,
        INSURANCE_FUND: '' as `0x${string}`,
        USDC: '' as `0x${string}`,
    },
} as const;

export type ChainId = keyof typeof ADDRESSES;

export function getAddresses(chainId: ChainId) {
    return ADDRESSES[chainId];
}
