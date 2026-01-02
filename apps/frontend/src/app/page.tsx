import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import type { Metadata } from 'next';

// Page-specific SEO
export const metadata: Metadata = {
    title: 'Trade Prediction Market Perpetuals | PolyGraalX',
    description: 'The first decentralized exchange for trading perpetual futures on prediction market outcomes. Long or short real-world events with up to 100x leverage on Polygon.',
    alternates: {
        canonical: 'https://polygraalx.com',
    },
};

export default function HomePage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden py-20 lg:py-32">
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-transparent to-purple-900/20" />

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-sm mb-8">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                                </span>
                                Live on Polygon Mainnet
                            </div>

                            {/* Main headline - H1 for SEO */}
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
                                <span className="gradient-text">Trade the Future</span>
                                <br />
                                <span className="text-gray-100">of Real Events</span>
                            </h1>

                            {/* Subheadline */}
                            <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto">
                                Perpetual futures for prediction markets.
                                <span className="text-long font-semibold"> Long</span> or
                                <span className="text-short font-semibold"> Short</span> any outcome with up to
                                <span className="text-primary-400 font-semibold"> 100x leverage</span>.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/trade/featured"
                                    className="btn-primary text-lg px-8 py-4 glow-primary"
                                >
                                    Start Trading
                                </Link>
                                <Link
                                    href="/markets"
                                    className="bg-dark-700 hover:bg-dark-600 text-gray-100 font-medium text-lg px-8 py-4 rounded-lg transition-colors duration-200"
                                >
                                    View Markets
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-16 border-y border-dark-700">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { label: 'Total Volume', value: '$0', suffix: '' },
                                { label: 'Open Interest', value: '$0', suffix: '' },
                                { label: 'Markets', value: '0', suffix: '+' },
                                { label: 'Max Leverage', value: '100', suffix: 'x' },
                            ].map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold text-gray-100 mb-2">
                                        {stat.value}<span className="text-primary-400">{stat.suffix}</span>
                                    </div>
                                    <div className="text-gray-500">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                            Why Trade on <span className="gradient-text">PolyGraalX</span>?
                        </h2>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: 'Prediction Market Perps',
                                    description: 'Trade perpetual futures on real-world event outcomes. Elections, sports, crypto prices, and more.',
                                    icon: '🎯',
                                },
                                {
                                    title: 'Up to 100x Leverage',
                                    description: 'Amplify your positions with industry-leading leverage. Start with as little as $10.',
                                    icon: '📈',
                                },
                                {
                                    title: 'Non-Custodial & Secure',
                                    description: 'Your keys, your coins. Trade directly from your wallet with no intermediaries.',
                                    icon: '🔐',
                                },
                                {
                                    title: 'Deep Liquidity',
                                    description: 'vAMM design ensures deep liquidity and minimal slippage on every trade.',
                                    icon: '💧',
                                },
                                {
                                    title: 'Low Fees',
                                    description: '0.1% taker fees, 0.05% maker fees. Built on Polygon for gas efficiency.',
                                    icon: '💰',
                                },
                                {
                                    title: '24/7 Trading',
                                    description: 'Markets never close. Trade anytime, anywhere, on any device.',
                                    icon: '🌍',
                                },
                            ].map((feature, index) => (
                                <article key={index} className="trading-card hover:border-primary-500/50 transition-colors duration-300">
                                    <div className="text-4xl mb-4">{feature.icon}</div>
                                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-gray-400">{feature.description}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gradient-to-r from-primary-900/20 to-purple-900/20">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Ready to Trade the Future?
                        </h2>
                        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                            Connect your wallet and start trading prediction market perpetuals in seconds.
                        </p>
                        <Link
                            href="/trade/featured"
                            className="btn-primary text-lg px-8 py-4 inline-block glow-primary"
                        >
                            Launch App
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
