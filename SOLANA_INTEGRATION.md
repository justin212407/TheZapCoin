# Zapcoin Solana Integration Guide

This guide explains how to integrate the Solana blockchain functionality with the existing Zapcoin frontend.

## Overview

The Solana integration consists of the following components:

1. **Wallet Connection**: Allows users to connect their Solana wallets (Phantom, Solflare, etc.)
2. **Energy Source Management**: Register and verify renewable energy sources
3. **BNPL Smart Contracts**: Create and manage loans with energy repayment
4. **Energy Marketplace**: List and purchase energy credits

## Integration Steps

### 1. Install Dependencies

First, install the necessary Solana dependencies:

```bash
npm install @solana/web3.js @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets @solana/wallet-adapter-base @solana/spl-token bn.js
```

### 2. Add Wallet Connection to Your App

Wrap your main application with the `SolanaWalletProvider` component:

```tsx
// src/main.tsx or src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { SolanaWalletProvider } from './components/wallet';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SolanaWalletProvider network={WalletAdapterNetwork.Testnet}>
      <App />
    </SolanaWalletProvider>
  </React.StrictMode>
);
```

### 3. Add the Wallet Button to Your Navigation

Add the wallet button to your navigation:

```tsx
// In your navigation component
import { WalletButton } from './components/wallet';

function Navigation() {
  return (
    <nav>
      {/* Your existing navigation items */}
      <WalletButton network="testnet" />
    </nav>
  );
}
```

### 4. Integrate with the Marketplace Page

Update your Marketplace page to use the Solana marketplace functionality:

```tsx
// src/pages/Marketplace.tsx
import { useMarketplace } from '../lib/solana/marketplace';

function Marketplace() {
  const { 
    createListing, 
    purchaseListing, 
    getListings,
    isLoading,
    error
  } = useMarketplace();

  // Example: Create a new listing
  const handleCreateListing = async (amount: number, pricePerToken: number) => {
    const result = await createListing(amount, pricePerToken);
    if (result) {
      console.log('Listing created:', result);
      // Update UI or show success message
    }
  };

  // Example: Purchase from a listing
  const handlePurchase = async (listingId: string, amount: number) => {
    const result = await purchaseListing(listingId, amount);
    if (result) {
      console.log('Purchase successful');
      // Update UI or show success message
    }
  };

  // Rest of your component...
}
```

### 5. Integrate with the Energy Dashboard

Add energy source management to your dashboard:

```tsx
// In your energy dashboard component
import { useEnergy } from '../lib/solana/energy';

function EnergyDashboard() {
  const { 
    initializeEnergySource, 
    submitEnergyReading, 
    getEnergySources,
    isLoading,
    error
  } = useEnergy();

  // Example: Initialize a new energy source
  const handleCreateEnergySource = async (energyType: string, capacity: number) => {
    const result = await initializeEnergySource(energyType, capacity);
    if (result) {
      console.log('Energy source created:', result);
      // Update UI or show success message
    }
  };

  // Example: Submit an energy reading
  const handleSubmitReading = async (energyAmount: number) => {
    const result = await submitEnergyReading(energyAmount);
    if (result) {
      console.log('Energy reading submitted:', result);
      // Update UI or show success message
    }
  };

  // Rest of your component...
}
```

### 6. Integrate with the BNPL Functionality

Add BNPL functionality to your loan management page:

```tsx
// In your loan management component
import { useBNPL } from '../lib/solana/bnpl';

function LoanDashboard() {
  const { 
    createLoan, 
    repayLoan, 
    getLoans,
    isLoading,
    error
  } = useBNPL();

  // Example: Create a new loan
  const handleCreateLoan = async (amount: number, termDays: number) => {
    const result = await createLoan(amount, termDays);
    if (result) {
      console.log('Loan created:', result);
      // Update UI or show success message
    }
  };

  // Example: Repay a loan
  const handleRepayLoan = async (loanId: string, amount: number) => {
    const result = await repayLoan(loanId, amount);
    if (result) {
      console.log('Loan repaid');
      // Update UI or show success message
    }
  };

  // Rest of your component...
}
```

## Important Notes

1. **Testnet Configuration**: The integration is configured to use the Solana testnet. This is suitable for testing and development.

2. **Mock Implementation**: The current implementation uses mock functions that simulate blockchain interactions. This allows you to develop and test the UI without actual blockchain transactions.

3. **Wallet Connection**: Users must connect their wallet before interacting with any Solana functionality. The wallet connection status can be checked using the `useWallet` hook from `@solana/wallet-adapter-react`.

4. **Error Handling**: All functions include error handling to provide feedback to users. Make sure to display error messages to users when transactions fail.

5. **Network Selection**: The integration is configured to use the Solana testnet by default. You can change this to mainnet-beta for production by updating the network parameter in the SolanaWalletProvider and WalletButton components.

## Next Steps for Production

When you're ready to move to production:

1. **Deploy the Solana Program**: Build and deploy the Solana program to mainnet-beta.

2. **Update Program ID**: After deployment, update the program ID in `src/lib/solana/index.ts`.

3. **Replace Mock Functions**: Replace the mock implementations with real blockchain interactions.

4. **Add Transaction Notifications**: Provide feedback to users when transactions are submitted and confirmed.

5. **Add Error Recovery**: Implement retry mechanisms for failed transactions.

6. **Add Transaction History**: Implement a transaction history view for users to see their past interactions.

7. **Add Security Measures**: Implement additional security measures to protect users' funds.

## Testing

To test the integration:

1. Install the Phantom wallet browser extension
2. Create a new wallet or import an existing one
3. Switch to the Solana testnet in the wallet settings
4. Request testnet SOL from a faucet
5. Connect your wallet to the application
6. Test the various functions (create energy source, submit reading, create loan, etc.)

## Resources

- [Solana Web3.js Documentation](https://solana-labs.github.io/solana-web3.js/)
- [Solana Wallet Adapter Documentation](https://github.com/solana-labs/wallet-adapter)
- [Solana Program Documentation](https://docs.solana.com/developing/programming-model/overview)
- [Phantom Wallet Documentation](https://docs.phantom.app/)
