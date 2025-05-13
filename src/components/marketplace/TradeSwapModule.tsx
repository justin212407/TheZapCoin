
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowUpDown } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TradeSwapModuleProps {
  isLoading: boolean;
}

const TradeSwapModule: React.FC<TradeSwapModuleProps> = ({ isLoading }) => {
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  
  // Demo conversion rate: 1 SOL = 1166 eZap
  const conversionRate = 1166;
  
  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFromAmount(value);
    
    // Calculate the equivalent eZap amount
    if (value && !isNaN(parseFloat(value))) {
      const calculatedAmount = parseFloat(value) * conversionRate;
      setToAmount(calculatedAmount.toString());
    } else {
      setToAmount("");
    }
  };
  
  const handleToAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setToAmount(value);
    
    // Calculate the equivalent SOL amount
    if (value && !isNaN(parseFloat(value))) {
      const calculatedAmount = parseFloat(value) / conversionRate;
      setFromAmount(calculatedAmount.toFixed(9).toString());
    } else {
      setFromAmount("");
    }
  };
  
  const handleSwap = () => {
    // Future swap functionality
  };

  return (
    <Card className="overflow-hidden border border-white/10 bg-card-gradient">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowUpDown className="text-solana-green" size={20} /> Convert SOL ↔ eZap
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full bg-zap-dark-lighter" />
            <div className="flex justify-center my-2">
              <Skeleton className="h-8 w-8 rounded-full bg-zap-dark-lighter" />
            </div>
            <Skeleton className="h-12 w-full bg-zap-dark-lighter" />
            <Skeleton className="h-10 w-full bg-zap-dark-lighter mt-4" />
          </div>
        ) : (
          <div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="from">From (SOL)</Label>
                <div className="relative">
                  <Input
                    id="from"
                    type="number"
                    placeholder="0.00"
                    value={fromAmount}
                    onChange={handleFromAmountChange}
                    className="pl-3 pr-16 py-6 bg-zap-dark-lighter border-white/10"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-[#9945FF]"></div>
                    <span className="text-sm font-medium">SOL</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center my-2">
                <motion.div 
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                  className="p-2 rounded-full bg-zap-dark-lighter hover:bg-solana-purple/20 cursor-pointer"
                >
                  <ArrowUpDown size={16} className="text-solana-purple" />
                </motion.div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="to">To (eZap)</Label>
                <div className="relative">
                  <Input
                    id="to"
                    type="number"
                    placeholder="0.00"
                    value={toAmount}
                    onChange={handleToAmountChange}
                    className="pl-3 pr-16 py-6 bg-zap-dark-lighter border-white/10"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-solana-green"></div>
                    <span className="text-sm font-medium">eZAP</span>
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-white/50 text-right mt-1">
                1 SOL = 1166 eZAP (Demo Rate)
              </div>
            </div>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="mt-6">
                    <Button 
                      className="w-full py-6 h-auto bg-gray-600 hover:bg-gray-600/90 cursor-not-allowed"
                      disabled
                    >
                      Swap
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Conversion pool not yet active</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <div className="mt-4 p-3 rounded-lg bg-solana-purple/10 border border-solana-purple/20">
              <p className="text-sm text-white/80 text-center">
                Liquidity pool not available. Become a pioneer liquidity provider!
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TradeSwapModule;
