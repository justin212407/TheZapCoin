# Zapcoin Solana Integration

This directory contains the Solana integration for the Zapcoin project. The integration allows users to interact with the Solana blockchain to manage energy sources, create and repay loans, and trade energy credits on the marketplace.

## Overview

The Solana integration consists of the following components:

1. *Wallet Connection*: Allows users to connect their Solana wallets (Phantom, Solflare, etc.)
2. *Energy Source Management*: Register and verify renewable energy sources
3. *BNPL Smart Contracts*: Create and manage loans with energy repayment
4. *Energy Marketplace*: List and purchase energy credits

## Directory Structure


src/
├── components/
│   ├── wallet/
│   │   ├── WalletButton.tsx       # Wallet connection button
│   │   ├── WalletProvider.tsx     # Wallet provider component
│   │   └── index.ts               # Exports wallet components
│   └── examples/
│       ├── SolanaExample.tsx      # Example component demonstrating Solana integration
│       └── index.ts               # Exports example components
└── lib/
    └── solana/
        ├── index.ts               # Main Solana integration functions
        ├── bnpl.ts                # BNPL loan functions
        ├── energy.ts              # Energy source functions
        ├── marketplace.ts         # Marketplace functions
        └── zapcoin.json           # Solana program IDL


## Installation

To use the Solana integration, you need to install the following dependencies:

bash
npm install @solana/web3.js @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets @solana/wallet-adapter-base @solana/spl-token bn.js


## Usage

### 1. Wrap Your App with the Wallet Provider

tsx
import { SolanaWalletProvider } from './components/wallet';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

function App() {
  return (
    <SolanaWalletProvider network={WalletAdapterNetwork.Testnet}>
      {/* Your app content */}
    </SolanaWalletProvider>
  );
}


### 2. Add the Wallet Button to Your Navigation

tsx
import { WalletButton } from './components/wallet';

function Navigation() {
  return (
    <nav>
      {/* Your navigation items */}
      <WalletButton network="testnet" />
    </nav>
  );
}


### 3. Use the Solana Hooks in Your Components

tsx
import { useEnergy } from './lib/solana/energy';
import { useBNPL } from './lib/solana/bnpl';
import { useMarketplace } from './lib/solana/marketplace';

function YourComponent() {
  // Energy hooks
  const { initializeEnergySource, submitEnergyReading } = useEnergy();
  
  // BNPL hooks
  const { createLoan, repayLoan } = useBNPL();
  
  // Marketplace hooks
  const { createListing, purchaseListing } = useMarketplace();
  
  // Your component logic
}


## Example Component

An example component is provided in src/components/examples/SolanaExample.tsx that demonstrates how to use the Solana integration. You can use this component as a reference for integrating Solana functionality into your own components.

To use the example component:

tsx
import { SolanaExample } from './components/examples';

function YourPage() {
  return (
    <div>
      <h1>Solana Integration Example</h1>
      <SolanaExample />
    </div>
  );
}


## Configuration

The Solana integration is configured to use the Solana testnet by default. You can change this to mainnet-beta for production by updating the network parameter in the SolanaWalletProvider and WalletButton components.

## Mock Implementation

The current implementation uses mock functions that simulate blockchain interactions. This allows you to develop and test the UI without actual blockchain transactions. In a production environment, you would replace these mock functions with real blockchain interactions.

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
- [Phantom Wallet Documentation](https://docs.phantom.app/)