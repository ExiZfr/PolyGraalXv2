import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { Providers } from '@/providers';

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
});

// SEO Metadata - Maximum optimization
export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://polygraalx.com'),

    // Primary Meta Tags
    title: {
        default: 'PolyGraalX | Trade Prediction Market Perpetuals on Polygon',
        template: '%s | PolyGraalX',
    },
    description: 'Trade perpetual futures on prediction market outcomes. Long or short real-world events with up to 100x leverage on Polygon. Low fees, high liquidity, 24/7 trading.',

    // Keywords
    keywords: [
        'perpetual futures',
        'prediction markets',
        'Polymarket',
        'crypto trading',
        'Polygon',
        'DeFi',
        'leverage trading',
        'vAMM',
        'decentralized exchange',
        'DEX',
        'crypto perpetuals',
        'futures trading',
        'prediction betting',
    ],

    // Authors and Creator
    authors: [{ name: 'PolyGraalX Team' }],
    creator: 'PolyGraalX',
    publisher: 'PolyGraalX',

    // Robots
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },

    // Open Graph
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://polygraalx.com',
        siteName: 'PolyGraalX',
        title: 'PolyGraalX | Trade Prediction Market Perpetuals',
        description: 'Trade perpetual futures on prediction market outcomes with up to 100x leverage on Polygon.',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'PolyGraalX - Prediction Market Perpetuals',
            },
        ],
    },

    // Twitter Card
    twitter: {
        card: 'summary_large_image',
        title: 'PolyGraalX | Prediction Market Perpetuals',
        description: 'Trade perpetual futures on real-world events with 100x leverage on Polygon.',
        images: ['/twitter-image.png'],
        creator: '@polygraalx',
        site: '@polygraalx',
    },

    // App Icons
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png',
    },

    // Manifest
    manifest: '/manifest.json',

    // Verification (add your codes)
    verification: {
        google: 'your-google-verification-code',
    },

    // Category
    category: 'finance',
};

// Viewport configuration
export const viewport: Viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#0ea5e9' },
        { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
    ],
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
};

// Structured Data for SEO
const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'PolyGraalX',
    description: 'Decentralized exchange for trading perpetual futures on prediction market outcomes',
    url: 'https://polygraalx.com',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
    },
    featureList: [
        'Up to 100x leverage',
        'Prediction market perpetuals',
        'Low trading fees',
        '24/7 trading',
        'Non-custodial',
    ],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
            <head>
                {/* Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                {/* Preconnect to external domains */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://polygon-rpc.com" />
                {/* DNS Prefetch */}
                <link rel="dns-prefetch" href="https://api.polygraalx.com" />
            </head>
            <body className="min-h-screen bg-dark-900 antialiased">
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
