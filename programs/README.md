# Zapcoin Solana Program

This directory contains the Solana smart contract code for the Zapcoin platform. The program is built using the Anchor framework and implements the core functionality for the Zapcoin platform.

## Features

- **Energy Source Management**: Register and verify renewable energy sources
- **Energy-to-Token Conversion**: Convert energy production into eZap tokens
- **BNPL Smart Contracts**: Create and manage loans with energy repayment
- **Energy Marketplace**: List and purchase energy credits

## Structure

- `zapcoin/src/lib.rs`: Main program file containing all instructions and account structures
- `zapcoin/Cargo.toml`: Rust dependencies for the program

## Building and Deploying

### Prerequisites

- Solana CLI
- Anchor CLI
- Rust

### Build

```bash
npm run build:program
```

### Deploy

```bash
npm run deploy:program
```

### Test

```bash
npm run test:program
```

## Integration with Frontend

The Solana program is integrated with the frontend through the following files:

- `src/lib/solana/index.ts`: Main integration file with functions to interact with the program
- `src/lib/solana/zapcoin.json`: IDL file for the program
- `src/components/wallet/`: Wallet connection components
- `src/lib/solana/marketplace.ts`: Marketplace integration
- `src/lib/solana/bnpl.ts`: BNPL integration
- `src/lib/solana/energy.ts`: Energy source integration
