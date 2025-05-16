# Zapcoin: Decentralized Energy Finance Platform

> *Where Clean Energy Meets DeFi*
> A Solana-powered platform that combines Buy Now Pay Later (BNPL) with renewable energy repayment.

The Project is live at - https://thezapcoin-official.netlify.app/

## Overview

Zapcoin is a revolutionary DeFi platform built on the Solana blockchain that connects renewable energy production with financial services. The platform allows users to:

1. *Buy Now, Pay Later with Energy*: Make purchases using BNPL smart contracts and repay loans using energy credits generated from renewable energy sources.
2. *Energy-to-Credit Conversion*: Convert renewable energy production (measured in kWh) into "eZap" tokens with financial value.
3. *DePIN Integration*: Verify energy production in real-time through IoT devices connected to renewable energy sources.
4. *Energy Marketplace*: Trade tokenized energy credits on a decentralized marketplace.
5. *ZapCoin Token Utility*: Use the native token for marketplace transactions, governance, and rewards.

## Project Structure

- *Frontend*: React-based UI with Vite, TypeScript, and Tailwind CSS
- *Smart Contracts*: Solana programs written in Rust using the Anchor framework
- *Wallet Integration*: Support for Phantom, Solflare, and other Solana wallets

## Getting Started

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x or yarn >= 1.22.x
- Solana CLI >= 1.16.x (for contract development)
- Anchor >= 0.28.x (for contract development)

### Installation

bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the development server
npm run dev


### Solana Program Development

bash
# Build the Solana program
npm run build:program

# Deploy the Solana program
npm run deploy:program

# Run tests for the Solana program
npm run test:program


## Core Features

### 1. BNPL Smart Contracts
- On-chain loan agreements
- Flexible repayment terms
- Multiple payment options (Fiat, Crypto, Energy credits)
- Automated repayment tracking

### 2. Renewable Repayment
- Solar panel integration
- Energy production tracking
- Real-time energy-to-credit conversion
- Automated loan repayment

### 3. DePIN Integration
- Hardware-based verification
- Smart meter connectivity
- Tamper-proof energy validation

### 4. Energy Oracles
- Real-time energy data feeds
- Multi-source validation
- Fraud prevention mechanisms

### 5. Energy Marketplace
- Energy credit trading
- Token swaps (SOL ↔ eZap)
- Price discovery
- Trading analytics

## Technical Architecture

| Layer             | Technology                                  |
|-------------------|---------------------------------------------|
| Frontend          | React, Vite, TypeScript, Tailwind CSS       |
| UI Components     | shadcn/ui, Framer Motion                    |
| Blockchain        | Solana                                      |
| Smart Contracts   | Rust, Anchor Framework                      |
| Wallet            | Phantom, Solflare                           |
| Data Oracles      | Switchboard                                 |
| State Management  | React Query, Context API                    |
| Visualization     | Recharts                                    |
| Deployment        | Netlify                                     |

## Deployment

This project is configured for easy deployment to Netlify. For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Quick Deployment Steps

1. Build the project:
   bash
   npm run build:all
   

2. Deploy to Netlify:
   bash
   npm run deploy:netlify
   

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.