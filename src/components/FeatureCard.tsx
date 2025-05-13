
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon: Icon, delay = 0 }) => {
  return (
    <div 
      className="scroll-animation group relative overflow-hidden rounded-2xl bg-zap-dark-lighter p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-solana-purple/20 via-transparent to-solana-green/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="relative z-10">
        <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-solana-purple/20 to-solana-green/20 p-3">
          <Icon className="h-8 w-8 text-solana-purple transition-colors duration-300 group-hover:text-solana-green" />
        </div>
        
        <div className="space-y-2">
          <span className="inline-block rounded-lg bg-solana-purple/10 px-2 py-1 text-xs font-medium text-solana-purple">
            USE CASE
          </span>
          <h3 className="text-2xl font-semibold text-white">{title}</h3>
          <p className="text-zap-gray">{description}</p>
        </div>
        
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2" />
          <div className="rounded-full bg-white/5 p-2 transition-colors duration-300 group-hover:bg-white/10">
            <svg className="h-5 w-5 text-white/70" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.83331 14.1667L14.1666 5.83334M14.1666 5.83334H5.83331M14.1666 5.83334V14.1667" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
