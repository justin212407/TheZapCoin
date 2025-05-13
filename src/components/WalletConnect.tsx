
import React from 'react';
import { Button } from "@/components/ui/button";
import { Wallet } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { WalletButton } from './wallet';

interface WalletConnectProps {
  className?: string;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ className }) => {
  const { toast } = useToast();
  const { publicKey, connected, disconnect } = useWallet();

  const disconnectWallet = () => {
    if (disconnect) {
      disconnect();

      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected"
      });
    }
  };

  const connectGoogle = () => {
    toast({
      title: "Coming Soon",
      description: "Google OAuth integration is coming soon!"
    });
  };

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      {connected && publicKey ? (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className="bg-solana-purple hover:bg-solana-purple/80 text-white flex items-center gap-2 font-medium transition-all duration-300 hover:shadow-[0_0_15px_rgba(153,69,255,0.5)]"
            >
              <Wallet className="h-4 w-4" />
              <span>{formatWalletAddress(publicKey.toString())}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-72 p-0 border border-solana-purple/30 bg-zap-dark-lighter backdrop-blur-md">
            <div className="py-4 px-2">
              <h3 className="text-lg font-medium text-white mb-4 px-3">
                Wallet Connected
              </h3>
              <div className="space-y-4 px-3">
                <div className="bg-zap-dark/50 rounded-xl p-4">
                  <p className="text-zap-gray text-sm mb-1">Connected Address</p>
                  <p className="text-white font-semibold break-all">{publicKey.toString()}</p>
                </div>
                <Button
                  onClick={disconnectWallet}
                  className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-500 border border-red-600/20"
                >
                  Disconnect Wallet
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <WalletButton network="testnet" />
      )}
    </div>
  );
};

export default WalletConnect;
