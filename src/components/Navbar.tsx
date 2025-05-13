
import React, { useState, useEffect } from 'react';
import ZapLogo from './ZapLogo';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Wallet } from 'lucide-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);

      // Check for sections on landing page
      if (currentPath === '/') {
        const features = document.getElementById('features');
        const vision = document.getElementById('vision');

        if (features && vision) {
          const featuresTop = features.getBoundingClientRect().top;
          const visionTop = vision.getBoundingClientRect().top;

          if (visionTop < window.innerHeight / 2) {
            setActiveSection('vision');
          } else if (featuresTop < window.innerHeight / 2) {
            setActiveSection('features');
          } else {
            setActiveSection(null);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPath]);

  // Function to determine if a link is active
  const isActive = (path: string) => {
    if (path === '/#features') {
      return currentPath === '/' && activeSection === 'features';
    } else if (path === '/#vision') {
      return currentPath === '/' && activeSection === 'vision';
    }
    return currentPath === path;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-zap-dark/90 backdrop-blur-md py-3 shadow-md' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ZapLogo className="w-10 h-10" />
          <span className="text-xl font-bold tracking-tight">
            <span className="text-white">The</span>
            <span className="text-solana-purple">Zap</span>
            <span className="text-solana-green">Coin</span>
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/#features"
            className={`transition-colors duration-300 ${
              isActive('/#features') ? 'text-white font-medium' : 'text-white/70 hover:text-white'
            }`}
          >
            Features
          </Link>
          <Link
            to="/how-it-works"
            className={`transition-colors duration-300 ${
              isActive('/how-it-works') ? 'text-white font-medium' : 'text-white/70 hover:text-white'
            }`}
          >
            How It Works
          </Link>
          <Link
            to="/#vision"
            className={`transition-colors duration-300 ${
              isActive('/#vision') ? 'text-white font-medium' : 'text-white/70 hover:text-white'
            }`}
          >
            Vision
          </Link>
          <Link
            to="/marketplace"
            className={`transition-colors duration-300 ${
              isActive('/marketplace') ? 'text-white font-medium' : 'text-white/70 hover:text-white'
            }`}
          >
            Marketplace
          </Link>

        </div>

        <div className="flex items-center">
          <WalletMultiButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
