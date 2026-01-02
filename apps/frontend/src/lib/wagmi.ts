import { http, createConfig } from 'wagmi';
import { polygon, polygonAmoy } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

// Chain configuration based on environment
const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '137');
const chain = chainId === 137 ? polygon : polygonAmoy;

export const wagmiConfig = getDefaultConfig({
    appName: 'PolyGraalX',
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
    chains: [chain],
    transports: {
        [chain.id]: http(),
    },
    ssr: true,
});

// Contract addresses (from environment)
export const CONTRACTS = {
    PERPETUAL_ENGINE: process.env.NEXT_PUBLIC_PERPETUAL_ENGINE_ADDRESS as `0x${string}`,
    VAMM: process.env.NEXT_PUBLIC_VAMM_ADDRESS as `0x${string}`,
    MARKET_REGISTRY: process.env.NEXT_PUBLIC_MARKET_REGISTRY_ADDRESS as `0x${string}`,
    INSURANCE_FUND: process.env.NEXT_PUBLIC_INSURANCE_FUND_ADDRESS as `0x${string}`,
} as const;
