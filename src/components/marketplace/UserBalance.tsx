import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Zap, Wallet, Battery } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useMarketplace } from '@/lib/solana/marketplace';

interface UserBalanceProps {
  isLoading?: boolean;
}

const UserBalance: React.FC<UserBalanceProps> = ({ isLoading: externalLoading }) => {
  const { connected } = useWallet();
  const { getUserBalance, isLoading: marketplaceLoading } = useMarketplace();
  const [balance, setBalance] = useState({ eZap: 0, loans: 0, energySources: 0 });
  const [refreshKey, setRefreshKey] = useState(0);

  // Load balance when component mounts or when refreshKey changes
  useEffect(() => {
    if (connected) {
      loadBalance();
    }
  }, [connected, refreshKey]);

  const loadBalance = async () => {
    const userBalance = await getUserBalance();
    setBalance(userBalance);
  };

  // Refresh balance every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const isLoading = externalLoading || marketplaceLoading;

  if (!connected) {
    return (
      <Card className="overflow-hidden border border-white/10 bg-card-gradient mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Your Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Wallet className="h-12 w-12 text-solana-purple mb-4 opacity-50" />
            <p className="text-white/60">Connect your wallet to view your balance</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border border-white/10 bg-card-gradient mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Your Balance</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full bg-zap-dark-lighter" />
            <Skeleton className="h-12 w-full bg-zap-dark-lighter" />
            <Skeleton className="h-12 w-full bg-zap-dark-lighter" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zap-dark-lighter/70 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">eZap Tokens</p>
                <p className="text-xl font-medium">{balance.eZap}</p>
              </div>
              <Zap className="h-8 w-8 text-solana-purple" />
            </div>
            <div className="bg-zap-dark-lighter/70 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Active Loans</p>
                <p className="text-xl font-medium">{balance.loans}</p>
              </div>
              <Wallet className="h-8 w-8 text-solana-green" />
            </div>
            <div className="bg-zap-dark-lighter/70 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Energy Sources</p>
                <p className="text-xl font-medium">{balance.energySources}</p>
              </div>
              <Battery className="h-8 w-8 text-solana-blue" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserBalance;
