import { useWallet } from '@solana/wallet-adapter-react';
import { useCallback, useState } from 'react';
import { createListing, purchaseListing } from './index';

export interface MarketplaceListing {
  id: string;
  seller: string;
  amount: number;
  pricePerToken: number;
  totalPrice: number;
  active: boolean;
}

// Mock listings data - we'll use a function to get a fresh copy each time
// so we can update it
const getInitialMockListings = (): MarketplaceListing[] => [
  {
    id: '5FHwkrdxkCGBrLqqeHXZNvpAJmPV7dy1zNPnLsVrDGP6',
    seller: '5FHwkrdxkCGBrLqqeHXZNvpAJmPV7dy1zNPnLsVrDGP6',
    amount: 500,
    pricePerToken: 0.01,
    totalPrice: 5.0,
    active: true,
  },
  {
    id: 'GZNnvbxeYKb4fGWiAkAg5Jw4ZLZvXWNicYxWZi5JQwUH',
    seller: 'GZNnvbxeYKb4fGWiAkAg5Jw4ZLZvXWNicYxWZi5JQwUH',
    amount: 1000,
    pricePerToken: 0.008,
    totalPrice: 8.0,
    active: true,
  },
  {
    id: 'HN7cABqLq46Es1jh92dQQpzJgNuJqPMQXyxGi3A1FTHD',
    seller: 'HN7cABqLq46Es1jh92dQQpzJgNuJqPMQXyxGi3A1FTHD',
    amount: 250,
    pricePerToken: 0.012,
    totalPrice: 3.0,
    active: true,
  }
];

// Keep track of the current state of listings
let mockListings = getInitialMockListings();

// Keep track of user balances
interface UserBalance {
  eZap: number;
  loans: number;
  energySources: number;
}

// Store user balances by wallet address
export const userBalances: Record<string, UserBalance> = {};

export const useMarketplace = () => {
  const { wallet, publicKey, connected } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get all marketplace listings from the blockchain
  const getListings = useCallback(async (): Promise<MarketplaceListing[]> => {
    try {
      setIsLoading(true);
      setError(null);

      // For demo purposes, return mock data since the program isn't deployed
      console.log('Using mock data for marketplace listings since the program is not deployed');

      // Return a deep copy of the current mock listings
      return JSON.parse(JSON.stringify(mockListings));
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError('Failed to fetch listings');

      // Return empty array on error
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setError]);

  // Get user balance
  const getUserBalance = useCallback(async (): Promise<UserBalance> => {
    if (!publicKey) {
      return { eZap: 0, loans: 0, energySources: 0 };
    }

    const walletAddress = publicKey.toString();

    // Initialize balance if it doesn't exist
    if (!userBalances[walletAddress]) {
      userBalances[walletAddress] = {
        eZap: 0,
        loans: 0,
        energySources: 0
      };
    }

    return userBalances[walletAddress];
  }, [publicKey]);

  // Create a new listing
  const createNewListing = useCallback(
    async (amount: number, pricePerToken: number) => {
      if (!wallet || !publicKey || !connected) {
        setError('Wallet not connected');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await createListing(wallet.adapter, amount, pricePerToken);

        if (!result.success) {
          throw new Error(result.error || 'Failed to create listing');
        }

        // Create a new listing object
        const newListing = {
          id: result.listingAddress,
          seller: publicKey.toString(),
          amount,
          pricePerToken,
          totalPrice: amount * pricePerToken,
          active: true,
        };

        // Add the new listing to our mock data
        mockListings.push(newListing);

        // Update user balance - increment energy sources
        const walletAddress = publicKey.toString();
        if (!userBalances[walletAddress]) {
          userBalances[walletAddress] = {
            eZap: 0,
            loans: 0,
            energySources: 0
          };
        }

        // Increment energy sources count
        userBalances[walletAddress].energySources += 1;

        console.log(`Updated user balance: ${JSON.stringify(userBalances[walletAddress])}`);
        console.log(`Added new listing: ${JSON.stringify(newListing)}`);

        return newListing;
      } catch (err) {
        setError(err.message || 'An error occurred while creating the listing');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [wallet, publicKey, connected]
  );

  // Purchase tokens from a listing
  const purchaseFromListing = useCallback(
    async (listingId: string, amount: number) => {
      if (!wallet || !publicKey || !connected) {
        setError('Wallet not connected');
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Find the listing in our mock data
        const listingIndex = mockListings.findIndex(l => l.id === listingId);

        if (listingIndex === -1) {
          throw new Error('Listing not found');
        }

        const listing = mockListings[listingIndex];

        // Check if there are enough tokens available
        if (listing.amount < amount) {
          throw new Error(`Not enough tokens available. Only ${listing.amount} tokens left.`);
        }

        console.log(`Purchasing from listing: ${JSON.stringify(listing)}`);

        // Pass the price per token to the purchaseListing function
        const result = await purchaseListing(
          wallet.adapter,
          listingId,
          amount,
          listing.pricePerToken
        );

        if (!result.success) {
          throw new Error(result.error || 'Failed to purchase from listing');
        }

        // Update the listing in our mock data
        mockListings[listingIndex] = {
          ...listing,
          amount: listing.amount - amount,
          totalPrice: (listing.amount - amount) * listing.pricePerToken
        };

        // If amount is 0, mark as inactive
        if (mockListings[listingIndex].amount === 0) {
          mockListings[listingIndex].active = false;
        }

        // Update user balance
        const walletAddress = publicKey.toString();
        if (!userBalances[walletAddress]) {
          userBalances[walletAddress] = {
            eZap: 0,
            loans: 0,
            energySources: 0
          };
        }

        // Add the purchased tokens to the user's balance
        userBalances[walletAddress].eZap += amount;

        console.log(`Updated user balance: ${JSON.stringify(userBalances[walletAddress])}`);
        console.log(`Updated listing: ${JSON.stringify(mockListings[listingIndex])}`);

        return {
          success: true,
          totalPrice: result.totalPrice,
          pricePerToken: result.pricePerToken,
          newBalance: userBalances[walletAddress].eZap
        };
      } catch (err) {
        setError(err.message || 'An error occurred while purchasing from the listing');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [wallet, publicKey, connected]
  );

  return {
    createListing: createNewListing,
    purchaseListing: purchaseFromListing,
    getListings,
    getUserBalance,
    isLoading,
    error,
  };
};

export default useMarketplace;
