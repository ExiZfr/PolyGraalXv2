'use client';

import Link from 'next/link';
import { Github, Twitter, MessageSquare, Book } from 'lucide-react';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-zinc-950 border-t border-white/5 py-12 relative z-10">
            <div className="container px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="text-2xl font-bold text-white mb-4 block">
                            Poly<span className="text-primary-500">Bet</span>
                        </Link>
                        <p className="text-zinc-500 text-sm leading-relaxed">
                            The premier decentralized exchange for prediction markets. Built on Polygon for speed and low fees.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Platform</h4>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li><Link href="/markets" className="hover:text-primary-400">Markets</Link></li>
                            <li><Link href="/portfolio" className="hover:text-primary-400">Portfolio</Link></li>
                            <li><Link href="/leaderboard" className="hover:text-primary-400">Leaderboard</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li><a href="#" className="hover:text-primary-400">Documentation</a></li>
                            <li><a href="#" className="hover:text-primary-400">API Reference</a></li>
                            <li><a href="#" className="hover:text-primary-400">Status</a></li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Community</h4>
                        <div className="flex gap-4">
                            <a href="#" className="text-zinc-400 hover:text-white transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="text-zinc-400 hover:text-white transition-colors"><Github size={20} /></a>
                            <a href="#" className="text-zinc-400 hover:text-white transition-colors"><MessageSquare size={20} /></a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600">
                    <p>© {currentYear} PolyBet Futures. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/terms" className="hover:text-zinc-400">Terms</Link>
                        <Link href="/privacy" className="hover:text-zinc-400">Privacy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
