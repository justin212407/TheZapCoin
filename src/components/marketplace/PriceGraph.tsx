
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

interface PriceGraphProps {
  isLoading: boolean;
}

const PriceGraph: React.FC<PriceGraphProps> = ({ isLoading }) => {
  const [timeRange, setTimeRange] = useState("24h");
  
  // Empty data for placeholder visualization
  const emptyData = Array(24).fill(null).map((_, i) => ({
    time: i,
    value: null
  }));

  return (
    <Card className="overflow-hidden border border-white/10 bg-card-gradient mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">eZap Market Activity</CardTitle>
        <Tabs defaultValue="24h" className="w-fit" onValueChange={setTimeRange}>
          <TabsList className="bg-zap-dark-lighter">
            <TabsTrigger value="24h">24h</TabsTrigger>
            <TabsTrigger value="7d">7d</TabsTrigger>
            <TabsTrigger value="30d">30d</TabsTrigger>
            <TabsTrigger value="all">All Time</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="w-full">
            <Skeleton className="h-[300px] w-full bg-zap-dark-lighter" />
          </div>
        ) : (
          <div className="h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={emptyData}>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9945FF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#14F195" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={false} axisLine={false} />
                <YAxis tick={false} axisLine={false} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  strokeWidth={2} 
                  dot={false}
                  stroke="url(#colorGradient)"
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
            
            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-zap-dark/30 backdrop-blur-sm rounded-md">
              <motion.div 
                className="text-center"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <p className="text-lg font-semibold text-solana-purple mb-2">No trades yet</p>
                <p className="text-white/70">Be the first to energize this chart</p>
              </motion.div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PriceGraph;
