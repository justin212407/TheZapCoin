# Zapcoin Frontend Integration Guide

This guide explains how to integrate the Solana blockchain functionality with the existing Zapcoin frontend.

## Overview

The Solana integration consists of the following components:

1. *Wallet Connection*: Allows users to connect their Solana wallets (Phantom, Solflare, etc.)
2. *Energy Source Management*: Register and verify renewable energy sources
3. *BNPL Smart Contracts*: Create and manage loans with energy repayment
4. *Energy Marketplace*: List and purchase energy credits

## Integration Steps

### 1. Add Wallet Connection

Wrap your main application with the SolanaWalletProvider component:

tsx
// src/main.tsx or src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { SolanaWalletProvider } from './components/wallet';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SolanaWalletProvider network={WalletAdapterNetwork.Devnet}>
      <App />
    </SolanaWalletProvider>
  </React.StrictMode>
);


Add the wallet button to your navigation:

tsx
// In your navigation component
import { WalletButton } from './components/wallet';

function Navigation() {
  return (
    <nav>
      {/* Your existing navigation items */}
      <WalletButton network="devnet" />
    </nav>
  );
}


### 2. Energy Source Integration

Use the useEnergy hook to interact with energy sources:

tsx
// In your energy component
import { useEnergy } from './lib/solana/energy';

function EnergyDashboard() {
  const { 
    initializeEnergySource, 
    submitEnergyReading, 
    getEnergySources,
    isLoading,
    error
  } = useEnergy();

  // Example: Initialize a new energy source
  const handleCreateEnergySource = async () => {
    const result = await initializeEnergySource('Solar', 5000);
    if (result) {
      console.log('Energy source created:', result);
    }
  };

  // Example: Submit an energy reading
  const handleSubmitReading = async () => {
    const result = await submitEnergyReading(100);
    if (result) {
      console.log('Energy reading submitted:', result);
    }
  };

  return (
    <div>
      {/* Your energy dashboard UI */}
      <button onClick={handleCreateEnergySource}>
        Register Solar Panels
      </button>
      <button onClick={handleSubmitReading}>
        Submit Energy Reading
      </button>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}


### 3. BNPL Integration

Use the useBNPL hook to interact with loans:

tsx
// In your BNPL component
import { useBNPL } from './lib/solana/bnpl';

function BNPLDashboard() {
  const { 
    createLoan, 
    repayLoan, 
    getLoans,
    isLoading,
    error
  } = useBNPL();

  // Example: Create a new loan
  const handleCreateLoan = async () => {
    const result = await createLoan(1000, 30);
    if (result) {
      console.log('Loan created:', result);
    }
  };

  // Example: Repay a loan
  const handleRepayLoan = async (loanId: string) => {
    const result = await repayLoan(loanId, 100);
    if (result) {
      console.log('Loan repaid');
    }
  };

  return (
    <div>
      {/* Your BNPL dashboard UI */}
      <button onClick={handleCreateLoan}>
        Get Credit
      </button>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}


### 4. Marketplace Integration

Use the useMarketplace hook to interact with the marketplace:

tsx
// In your marketplace component
import { useMarketplace } from './lib/solana/marketplace';

function MarketplaceDashboard() {
  const { 
    createListing, 
    purchaseListing, 
    getListings,
    isLoading,
    error
  } = useMarketplace();

  // Example: Create a new listing
  const handleCreateListing = async () => {
    const result = await createListing(100, 10);
    if (result) {
      console.log('Listing created:', result);
    }
  };

  // Example: Purchase from a listing
  const handlePurchase = async (listingId: string) => {
    const result = await purchaseListing(listingId, 50);
    if (result) {
      console.log('Purchase successful');
    }
  };

  return (
    <div>
      {/* Your marketplace UI */}
      <button onClick={handleCreateListing}>
        Sell Energy
      </button>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}


## Important Notes

1. *Wallet Connection*: Users must connect their wallet before interacting with any Solana functionality.
2. *Network Selection*: The integration is configured to use the Solana devnet by default. Change to mainnet-beta for production.
3. *Mock Data*: The current implementation includes mock data for listings and loans. In a production environment, these would be fetched from the blockchain.
4. *Error Handling*: All functions include error handling to provide feedback to users.

## Next Steps

1. *Deploy the Solana Program*: Build and deploy the Solana program to devnet or mainnet-beta.
2. *Update Program ID*: After deployment, update the program ID in src/lib/solana/index.ts.
3. *Replace Mock Data*: Implement real blockchain queries to replace the mock data in the hooks.
4. *Add Transaction Notifications*: Provide feedback to users when transactions are submitted and confirmed.