
import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { ArrowUpDown, PlugZap, Users, Database, ShieldCheck, Zap, Wallet } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import EnergyListings from '@/components/marketplace/EnergyListings';
import StatsCards from '@/components/marketplace/StatsCards';
import PriceGraph from '@/components/marketplace/PriceGraph';
import TradeSwapModule from '@/components/marketplace/TradeSwapModule';
import Leaderboard from '@/components/marketplace/Leaderboard';
import BNPLLoans from '@/components/marketplace/BNPLLoans';
import EnergySources from '@/components/marketplace/EnergySources';
import UserBalance from '@/components/marketplace/UserBalance';
import { useToast } from "@/components/ui/use-toast";
import Navbar from '@/components/Navbar';
import { WalletButton } from '@/components/wallet';
import { useWallet } from '@solana/wallet-adapter-react';

const Marketplace = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const { connected, publicKey } = useWallet();
  const [activeTab, setActiveTab] = useState<'marketplace' | 'energy' | 'bnpl'>('marketplace');

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleProvideLiquidity = () => {
    toast({
      title: "Liquidity Provider",
      description: "Liquidity provision will be available soon!",
    });
  };

  return (
    <div className="min-h-screen bg-zap-dark">
      <Navbar />
      <div className="pt-24 pb-16 px-4 md:px-6">
        {/* Marketplace Header */}
        <motion.section
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gradient">Energy Marketplace</h1>
          <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-6">
            Trade energy. Power the future.
          </p>

          {/* No wallet button here - using the one in the navbar */}

          <div className="mt-8 flex justify-center">
            <motion.div
              className="w-28 h-28 relative"
              animate={{
                boxShadow: ["0 0 10px rgba(153, 69, 255, 0.4)", "0 0 20px rgba(20, 241, 149, 0.4)", "0 0 10px rgba(153, 69, 255, 0.4)"]
              }}
              transition={{ repeat: Infinity, duration: 4 }}
            >
              <div className="absolute inset-0 bg-zap-dark rounded-full flex items-center justify-center">
                <Zap size={48} className="text-solana-purple" />
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Tabs for different sections */}
        <Tabs defaultValue="marketplace" className="mb-8" value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid grid-cols-3 max-w-md mx-auto bg-zap-dark-lighter">
            <TabsTrigger value="marketplace" className="data-[state=active]:bg-solana-purple/20 data-[state=active]:text-solana-purple">
              Marketplace
            </TabsTrigger>
            <TabsTrigger value="energy" className="data-[state=active]:bg-solana-purple/20 data-[state=active]:text-solana-purple">
              Energy Sources
            </TabsTrigger>
            <TabsTrigger value="bnpl" className="data-[state=active]:bg-solana-purple/20 data-[state=active]:text-solana-purple">
              BNPL Loans
            </TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace" className="mt-6">
            {/* User Balance */}
            <UserBalance isLoading={isLoading} />

            {/* Live Stats Dashboard */}
            <StatsCards isLoading={isLoading} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
              <div className="lg:col-span-2">
                {/* Dynamic Price Graph */}
                <PriceGraph isLoading={isLoading} />

                {/* Energy Credit Listings */}
                <div className="mt-6">
                  <EnergyListings isLoading={isLoading} />
                </div>
              </div>

              <div className="space-y-6">
                {/* Trade & Swap Module */}
                <TradeSwapModule isLoading={isLoading} />

                {/* Stats & Transparency Section */}
                <Card className="overflow-hidden border border-white/10 bg-card-gradient">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShieldCheck className="text-solana-green" size={20} /> Stats & Transparency
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex justify-between items-center p-3 rounded-lg bg-zap-dark-lighter">
                        <div className="flex items-center gap-2">
                          <ShieldCheck size={18} className="text-solana-purple" />
                          <span>Smart Contracts Audited</span>
                        </div>
                        <span className="px-2 py-1 text-xs rounded-full bg-amber-500/20 text-amber-400">In Progress</span>
                      </div>

                      <div className="flex justify-between items-center p-3 rounded-lg bg-zap-dark-lighter">
                        <div className="flex items-center gap-2">
                          <Database size={18} className="text-solana-purple" />
                          <span>Energy Oracles Integrated</span>
                        </div>
                        <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">Switchboard (Live)</span>
                      </div>

                      <div className="flex justify-between items-center p-3 rounded-lg bg-zap-dark-lighter">
                        <div className="flex items-center gap-2">
                          <Users size={18} className="text-solana-purple" />
                          <span>Community Installations</span>
                        </div>
                        <span>0 verified</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Early Leaderboard */}
                <Leaderboard isLoading={isLoading} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="energy" className="mt-6">
            <div className="grid grid-cols-1 gap-6">
              <EnergySources isLoading={isLoading} />
            </div>
          </TabsContent>

          <TabsContent value="bnpl" className="mt-6">
            <div className="grid grid-cols-1 gap-6">
              <BNPLLoans isLoading={isLoading} />
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA Footer */}
        <motion.div
          className="mt-16 text-center p-8 rounded-xl bg-card-gradient border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Be the first to power the energy economy.</h3>
        </motion.div>
      </div>
    </div>
  );
};

export default Marketplace;
