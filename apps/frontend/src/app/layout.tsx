import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.css';
import { Providers } from '@/providers';
import { cn } from '@/lib/utils';

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
});

const geistMono = JetBrains_Mono({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-geist-mono',
});

export const metadata: Metadata = {
    title: 'PolyBet | Trade the Outcome',
    description: 'The first vAMM-powered Perpetual DEX for Prediction Markets. Trade real-world events with up to 20x leverage on Polygon.',
    openGraph: {
        title: 'PolyBet | Trade the Outcome with Leverage',
        description: 'Long or Short real-world events. Zero liquidity crunch. Instant execution.',
        type: 'website',
    },
};

export const viewport: Viewport = {
    themeColor: '#09090b',
    width: 'device-width',
    initialScale: 1,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={cn(inter.variable, geistMono.variable)} suppressHydrationWarning>
            <body className="font-sans bg-zinc-950 min-h-screen antialiased">
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
