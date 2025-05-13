
import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from 'lucide-react';

interface LeaderboardProps {
  isLoading: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ isLoading }) => {
  // Empty leaderboard for now
  const pioneers = [];
  
  return (
    <Card className="overflow-hidden border border-white/10 bg-card-gradient">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="text-solana-purple" size={20} /> Pioneers of Zapcoin
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((_, index) => (
              <Skeleton key={index} className="h-12 w-full bg-zap-dark-lighter" />
            ))}
          </div>
        ) : pioneers.length === 0 ? (
          <motion.div 
            className="flex flex-col items-center justify-center py-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-3 p-3 rounded-full bg-zap-dark-lighter/70">
              <Users size={24} className="text-solana-purple" />
            </div>
            <h4 className="font-medium mb-1">No pioneers yet</h4>
            <p className="text-sm text-white/60">The spotlight awaits you</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {/* Future pioneer listings would go here */}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
