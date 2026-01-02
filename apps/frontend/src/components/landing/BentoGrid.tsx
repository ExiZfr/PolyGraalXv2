'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, Wallet, BarChart3, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BentoGrid() {
    const features = [
        {
            title: "vAMM Powered Liquidity",
            description: "No liquidity providers needed. Trade instantly against a virtual Automated Market Maker with zero price impact for small orders.",
            icon: <Activity className="h-6 w-6 text-primary-400" />,
            className: "md:col-span-2",
            gradient: "from-primary-900/20 to-primary-900/5"
        },
        {
            title: "Self-Custodial",
            description: "Your keys, your crypto. We never hold your funds. Smart contracts handle everything transparently on Polygon.",
            icon: <Wallet className="h-6 w-6 text-purple-400" />,
            className: "md:col-span-1",
            gradient: "from-purple-900/20 to-purple-900/5"
        },
        {
            title: "Professional Charting",
            description: "TradingView charts built-in. Analyze trends with 100+ indicators and real-time data feeds.",
            icon: <BarChart3 className="h-6 w-6 text-long" />,
            className: "md:col-span-1",
            gradient: "from-green-900/20 to-green-900/5"
        },
        {
            title: "Audited & Secure",
            description: "Smart contracts audited by top firms. Insurance fund protection against insolvency events.",
            icon: <ShieldCheck className="h-6 w-6 text-amber-400" />,
            className: "md:col-span-2",
            gradient: "from-amber-900/20 to-amber-900/5"
        },
    ];

    return (
        <section className="py-24 relative overflow-hidden">
            <div className="container px-4 md:px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
                        Built for <span className="text-primary-400">Pro Traders</span>
                    </h2>
                    <p className="text-lg text-zinc-400">
                        Advanced infrastructure for prediction markets.
                        Experience CEX-like speed with DEX security.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(200px,auto)]">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={cn(
                                "group relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/50 p-8 hover:border-white/10 transition-all duration-300",
                                feature.className
                            )}
                        >
                            {/* Gradient Background */}
                            <div className={cn(
                                "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                                feature.gradient
                            )} />

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className="mb-4 p-3 bg-zinc-950/50 w-fit rounded-lg border border-white/5 backdrop-blur-sm">
                                    {feature.icon}
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-zinc-400 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
