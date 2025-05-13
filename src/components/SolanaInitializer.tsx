import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { initializeSolana } from '@/lib/solana';
import { useToast } from "@/components/ui/use-toast";

const SolanaInitializer: React.FC = () => {
  const { wallet, publicKey, connected } = useWallet();
  const { toast } = useToast();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (wallet && publicKey && connected && !initialized) {
      const initSolana = async () => {
        try {
          console.log('Initializing Solana with wallet:', wallet);
          const result = await initializeSolana(wallet.adapter, 'testnet');
          if (result) {
            console.log('Solana connection initialized with wallet:', publicKey.toString());
            setInitialized(true);
            toast({
              title: "Wallet Connected",
              description: `Connected to ${publicKey.toString().slice(0, 6)}...${publicKey.toString().slice(-4)}`,
            });
          } else {
            console.error('Failed to initialize Solana connection');
            toast({
              title: "Connection Error",
              description: "Failed to initialize Solana connection",
              variant: "destructive"
            });
          }
        } catch (error) {
          console.error('Failed to initialize Solana connection:', error);
          toast({
            title: "Connection Error",
            description: error instanceof Error ? error.message : "Unknown error",
            variant: "destructive"
          });
        }
      };

      initSolana();
    }
  }, [wallet, publicKey, connected, initialized, toast]);

  return null;
};

export default SolanaInitializer;
