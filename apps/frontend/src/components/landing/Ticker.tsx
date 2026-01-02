'use client';

import { motion } from 'framer-motion';
import { cn, formatCurrency } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MOCK_TICKER_DATA = [
    { id: 1, market: 'BTC End of Year $100k?', outcome: 'YES', price: 0.45, change: 12.5 },
    { id: 2, market: 'Fed Rate Cut?', outcome: 'NO', price: 0.80, change: -5.2 },
    { id: 3, market: 'ETH > $4k by Q3?', outcome: 'YES', price: 0.32, change: 8.4 },
    { id: 4, market: 'US Election Winner', outcome: 'GOP', price: 0.55, change: 2.1 },
    { id: 5, market: 'Solana ATH 2024?', outcome: 'YES', price: 0.60, change: 15.3 },
    { id: 6, market: 'SpaceX Launch Succ?', outcome: 'YES', price: 0.92, change: 1.1 },
];

export function Ticker() {
    return (
        <div className="w-full bg-zinc-950 border-y border-white/5 overflow-hidden py-3 relative z-40">
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-zinc-950 to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-zinc-950 to-transparent z-10" />

            <div className="flex w-full overflow-hidden select-none">
                <motion.div
                    className="flex whitespace-nowrap gap-12 items-center"
                    animate={{ x: '-50%' }}
                    transition={{
                        duration: 40,
                        repeat: Infinity,
                        ease: "linear",
                        repeatType: "loop"
                    }}
                >
                    {[...MOCK_TICKER_DATA, ...MOCK_TICKER_DATA].map((item, i) => (
                        <div key={`${item.id}-${i}`} className="flex items-center gap-3">
                            <span className="text-sm font-medium text-zinc-300 font-mono">
                                {item.market}
                            </span>
                            <div className="flex items-center gap-2 bg-zinc-900/50 px-2 py-1 rounded border border-white/5">
                                <span className={cn(
                                    "text-xs font-bold px-1.5 py-0.5 rounded",
                                    item.outcome === 'YES' ? "bg-long/20 text-long" : "bg-short/20 text-short"
                                )}>
                                    {item.outcome}
                                </span>
                                <span className="text-sm font-bold text-white font-mono">
                                    {formatCurrency(item.price)}
                                </span>
                                <span className={cn(
                                    "text-xs flex items-center",
                                    item.change > 0 ? "text-long" : "text-short"
                                )}>
                                    {item.change > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                    {Math.abs(item.change)}%
                                </span>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
