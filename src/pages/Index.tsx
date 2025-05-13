import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from '@/components/Navbar';
import InteractiveBackground from '@/components/InteractiveBackground';
import FeatureCard from '@/components/FeatureCard';
import ScrollAnimation from '@/components/ScrollAnimation';
import CyclingText from '@/components/CyclingText';
import PhilosophyCarousel from '@/components/PhilosophyCarousel';
import { Wallet, Sun, Shield, Database, BarChart3, Link, CircleDollarSign, Zap } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  useEffect(() => {
    // Initialize scroll animations
    const scrollElements = document.querySelectorAll('.scroll-animation');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    scrollElements.forEach((el) => {
      observer.observe(el);
    });

    return () => {
      scrollElements.forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);

  return (
    <InteractiveBackground>
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center pt-20 pb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-solana-purple/20 via-transparent to-solana-green/20 pointer-events-none"></div>
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <ScrollAnimation>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
                  Turn <CyclingText /> Into <span className="text-gradient">Credit</span>
                </h1>
                <p className="text-xl md:text-2xl text-zap-gray mb-8 max-w-2xl">
                  Buy what you need today and repay with clean energy tomorrow. The first DeFi platform where energy repays loans.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    className="bg-solana-purple hover:bg-solana-purple/80 text-white flex items-center gap-2 font-medium px-6 py-6 h-auto rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(153,69,255,0.5)]"
                    onClick={() => navigate("/marketplace")}
                  >
                    <Wallet className="h-5 w-5" />
                    <span className="text-lg">Connect Wallet</span>
                  </Button>
                  <Button variant="outline" className="border-solana-green/50 text-solana-green hover:bg-solana-green/20 hover:text-white flex items-center gap-2 font-medium px-6 py-6 h-auto rounded-lg transition-all duration-300">
                    <span className="text-lg">Learn More</span>
                  </Button>
                </div>
                <p className="text-zap-gray mt-6 text-sm">
                  <span className="text-white font-semibold">TheZapCoin Vision:</span> Powering a future where sustainability pays—literally.
                </p>
              </ScrollAnimation>
            </div>
            <div className="order-1 lg:order-2 flex justify-center">
              <ScrollAnimation>
                <div className="relative w-full max-w-md">
                  <div className="absolute -z-10 w-64 h-64 bg-solana-purple/30 rounded-full filter blur-3xl top-0 right-0 animate-pulse-glow"></div>
                  <div className="absolute -z-10 w-64 h-64 bg-solana-green/20 rounded-full filter blur-3xl bottom-0 left-0 animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
                  <div className="bg-zap-dark-lighter backdrop-blur-md border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-xl">
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <p className="text-zap-gray">Your Energy Credits</p>
                        <h2 className="text-3xl font-bold text-white">142.5 eZap</h2>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-solana-green/10 flex items-center justify-center">
                        <Zap className="h-6 w-6 text-solana-green" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-zap-dark/50 rounded-xl p-4">
                        <p className="text-zap-gray text-sm mb-1">Current Loan Balance</p>
                        <div className="flex justify-between items-center">
                          <p className="text-white font-semibold">500 USDC</p>
                          <div className="text-solana-green text-sm">-3.2 eZap/day</div>
                        </div>
                      </div>
                      <div className="bg-zap-dark/50 rounded-xl p-4">
                        <p className="text-zap-gray text-sm mb-1">Solar Production</p>
                        <div className="flex justify-between items-center">
                          <p className="text-white font-semibold">5.8 kWh Today</p>
                          <div className="text-solana-green text-sm">+2.9 eZap</div>
                        </div>
                      </div>

                      <Button className="w-full bg-solana-green hover:bg-solana-green/80 text-black font-medium py-5 rounded-lg transition-all duration-300" onClick={() => navigate("/marketplace")}>
                        Repay With Energy
                      </Button>
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-zap-dark/50">
        <div className="container mx-auto px-4">
          <ScrollAnimation>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Pay Later with <span className="text-gradient">Renewable Repayment</span>
              </h2>
              <p className="text-zap-gray text-lg">
                Our revolutionary DeFi platform combines BNPL flexibility with sustainable energy incentives.
              </p>
            </div>
          </ScrollAnimation>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ScrollAnimation delay={100}>
              <FeatureCard
                title="BNPL Smart Contracts"
                description="Purchase now and choose how to pay later—with fiat, crypto, or the energy your solar panels generate."
                icon={Wallet}
              />
            </ScrollAnimation>

            <ScrollAnimation delay={200}>
              <FeatureCard
                title="Renewable Repayment"
                description="Connect your renewable energy source and watch your debt diminish as you generate clean power. Every kilowatt counts."
                icon={Sun}
              />
            </ScrollAnimation>

            <ScrollAnimation delay={300}>
              <FeatureCard
                title="DePIN Integration"
                description="Our decentralized hardware network verifies energy production in real-time, ensuring transparent and accurate energy-to-credit conversion."
                icon={Shield}
              />
            </ScrollAnimation>

            <ScrollAnimation delay={400}>
              <FeatureCard
                title="Energy Oracles"
                description="Cutting-edge oracles validate your clean energy contribution, automatically converting it to eZap credits to pay off your loans."
                icon={Database}
              />
            </ScrollAnimation>

            <ScrollAnimation delay={500}>
              <FeatureCard
                title="ZapCoin Token Utility"
                description="Stake, spend, earn, and govern—ZapCoin powers our entire ecosystem from marketplace transactions to lending rewards."
                icon={CircleDollarSign}
              />
            </ScrollAnimation>

            <ScrollAnimation delay={600}>
              <FeatureCard
                title="Energy Marketplace"
                description="Trade surplus energy credits, buy ZapCoin tokens, or acquire renewable energy certificates in our decentralized marketplace."
                icon={BarChart3}
              />
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section id="vision" className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollAnimation>
              <div className="bg-zap-dark-lighter backdrop-blur-md border border-white/10 rounded-3xl p-8 h-full shadow-xl">
                <div className="relative h-60 mb-8 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-solana-purple/20 to-solana-green/20 z-10"></div>
                  <img
                    src="/lovable-uploads/9ac2d630-a0ef-4544-948b-e78211750c60.png"
                    alt="Solar and Wind Energy Farm"
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-4">Long-Term Vision</h3>
                <p className="text-zap-gray mb-6 leading-relaxed">
                  Beyond revolutionizing how we pay for goods, TheZapCoin aims to accelerate global renewable energy adoption. We're developing ZapCoin-branded solar panels specifically optimized for blockchain validation, creating community-owned Energy Pools for collective impact, and launching a decentralized autonomous organization (DAO) where token holders vote on protocol upgrades, energy credit rates, and the future of the ecosystem.
                </p>
                <p className="text-zap-gray leading-relaxed">
                  Our mission is to build a world where generating clean energy becomes as valuable as generating traditional currency.
                </p>
              </div>
            </ScrollAnimation>

            <div className="space-y-8">
              <ScrollAnimation delay={100}>
                <div className="border border-white/10 rounded-xl p-6 bg-zap-dark-lighter backdrop-blur-sm hover:border-solana-purple/30 transition-all duration-300">
                  <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Sun className="h-5 w-5 text-solana-green" />
                    <span>ZapCoin-Branded Solar Panels</span>
                  </h4>
                  <p className="text-zap-gray">
                    Specially designed hardware with built-in blockchain validation capabilities, optimized for our energy-to-credit system.
                  </p>
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={200}>
                <div className="border border-white/10 rounded-xl p-6 bg-zap-dark-lighter backdrop-blur-sm hover:border-solana-purple/30 transition-all duration-300">
                  <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Link className="h-5 w-5 text-solana-green" />
                    <span>Community Energy Pools</span>
                  </h4>
                  <p className="text-zap-gray">
                    Collective energy contribution systems where communities can share resources and maximize the impact of their renewable energy generation.
                  </p>
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={300}>
                <div className="border border-white/10 rounded-xl p-6 bg-zap-dark-lighter backdrop-blur-sm hover:border-solana-purple/30 transition-all duration-300">
                  <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <CircleDollarSign className="h-5 w-5 text-solana-green" />
                    <span>Energy Finance DAO</span>
                  </h4>
                  <p className="text-zap-gray">
                    A decentralized autonomous organization where ZapCoin holders vote on protocol upgrades, energy credit rates, and the future of the ecosystem.
                  </p>
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={400}>
                <div className="border border-white/10 rounded-xl p-6 bg-gradient-to-br from-solana-purple/20 to-solana-green/20 backdrop-blur-sm hover:border-solana-green/30 transition-all duration-300">
                  <h3 className="text-2xl font-bold mb-3">Join the Energy Revolution</h3>
                  <p className="text-white/70 mb-6">
                    Be part of the future where financial services and renewable energy converge on the blockchain.
                  </p>
                  <Button
  className="bg-solana-green hover:bg-solana-green/80 text-black flex items-center gap-2 font-medium px-6 py-5 h-auto rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(20,241,149,0.5)]"
  onClick={() => window.location.href = "/how-it-works"}
>
  <Zap className="h-5 w-5" />
  <span className="text-lg">Get Started Now</span>
</Button>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </section>

      {/* Taglines Section - Updated to use the carousel */}
      <section className="py-16 bg-zap-dark-lighter">
        <div className="container mx-auto px-4">
          <ScrollAnimation>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-2">TheZapCoin Philosophy</h2>
              <p className="text-zap-gray">The future of finance flows with renewable energy.</p>
            </div>
          </ScrollAnimation>

          <PhilosophyCarousel />
        </div>
      </section>

      {/* Call to Action */}
      <section id="cta" className="py-20">
        <div className="container mx-auto px-4">
          <ScrollAnimation>
            <div className="bg-gradient-to-br from-solana-purple/20 to-solana-green/20 rounded-3xl p-10 md:p-16 text-center max-w-4xl mx-auto backdrop-blur-md border border-white/10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Electrify Your Finances?
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                Join TheZapCoin platform today and start turning your renewable energy into financial power. Be part of the revolution that's changing how the world thinks about money and energy.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button variant="outline" className="border-solana-green/50 text-solana-green hover:bg-solana-green/20 hover:text-white flex items-center gap-2 font-medium px-6 py-6 h-auto rounded-lg transition-all duration-300" onClick={() => window.open("https://x.com/The_ZapCoin", "_blank", "noopener,noreferrer")}>
                  <span className="text-lg">Contact Us</span>
                </Button>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zap-dark-lighter py-12 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <Zap className="h-8 w-8 text-solana-green" />
              <span className="text-xl font-bold tracking-tight">
                <span className="text-white">The</span>
                <span className="text-solana-purple">Zap</span>
                <span className="text-solana-green">Coin</span>
              </span>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              <a href="#features" className="text-white/70 hover:text-white transition-colors duration-300">Features</a>
              <a href="#how-it-works" className="text-white/70 hover:text-white transition-colors duration-300">How It Works</a>
              <a href="#vision" className="text-white/70 hover:text-white transition-colors duration-300">Vision</a>
              <a href="#marketplace" className="text-white/70 hover:text-white transition-colors duration-300">Marketplace</a>
              <a href="#" className="text-white/70 hover:text-white transition-colors duration-300">Whitepaper</a>
            </div>
          </div>

          <hr className="border-white/5 mb-8" />

          <div className="text-center">
            <p className="text-zap-gray text-sm">
              &copy; {new Date().getFullYear()} TheZapCoin. All rights reserved. Built on Solana.
            </p>
          </div>
        </div>
      </footer>
    </InteractiveBackground>
  );
};

export default Index;
