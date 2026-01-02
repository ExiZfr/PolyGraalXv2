'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, TrendingUp } from 'lucide-react';

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary-500/20 blur-[120px] rounded-full opacity-50 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[800px] h-[600px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="container relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                    {/* Text Content */}
                    <div className="flex-1 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-6">
                                <Zap size={14} className="fill-primary-400" />
                                <span>Live on Polygon Mainnet</span>
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
                                Trade the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">Outcome</span>.
                                <br />
                                <span className="text-4xl lg:text-6xl text-zinc-400 font-medium">Real-World Events.</span>
                            </h1>

                            <p className="text-lg lg:text-xl text-zinc-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                The first vAMM-powered Perpetual DEX for Prediction Markets.
                                Long or short events with up to <span className="text-white font-semibold">20x leverage</span>.
                                Zero liquidity crunch. Instant execution.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                                <Link
                                    href="/markets"
                                    className="w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-semibold transition-all duration-200 shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] flex items-center justify-center gap-2"
                                >
                                    Start Trading <ArrowRight size={18} />
                                </Link>
                                <Link
                                    href="https://docs.polybet.com"
                                    className="w-full sm:w-auto px-8 py-4 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white rounded-xl font-semibold transition-all duration-200"
                                >
                                    Read Documentation
                                </Link>
                            </div>

                            {/* Stats */}
                            <div className="mt-12 grid grid-cols-3 gap-8 border-t border-white/5 pt-8">
                                <div>
                                    <div className="text-2xl font-bold text-white font-mono">$1.2M+</div>
                                    <div className="text-sm text-zinc-500">Total Volume</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white font-mono">15k+</div>
                                    <div className="text-sm text-zinc-500">Active Traders</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white font-mono">&lt;1s</div>
                                    <div className="text-sm text-zinc-500">Execution Time</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* 3D Visual Content */}
                    <div className="flex-1 w-full max-w-[600px] lg:max-w-none perspective-1000">
                        <motion.div
                            initial={{ opacity: 0, rotateX: 20, rotateY: -20, scale: 0.9 }}
                            animate={{ opacity: 1, rotateX: 12, rotateY: -12, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative preserve-3d"
                        >
                            {/* Floating Card */}
                            <div className="relative z-20 bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/50 backdrop-blur-xl">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                                            <span className="text-orange-500 font-bold">₿</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white">BTC > $100k EOY?</h3>
                                            <span className="text-xs text-zinc-400">Prediction Market</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-long font-mono">$0.45</div>
                                        <div className="text-xs text-long flex items-center justify-end gap-1">
                                            <TrendingUp size={12} /> +12.5%
                                        </div>
                                    </div>
                                </div>

                                {/* Chart Mockup */}
                                <div className="h-48 bg-gradient-to-b from-long/10 to-transparent rounded-lg border border-long/20 mb-6 flex items-end p-2 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                                    <svg className="w-full h-full" preserveAspectRatio="none">
                                        <path
                                            d="M0 150 C 50 140, 100 100, 150 110 C 200 120, 250 60, 300 80 C 350 100, 400 40, 450 50 L 450 200 L 0 200 Z"
                                            fill="url(#gradient)"
                                            className="opacity-20"
                                        />
                                        <path
                                            d="M0 150 C 50 140, 100 100, 150 110 C 200 120, 250 60, 300 80 C 350 100, 400 40, 450 50"
                                            stroke="#22c55e"
                                            strokeWidth="2"
                                            fill="none"
                                        />
                                        <defs>
                                            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.5" />
                                                <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>

                                {/* Actions */}
                                <div className="grid grid-cols-2 gap-4">
                                    <button className="bg-long hover:bg-long-dark text-white font-bold py-3 rounded-lg transition-colors shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                                        Buy YES
                                    </button>
                                    <button className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-lg transition-colors border border-white/5">
                                        Sell NO
                                    </button>
                                </div>
                            </div>

                            {/* Decorative Elements behind */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary-500 to-purple-600 rounded-3xl opacity-20 blur-2xl -z-10" />

                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
