'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

/**
 * Site header with navigation and wallet connection
 */
export function Header() {
    return (
        <header className="sticky top-0 z-50 bg-dark-900/90 backdrop-blur-md border-b border-dark-700">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">P</span>
                        </div>
                        <span className="text-xl font-bold gradient-text">PolyGraalX</span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
                        <Link
                            href="/trade/featured"
                            className="text-gray-300 hover:text-white transition-colors"
                        >
                            Trade
                        </Link>
                        <Link
                            href="/markets"
                            className="text-gray-300 hover:text-white transition-colors"
                        >
                            Markets
                        </Link>
                        <Link
                            href="/portfolio"
                            className="text-gray-300 hover:text-white transition-colors"
                        >
                            Portfolio
                        </Link>
                        <a
                            href="https://docs.polygraalx.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-300 hover:text-white transition-colors"
                        >
                            Docs
                        </a>
                    </nav>

                    {/* Wallet Connection */}
                    <div className="flex items-center gap-4">
                        <ConnectButton
                            showBalance={false}
                            chainStatus="icon"
                            accountStatus={{
                                smallScreen: 'avatar',
                                largeScreen: 'full',
                            }}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
