
import React, { useState, useRef, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface PhilosophyCardProps {
  text: string;
  color: string;
}

const PhilosophyCard: React.FC<PhilosophyCardProps> = ({ text, color }) => {
  return (
    <div className={`${color} p-8 rounded-xl border border-white/5 text-center h-full flex items-center justify-center hover:border-solana-purple/30 transition-all duration-300 shadow-lg min-h-[160px]`}>
      <p className="text-xl font-medium text-white">{text}</p>
    </div>
  );
};

const PhilosophyCarousel: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [api, setApi] = useState<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Array of philosophy statements with color classes
  const philosophyStatements = [
    { text: "Pay with power. Borrow with purpose.", color: "bg-gradient-to-br from-solana-purple/20 to-solana-green/5" },
    { text: "Energy is the new currency. Spend now, repay with watts.", color: "bg-gradient-to-br from-solana-green/20 to-solana-purple/5" },
    { text: "Buy today. Pay tomorrow—with sunshine.", color: "bg-gradient-to-br from-solana-purple/30 to-solana-green/10" },
    { text: "Where DeFi meets renewable energy. Borrow. Generate. Thrive.", color: "bg-gradient-to-br from-solana-green/30 to-solana-purple/10" },
    { text: "Turn your sunshine into savings.", color: "bg-gradient-to-br from-solana-purple/25 to-solana-green/15" },
    { text: "Credit powered by nature.", color: "bg-gradient-to-br from-solana-green/25 to-solana-purple/15" }
  ];

  // Set up auto-scroll with smoother animation
  useEffect(() => {
    if (api && !isHovering) {
      intervalRef.current = setInterval(() => {
        api.scrollNext({ duration: 800, easing: t => 1 - Math.pow(1 - t, 3) }); // Cubic easing for smoother motion
      }, 1000); // Changed from 500ms to 1000ms (1 second)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [api, isHovering]);

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      
      // Stop any ongoing animation instantly
      if (api) {
        api.scrollTo(api.selectedScrollSnap(), { duration: 0 });
      }
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (api) {
      intervalRef.current = setInterval(() => {
        api.scrollNext({ duration: 800, easing: t => 1 - Math.pow(1 - t, 3) }); // Matching easing on resume
      }, 1000); // Changed from 500ms to 1000ms (1 second)
    }
  };

  return (
    <div 
      className="overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Carousel
        opts={{
          align: "start",
          loop: true,
          skipSnaps: false, // Changed to false for smoother movement
          duration: 800, // Setting base duration for transitions
        }}
        className="w-full"
        setApi={setApi}
      >
        <CarouselContent className="-ml-4">
          {philosophyStatements.map((item, index) => (
            <CarouselItem key={index} className="pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
              <PhilosophyCard text={item.text} color={item.color} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default PhilosophyCarousel;
