import React, { FC, ReactNode, useMemo, useState, useEffect } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

console.log('[WALLET] Wallet provider module loaded');

// Import the styles
try {
  console.log('[WALLET] Loading wallet adapter styles...');
  require('@solana/wallet-adapter-react-ui/styles.css');
  console.log('[WALLET] Wallet adapter styles loaded successfully');
} catch (error) {
  console.error('[WALLET] Error loading wallet adapter styles:', error);
}

interface SolanaWalletProviderProps {
  children: ReactNode;
  network?: WalletAdapterNetwork;
}

export const SolanaWalletProvider: FC<SolanaWalletProviderProps> = ({
  children,
  network = WalletAdapterNetwork.Testnet
}) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const endpoint = useMemo(() => {
    console.log('[WALLET] Getting cluster API URL for network:', network);
    try {
      const url = clusterApiUrl(network);
      console.log('[WALLET] Cluster API URL:', url);
      return url;
    } catch (err) {
      console.error("[WALLET] Error getting cluster API URL:", err);
      // Fallback to a hardcoded URL for testnet
      console.log('[WALLET] Using fallback URL for testnet');
      return "https://api.testnet.solana.com";
    }
  }, [network]);

  // Initialize wallets with error handling
  const wallets = useMemo(() => {
    console.log('[WALLET] Initializing wallet adapters...');
    try {
      // Initialize each adapter separately with error handling
      let adapters = [];

      try {
        console.log('[WALLET] Initializing PhantomWalletAdapter...');
        const phantomAdapter = new PhantomWalletAdapter();
        adapters.push(phantomAdapter);
        console.log('[WALLET] PhantomWalletAdapter initialized successfully');
      } catch (phantomErr) {
        console.error('[WALLET] Error initializing PhantomWalletAdapter:', phantomErr);
      }

      try {
        console.log('[WALLET] Initializing SolflareWalletAdapter...');
        const solflareAdapter = new SolflareWalletAdapter();
        adapters.push(solflareAdapter);
        console.log('[WALLET] SolflareWalletAdapter initialized successfully');
      } catch (solflareErr) {
        console.error('[WALLET] Error initializing SolflareWalletAdapter:', solflareErr);
      }

      console.log('[WALLET] Wallet adapters initialized:', adapters.length);
      return adapters;
    } catch (err) {
      console.error("[WALLET] Error initializing wallet adapters:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return [];
    }
  }, []);

  // Check if everything is ready
  useEffect(() => {
    if (endpoint && wallets.length > 0) {
      setIsReady(true);
    }
  }, [endpoint, wallets]);

  // If there's an error, show an error message
  if (error) {
    return (
      <div style={{ padding: '2rem', color: 'white', backgroundColor: '#0F1116' }}>
        <h1 style={{ color: '#FF5555' }}>Wallet Provider Error</h1>
        <p>{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#9945FF',
            border: 'none',
            borderRadius: '0.25rem',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Reload Page
        </button>
      </div>
    );
  }

  // If not ready yet, show a loading message
  if (!isReady) {
    return (
      <div style={{ padding: '2rem', color: 'white', backgroundColor: '#0F1116' }}>
        <h1>Loading Wallet Providers...</h1>
      </div>
    );
  }

  // Everything is ready, render the wallet providers
  console.log('[WALLET] Rendering wallet providers...');
  try {
    return (
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect={false}>
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    );
  } catch (err) {
    console.error('[WALLET] Error rendering wallet providers:', err);
    return (
      <div style={{ padding: '2rem', color: 'white', backgroundColor: '#0F1116' }}>
        <h1 style={{ color: '#FF5555' }}>Wallet Provider Error</h1>
        <p>{err instanceof Error ? err.message : String(err)}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#9945FF',
            border: 'none',
            borderRadius: '0.25rem',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Reload Page
        </button>
      </div>
    );
  }
};

export default SolanaWalletProvider;
