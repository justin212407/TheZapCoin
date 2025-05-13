
import React, { useState, useEffect } from 'react';
import { Sun, Wind, Droplets } from 'lucide-react';

interface CyclingTextProps {
  className?: string;
}

const CyclingText: React.FC<CyclingTextProps> = ({ className }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const items = [
    { text: 'Sunlight', icon: Sun },
    { text: 'Wind', icon: Wind },
    { text: 'Water', icon: Droplets },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((current) => (current + 1) % items.length);
        setIsAnimating(false);
      }, 500);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = items[currentIndex].icon;

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <CurrentIcon className={`h-8 w-8 text-solana-green transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`} />
      <span className={`transition-all duration-500 ${isAnimating ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'}`}>
        {items[currentIndex].text}
      </span>
    </span>
  );
};

export default CyclingText;
