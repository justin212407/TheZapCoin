
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Coins, Zap, BarChart, Cpu } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StatsCardsProps {
  isLoading: boolean;
}

const StatsCards: React.FC<StatsCardsProps> = ({ isLoading }) => {
  const statsData = [
    {
      title: "eZap Token Price",
      value: "--",
      icon: <Coins className="h-5 w-5 text-solana-purple" />,
      tooltip: "Awaiting first trade",
      animation: "",
    },
    {
      title: "Total Energy Tokenized",
      value: "0 kWh",
      icon: <Zap className="h-5 w-5 text-solana-green" />,
      tooltip: "Live-updated from device integrations",
      animation: "",
    },
    {
      title: "Marketplace Volume",
      value: "$0",
      icon: <BarChart className="h-5 w-5 text-solana-purple" />,
      tooltip: "⚡ Waiting to spark!",
      animation: "animate-pulse",
    },
    {
      title: "Verified IoT Devices",
      value: "0",
      icon: <Cpu className="h-5 w-5 text-solana-green" />,
      tooltip: "Click + to add your device",
      animation: "",
    },
  ];

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {statsData.map((stat, index) => (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div 
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className="cursor-help"
              >
                <Card className="border border-white/10 overflow-hidden bg-card-gradient relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-solana-purple/10 to-solana-green/5 opacity-20"></div>
                  <CardContent className="p-6">
                    {isLoading ? (
                      <div className="space-y-3">
                        <Skeleton className="h-5 w-1/2 bg-zap-dark-lighter" />
                        <Skeleton className="h-10 w-24 bg-zap-dark-lighter" />
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-center mb-3">
                          <p className="text-sm text-gray-400">{stat.title}</p>
                          {stat.icon}
                        </div>
                        <div className="flex items-baseline">
                          <div className={`text-2xl font-bold ${stat.animation}`}>{stat.value}</div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{stat.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </motion.div>
  );
};

export default StatsCards;
