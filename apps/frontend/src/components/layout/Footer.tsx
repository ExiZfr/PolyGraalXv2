import Link from 'next/link';

/**
 * Site footer with SEO-friendly links
 */
export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-dark-900 border-t border-dark-700 py-12" role="contentinfo">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                    {/* Product */}
                    <div>
                        <h3 className="font-semibold text-gray-100 mb-4">Product</h3>
                        <nav aria-label="Product links">
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/trade/featured" className="text-gray-400 hover:text-gray-200 transition-colors">
                                        Trade
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/markets" className="text-gray-400 hover:text-gray-200 transition-colors">
                                        Markets
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/portfolio" className="text-gray-400 hover:text-gray-200 transition-colors">
                                        Portfolio
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="font-semibold text-gray-100 mb-4">Resources</h3>
                        <nav aria-label="Resource links">
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="https://docs.polygraalx.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 hover:text-gray-200 transition-colors"
                                    >
                                        Documentation
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://github.com/polygraalx"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 hover:text-gray-200 transition-colors"
                                    >
                                        GitHub
                                    </a>
                                </li>
                                <li>
                                    <Link href="/faq" className="text-gray-400 hover:text-gray-200 transition-colors">
                                        FAQ
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-semibold text-gray-100 mb-4">Legal</h3>
                        <nav aria-label="Legal links">
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/terms" className="text-gray-400 hover:text-gray-200 transition-colors">
                                        Terms of Service
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/privacy" className="text-gray-400 hover:text-gray-200 transition-colors">
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/disclaimer" className="text-gray-400 hover:text-gray-200 transition-colors">
                                        Risk Disclaimer
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    {/* Community */}
                    <div>
                        <h3 className="font-semibold text-gray-100 mb-4">Community</h3>
                        <nav aria-label="Social links">
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="https://twitter.com/polygraalx"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 hover:text-gray-200 transition-colors"
                                    >
                                        Twitter
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://discord.gg/polygraalx"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 hover:text-gray-200 transition-colors"
                                    >
                                        Discord
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://t.me/polygraalx"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 hover:text-gray-200 transition-colors"
                                    >
                                        Telegram
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-8 border-t border-dark-700 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © {currentYear} PolyGraalX. All rights reserved.
                    </p>
                    <p className="text-gray-500 text-sm">
                        Built on <span className="text-primary-400">Polygon</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
