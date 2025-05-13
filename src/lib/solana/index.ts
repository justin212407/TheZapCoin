import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  Keypair,
  sendAndConfirmTransaction,
  ConfirmOptions,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  getAccount,
  createMint,
  getMint,
  mintTo,
  transfer,
  createTransferInstruction
} from '@solana/spl-token';
import { Program, AnchorProvider, web3, BN, Idl, setProvider } from '@project-serum/anchor';
import idl from './zapcoin.json';

// Energy token mint address - this is a real SPL token on testnet
// This is the eZap token that we'll use for energy transactions
let ENERGY_TOKEN_MINT = new PublicKey('EZapYCzQQeVT9yo9mS6dcV7LHXJqqjLPGNgQXmQEbQk3');

// Program ID from the deployed Solana program
// Note: For development/demo purposes, we're using a placeholder program ID
// In a production environment, this would be the actual deployed program ID
const PROGRAM_ID = new PublicKey('2dv7D1h2w5QcvMEnB6qqFYSudmb31uyvTowBvLoBcUN9');

// Connection to Solana network
let connection: Connection | null = null;
let provider: AnchorProvider | null = null;
let program: Program | null = null;

// Confirmation options for transactions
const confirmOptions: ConfirmOptions = {
  commitment: 'confirmed',
  preflightCommitment: 'confirmed',
  skipPreflight: false,
};

/**
 * Initialize the Solana connection
 * @param wallet The wallet to use for transactions
 * @param network The Solana network to connect to (e.g., 'devnet', 'mainnet-beta', 'testnet')
 */
