import React from 'react';
import { motion } from "framer-motion";
import { Zap } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { SolanaExample } from '@/components/examples';

const SolanaDemo = () => {
  return (
    <div className="min-h-screen bg-zap-dark">
      <Navbar />
      <div className="pt-24 pb-16 px-4 md:px-6">
        {/* Header */}
        <motion.section 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gradient">Solana Integration</h1>
          <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto">
            Interact with the Solana blockchain to manage energy sources, create loans, and trade energy credits.
          </p>
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

        {/* Solana Example Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="max-w-4xl mx-auto bg-zap-dark-lighter rounded-xl border border-white/10 overflow-hidden"
        >
          <SolanaExample />
        </motion.div>

        {/* CTA Footer */}
        <motion.div 
          className="mt-16 text-center p-8 rounded-xl bg-card-gradient border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Be the first to power the energy economy.</h3>
          <p className="text-white/70 max-w-3xl mx-auto mb-6">
            Connect your wallet to start managing your energy sources, create BNPL loans, and trade energy credits on the marketplace.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SolanaDemo;
