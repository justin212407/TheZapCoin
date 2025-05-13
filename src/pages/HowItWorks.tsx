
import React from 'react';
import { Button } from "@/components/ui/button";
import ScrollAnimation from "@/components/ScrollAnimation";
import { Wallet, ShoppingBag, Sun, Zap, ArrowRight, BarChart3 } from "lucide-react";
import WalletConnect from "@/components/WalletConnect";
import { Link } from "react-router-dom";
import Navbar from '@/components/Navbar';

const HowItWorks: React.FC = () => {
  return (
    <div className="w-full min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:px-8 container mx-auto text-center">
        <ScrollAnimation>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gradient">
            How ZapCoin Works
          </h1>
        </ScrollAnimation>
        
        <ScrollAnimation delay={200}>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-12">
            A cleaner, smarter way to buy now and repay with sunlight.
          </p>
        </ScrollAnimation>

        <ScrollAnimation delay={400}>
          <div className="w-full max-w-lg mx-auto h-64 relative mb-20">
            <div className="absolute inset-0 bg-card-gradient rounded-3xl p-6 flex items-center justify-center">
              <div className="relative animate-pulse-glow">
                <div className="absolute -inset-1 rounded-full bg-solana-purple/50 blur-md"></div>
                <div className="absolute -inset-1 rounded-full bg-solana-green/30 blur-md rotate-45"></div>
                <div className="animate-float">
                  <div className="w-20 h-20 rounded-full bg-solana-purple flex items-center justify-center">
                    <Zap className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>
              <ArrowRight className="w-12 h-12 mx-8 text-white/50 animate-pulse" />
              <div className="relative animate-pulse-glow">
                <div className="absolute -inset-1 rounded-full bg-solana-green/50 blur-md"></div>
                <div className="animate-float" style={{ animationDelay: "1s" }}>
                  <div className="w-20 h-20 rounded-full bg-solana-green flex items-center justify-center">
                    <Sun className="w-10 h-10 text-zap-dark" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimation>
      </section>

      {/* Steps Section */}
      <section className="py-20 px-4 md:px-8 container mx-auto" id="steps">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Step 1 */}
          <ScrollAnimation delay={100}>
            <div className="bg-card-gradient rounded-3xl p-8 h-full border border-white/5 relative overflow-hidden group hover:border-solana-purple/30 transition-all duration-300">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-solana-purple/20 rounded-full blur-2xl group-hover:bg-solana-purple/30 transition-all duration-300"></div>
              <span className="inline-block bg-solana-purple/20 text-solana-purple text-sm font-semibold rounded-full px-3 py-1 mb-6">Step 1</span>
              <div className="w-16 h-16 bg-solana-purple/20 rounded-2xl flex items-center justify-center mb-6">
                <Wallet className="w-8 h-8 text-solana-purple" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Connect Wallet</h3>
              <p className="text-white/70">Start by connecting your wallet to access Zapcoin's energy finance ecosystem.</p>
            </div>
          </ScrollAnimation>

          {/* Step 2 */}
          <ScrollAnimation delay={200}>
            <div className="bg-card-gradient rounded-3xl p-8 h-full border border-white/5 relative overflow-hidden group hover:border-solana-purple/30 transition-all duration-300">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-solana-purple/20 rounded-full blur-2xl group-hover:bg-solana-purple/30 transition-all duration-300"></div>
              <span className="inline-block bg-solana-purple/20 text-solana-purple text-sm font-semibold rounded-full px-3 py-1 mb-6">Step 2</span>
              <div className="w-16 h-16 bg-solana-purple/20 rounded-2xl flex items-center justify-center mb-6">
                <ShoppingBag className="w-8 h-8 text-solana-purple" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Buy What You Need</h3>
              <p className="text-white/70">Get instant credit using our BNPL smart contracts – no banks, no middlemen.</p>
            </div>
          </ScrollAnimation>

          {/* Step 3 */}
          <ScrollAnimation delay={300}>
            <div className="bg-card-gradient rounded-3xl p-8 h-full border border-white/5 relative overflow-hidden group hover:border-solana-purple/30 transition-all duration-300">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-solana-purple/20 rounded-full blur-2xl group-hover:bg-solana-purple/30 transition-all duration-300"></div>
              <span className="inline-block bg-solana-purple/20 text-solana-purple text-sm font-semibold rounded-full px-3 py-1 mb-6">Step 3</span>
              <div className="w-16 h-16 bg-solana-purple/20 rounded-2xl flex items-center justify-center mb-6">
                <Sun className="w-8 h-8 text-solana-purple" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Generate Solar Energy</h3>
              <p className="text-white/70">Use your solar panels (or join a community pool) to generate renewable energy.</p>
            </div>
          </ScrollAnimation>

          {/* Step 4 */}
          <ScrollAnimation delay={400}>
            <div className="bg-card-gradient rounded-3xl p-8 h-full border border-white/5 relative overflow-hidden group hover:border-solana-purple/30 transition-all duration-300">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-solana-purple/20 rounded-full blur-2xl group-hover:bg-solana-purple/30 transition-all duration-300"></div>
              <span className="inline-block bg-solana-purple/20 text-solana-purple text-sm font-semibold rounded-full px-3 py-1 mb-6">Step 4</span>
              <div className="w-16 h-16 bg-solana-purple/20 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-solana-purple" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Earn eZap Tokens</h3>
              <p className="text-white/70">Your energy is verified by smart meters and oracles, then converted into eZap credits.</p>
            </div>
          </ScrollAnimation>

          {/* Step 5 */}
          <ScrollAnimation delay={500}>
            <div className="bg-card-gradient rounded-3xl p-8 h-full border border-white/5 relative overflow-hidden group hover:border-solana-purple/30 transition-all duration-300">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-solana-purple/20 rounded-full blur-2xl group-hover:bg-solana-purple/30 transition-all duration-300"></div>
              <span className="inline-block bg-solana-purple/20 text-solana-purple text-sm font-semibold rounded-full px-3 py-1 mb-6">Step 5</span>
              <div className="w-16 h-16 bg-solana-purple/20 rounded-2xl flex items-center justify-center mb-6">
                <ArrowRight className="w-8 h-8 text-solana-purple" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Repay with Energy</h3>
              <p className="text-white/70">Use your earned eZap to repay your loan directly – turning sunlight into credit.</p>
            </div>
          </ScrollAnimation>

          {/* Step 6 */}
          <ScrollAnimation delay={600}>
            <div className="bg-card-gradient rounded-3xl p-8 h-full border border-white/5 relative overflow-hidden group hover:border-solana-purple/30 transition-all duration-300">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-solana-purple/20 rounded-full blur-2xl group-hover:bg-solana-purple/30 transition-all duration-300"></div>
              <span className="inline-block bg-solana-purple/20 text-solana-purple text-sm font-semibold rounded-full px-3 py-1 mb-6">Step 6</span>
              <div className="w-16 h-16 bg-solana-purple/20 rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 className="w-8 h-8 text-solana-purple" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Trade or Sell Excess Energy</h3>
              <p className="text-white/70">Got extra energy? Trade your eZap tokens in our decentralized marketplace.</p>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section className="py-20 px-4 md:px-8 container mx-auto">
        <ScrollAnimation>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gradient">Why It Matters</h2>
        </ScrollAnimation>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1 */}
          <ScrollAnimation delay={100}>
            <div className="text-center p-6">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-solana-purple/20 to-solana-green/20 flex items-center justify-center">
                <Sun className="w-10 h-10 text-solana-green" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Clean Energy Repayment</h3>
              <p className="text-white/70">Replace traditional money repayments with sustainable energy production. Better for you, better for the planet.</p>
            </div>
          </ScrollAnimation>
          
          {/* Column 2 */}
          <ScrollAnimation delay={200}>
            <div className="text-center p-6">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-solana-purple/20 to-solana-green/20 flex items-center justify-center">
                <Wallet className="w-10 h-10 text-solana-purple" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Financial Inclusion</h3>
              <p className="text-white/70">Access credit without traditional banking requirements. Anyone with solar access can participate.</p>
            </div>
          </ScrollAnimation>
          
          {/* Column 3 */}
          <ScrollAnimation delay={300}>
            <div className="text-center p-6">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-solana-purple/20 to-solana-green/20 flex items-center justify-center">
                <Zap className="w-10 h-10 text-solana-purple" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Tokenized Carbon Credits</h3>
              <p className="text-white/70">Coming Soon: Earn additional revenue through automatically generated carbon offset certificates.</p>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-solana-purple/30 to-solana-green/30 opacity-30"></div>
        <div className="container mx-auto relative z-10">
          <ScrollAnimation>
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">Ready to turn sunlight into credit?</h2>
              <div className="flex flex-wrap gap-4 justify-center">
                <WalletConnect />
                <Link to="/marketplace">
                  <Button className="bg-solana-green hover:bg-solana-green/80 text-zap-dark">
                    Explore Marketplace
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