export const initializeSolana = async (wallet: any, network: string = 'testnet') => {
  try {
    console.log('Initializing Solana with network:', network);
    console.log('Wallet adapter:', wallet);

    // Set up the network connection
    const endpoint = network === 'mainnet-beta'
      ? 'https://api.mainnet-beta.solana.com'
      : network === 'devnet'
        ? 'https://api.devnet.solana.com'
        : network === 'testnet'
          ? 'https://api.testnet.solana.com'
          : 'http://localhost:8899';

    console.log('Using endpoint:', endpoint);
    connection = new Connection(endpoint, confirmOptions.commitment);

    // Initialize the provider with the wallet adapter
    provider = new AnchorProvider(
      connection,
      wallet,
      confirmOptions
    );

    // Set the provider globally
    setProvider(provider);

    // Initialize the program
    program = new Program(idl as Idl, PROGRAM_ID, provider);

    // Verify the connection
    const version = await connection.getVersion();
    console.log('Connection to Solana established:', version);

    // Verify the token mint exists
    try {
      const mintInfo = await getMint(connection, ENERGY_TOKEN_MINT);
      console.log('Energy token mint found:', ENERGY_TOKEN_MINT.toString());
      console.log('Token supply:', mintInfo.supply.toString());
    } catch (err) {
      console.warn('Energy token mint not found or not initialized yet');
      // We'll continue anyway since we're using a real token address
    }

    console.log(`Solana connection initialized successfully on ${network}`);
    return true;
  } catch (error) {
    console.error('Failed to initialize Solana connection:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    return false;
  }
};

/**
 * Initialize a new energy source
 * @param wallet The wallet to use for the transaction
 * @param energyType The type of energy source (e.g., 'solar', 'wind')
 * @param capacity The capacity of the energy source in kWh
 */
export const initializeEnergySource = async (
  wallet: any,
  energyType: string,
  capacity: number
) => {
  if (!connection) {
    throw new Error('Solana connection not initialized');
  }

  try {
    console.log(`Initializing ${energyType} energy source with capacity ${capacity} kWh`);

    // For a real energy source initialization, we would create an account
    // For now, we'll transfer a small amount of SOL to simulate the initialization

    // Calculate the initialization fee in SOL (for demonstration purposes)
    const initFeeInSol = 0.0015; // Small amount for demonstration
    const lamports = Math.floor(initFeeInSol * LAMPORTS_PER_SOL);

    // Create a transaction to transfer SOL (initialization fee)
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: wallet.publicKey, // Send to self
        lamports, // Initialization fee
      })
    );

    // Sign and send the transaction
    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    const signedTransaction = await wallet.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());

    await connection.confirmTransaction(signature);

    console.log('Energy source initialized:', signature);

    // Generate a deterministic "energy source ID" based on the signature
    const energySourceId = new PublicKey(signature.substring(0, 32).padEnd(32, '0')).toString();

    return {
      success: true,
      signature,
      energySourceAddress: energySourceId,
      energyType,
      capacity,
    };
  } catch (error) {
    console.error('Failed to initialize energy source:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

/**
 * Submit an energy reading to earn eZap tokens
 * @param wallet The wallet to use for the transaction
 * @param energyAmount The amount of energy produced in kWh
 */
export const submitEnergyReading = async (
  wallet: any,
  energyAmount: number
) => {
  if (!connection) {
    throw new Error('Solana connection not initialized');
  }

  try {
    console.log(`Submitting energy reading of ${energyAmount} kWh`);

    // Calculate tokens earned (2:1 for simplicity - 2 kWh = 1 token)
    const tokensEarned = Math.floor(energyAmount / 2);

    // For a real energy reading, we would mint tokens to the user
    // For now, we'll transfer a small amount of SOL to simulate the token minting

    // Calculate the reward amount in SOL (for demonstration purposes)
    // In a real implementation, this would be tokens
    const rewardAmountInSol = 0.002; // Small amount for demonstration
    const lamports = Math.floor(rewardAmountInSol * LAMPORTS_PER_SOL);

    // Create a transaction to transfer SOL to the user (self)
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: wallet.publicKey, // Send to self
        lamports, // Reward amount
      })
    );

    // Sign and send the transaction
    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    const signedTransaction = await wallet.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());

    await connection.confirmTransaction(signature);

    console.log('Energy reading submitted:', signature);
    return {
      success: true,
      signature,
      tokensEarned,
    };
  } catch (error) {
    console.error('Failed to submit energy reading:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

/**
 * Create a new BNPL loan
 * @param wallet The wallet to use for the transaction
 * @param amount The loan amount in tokens
 * @param termDays The loan term in days
 */
export const createLoan = async (
  wallet: any,
  amount: number,
  termDays: number
) => {
  if (!connection) {
    throw new Error('Solana connection not initialized');
  }

  try {
    console.log(`Creating loan for ${amount} tokens with ${termDays} days term`);

    // For a real loan, we would transfer tokens to the borrower
    // For now, we'll transfer a small amount of SOL to simulate the loan

    // Calculate the loan amount in SOL (for demonstration purposes)
    // In a real implementation, this would be tokens
    const loanAmountInSol = 0.001; // Small amount for demonstration
    const lamports = Math.floor(loanAmountInSol * LAMPORTS_PER_SOL);

    // Create a transaction to transfer SOL to the borrower (self)
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: wallet.publicKey, // Send to self
        lamports, // Loan amount
      })
    );

    // Sign and send the transaction
    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    const signedTransaction = await wallet.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());

    await connection.confirmTransaction(signature);

    console.log('Loan created:', signature);

    // Generate a deterministic "loan ID" based on the signature
    const loanId = new PublicKey(signature.substring(0, 32).padEnd(32, '0')).toString();

    return {
      success: true,
      signature,
      loanAddress: loanId,
      amount,
      termDays,
    };
  } catch (error) {
    console.error('Failed to create loan:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

/**
 * Repay a loan with energy tokens
 * @param wallet The wallet to use for the transaction
 * @param loanAddress The address of the loan to repay
 * @param amount The amount to repay in tokens
 */
export const repayLoanWithEnergy = async (
  wallet: any,
  loanAddress: string,
  amount: number
) => {
  if (!connection) {
    throw new Error('Solana connection not initialized');
  }

  try {
    console.log(`Repaying loan ${loanAddress} with ${amount} tokens`);

    // For a real loan repayment, we would transfer tokens to the lender
    // For now, we'll transfer a small amount of SOL to simulate the repayment

    // Calculate the repayment amount in SOL (for demonstration purposes)
    // In a real implementation, this would be tokens
    const repaymentAmountInSol = 0.0005; // Small amount for demonstration
    const lamports = Math.floor(repaymentAmountInSol * LAMPORTS_PER_SOL);

    // Create a transaction to transfer SOL to the lender (using loan address)
    const loanPubkey = new PublicKey(loanAddress);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: loanPubkey, // Send to the loan address
        lamports, // Repayment amount
      })
    );

    // Sign and send the transaction
    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    const signedTransaction = await wallet.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());

    await connection.confirmTransaction(signature);

    console.log('Loan repaid with energy:', signature);
    return {
      success: true,
      signature,
      amountRepaid: amount,
    };
  } catch (error) {
    console.error('Failed to repay loan with energy:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

/**
 * Create a marketplace listing to sell energy tokens
 * @param wallet The wallet to use for the transaction
 * @param amount The amount of tokens to sell
 * @param pricePerToken The price per token in lamports
 */
export const createListing = async (
  wallet: any,
  amount: number,
  pricePerToken: number
) => {
  if (!connection) {
    throw new Error('Solana connection not initialized');
  }

  try {
    console.log(`Creating listing for ${amount} tokens at ${pricePerToken} per token`);

    // Create a simple transaction to record the listing
    // We'll just do a minimal SOL transfer to ourselves
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: wallet.publicKey, // Send to self
        lamports: 100, // Minimal amount (0.000000100 SOL)
      })
    );

    // Sign and send the transaction
    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    // Sign the transaction
    const signedTransaction = await wallet.signTransaction(transaction);

    // Send the transaction
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());

    // Wait for confirmation
    await connection.confirmTransaction(signature);

    console.log('Listing created:', signature);

    // Generate a deterministic "listing ID" based on the signature
    const listingId = new PublicKey(signature.substring(0, 32).padEnd(32, '0')).toString();

    return {
      success: true,
      signature,
      listingAddress: listingId,
      amount,
      pricePerToken,
      totalPrice: amount * pricePerToken,
    };
  } catch (error) {
    console.error('Failed to create listing:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

/**
 * Purchase tokens from a marketplace listing
 * @param wallet The wallet to use for the transaction
 * @param listingAddress The address of the listing to purchase from
 * @param amount The amount of tokens to purchase
 */
export const purchaseListing = async (
  wallet: any,
  listingAddress: string,
  amount: number,
  pricePerToken?: number
) => {
  if (!connection) {
    throw new Error('Solana connection not initialized');
  }

  try {
    console.log(`Purchasing ${amount} tokens from listing ${listingAddress}`);

    // For a real purchase, we need to transfer SOL to the seller
    // Convert the listing address to a PublicKey
    const sellerPublicKey = new PublicKey(listingAddress);

    // Get the price per token from the mock listings
    let actualPricePerToken = pricePerToken;

    if (!actualPricePerToken) {
      // If no price is provided, try to find the listing in our mock data
      const mockListings = [
        { id: '5FHwkrdxkCGBrLqqeHXZNvpAJmPV7dy1zNPnLsVrDGP6', pricePerToken: 0.01 },
        { id: 'GZNnvbxeYKb4fGWiAkAg5Jw4ZLZvXWNicYxWZi5JQwUH', pricePerToken: 0.008 },
        { id: 'HN7cABqLq46Es1jh92dQQpzJgNuJqPMQXyxGi3A1FTHD', pricePerToken: 0.012 }
      ];

      const listing = mockListings.find(l => l.id === listingAddress);
      if (listing) {
        actualPricePerToken = listing.pricePerToken;
      } else {
        // Default fallback
        actualPricePerToken = 0.01;
      }
    }

    console.log(`Using price per token: ${actualPricePerToken} SOL`);

    // Calculate the total price
    const totalPrice = amount * actualPricePerToken;
    const lamports = Math.floor(totalPrice * LAMPORTS_PER_SOL);

    console.log(`Total price: ${totalPrice} SOL (${lamports} lamports)`);

    // Create a transaction to transfer SOL to the seller
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: sellerPublicKey, // Send to the seller
        lamports, // Actual payment amount
      })
    );

    // Sign and send the transaction
    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    const signedTransaction = await wallet.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());

    await connection.confirmTransaction(signature);

    console.log('Purchase successful:', signature);
    return {
      success: true,
      signature,
      amountPurchased: amount,
      totalPrice,
      pricePerToken: actualPricePerToken
    };
  } catch (error) {
    console.error('Failed to purchase from listing:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};
