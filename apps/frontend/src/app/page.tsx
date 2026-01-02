import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/landing/Hero';
import { Ticker } from '@/components/landing/Ticker';
import { BentoGrid } from '@/components/landing/BentoGrid';

export default function HomePage() {
    return (
        <div className="min-h-screen flex flex-col bg-zinc-950">
            <Navbar />

            <main className="flex-1 flex flex-col">
                {/* Ticker at the very top under navbar or integrated */}
                <Ticker />

                {/* Hero Section */}
                <Hero />

                {/* Bento Grid Features */}
                <div className="bg-zinc-950 relative z-20">
                    <BentoGrid />
                </div>

                {/* CTA Section */}
                <section className="py-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary-900/10" />
                    <div className="container relative z-10 text-center">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                            Ready to <span className="text-primary-400">Trade?</span>
                        </h2>
                        <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
                            Join thousands of traders predicting the future on the world's fastest prediction market DEX.
                        </p>
                        <a
                            href="/markets"
                            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-primary-600 hover:bg-primary-500 rounded-xl transition-all shadow-[0_0_25px_rgba(14,165,233,0.4)] hover:shadow-[0_0_40px_rgba(14,165,233,0.6)]"
                        >
                            Launch App
                        </a>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
