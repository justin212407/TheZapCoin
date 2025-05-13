import { useWallet } from '@solana/wallet-adapter-react';
import { useCallback, useState } from 'react';
import { initializeEnergySource, submitEnergyReading } from './index';

export interface EnergySource {
  id: string;
  owner: string;
  energyType: string;
  capacity: number;
  verified: boolean;
  totalEnergyProduced: number;
}

export const useEnergy = () => {
  const { wallet, publicKey, connected } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize a new energy source
  const initializeNewEnergySource = useCallback(
    async (energyType: string, capacity: number) => {
      if (!wallet || !publicKey || !connected) {
        setError('Wallet not connected');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await initializeEnergySource(wallet.adapter, energyType, capacity);

        if (!result.success) {
          throw new Error(result.error || 'Failed to initialize energy source');
        }

        return {
          id: result.energySourceAddress,
          owner: publicKey.toString(),
          energyType,
          capacity,
          verified: false,
          totalEnergyProduced: 0,
        };
      } catch (err) {
        setError(err.message || 'An error occurred while initializing the energy source');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [wallet, publicKey, connected]
  );

  // Submit an energy reading
  const submitReading = useCallback(
    async (energyAmount: number) => {
      if (!wallet || !publicKey || !connected) {
        setError('Wallet not connected');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await submitEnergyReading(wallet.adapter, energyAmount);

        if (!result.success) {
          throw new Error(result.error || 'Failed to submit energy reading');
        }

        return {
          energyAmount,
          tokensEarned: result.tokensEarned,
        };
      } catch (err) {
        setError(err.message || 'An error occurred while submitting the energy reading');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [wallet, publicKey, connected]
  );

  // Get all energy sources for the current user from the blockchain
  const getEnergySources = useCallback(async (): Promise<EnergySource[]> => {
    if (!publicKey || !wallet || !connected) {
      return [];
    }

    try {
      setIsLoading(true);
      setError(null);

      // For demo purposes, return mock data since the program isn't deployed
      console.log('Using mock data for energy sources since the program is not deployed');

      // Mock data for demonstration with valid Solana addresses
      const mockEnergySources: EnergySource[] = [
        {
          id: 'DxPv2QMA5cWR5Xfg7tXr5YHk5z8KuZvP3wUn4xZ7L9Ux',
          owner: publicKey ? publicKey.toString() : '5FHwkrdxkCGBrLqqeHXZNvpAJmPV7dy1zNPnLsVrDGP6',
          energyType: 'Solar',
          capacity: 5000,
          verified: true,
          totalEnergyProduced: 1200,
        },
        {
          id: 'EYGgx5fYCZtLN2mu1s3HYcWUQFeyoMGVi7FagBpWJMBx',
          owner: publicKey ? publicKey.toString() : '5FHwkrdxkCGBrLqqeHXZNvpAJmPV7dy1zNPnLsVrDGP6',
          energyType: 'Wind',
          capacity: 3000,
          verified: true,
          totalEnergyProduced: 800,
        }
      ];

      return mockEnergySources;

      /* Uncomment this code when the program is deployed
      // Import the Program class from @project-serum/anchor
      const { Program, web3 } = await import('@project-serum/anchor');
      const { PublicKey } = web3;

      // Import the IDL
      const idl = await import('./zapcoin.json');

      // Get the connection from the wallet adapter
      const connection = wallet.adapter.connection;

      // Get the provider from the wallet adapter
      const provider = {
        connection,
        publicKey,
        signTransaction: wallet.adapter.signTransaction,
        signAllTransactions: wallet.adapter.signAllTransactions,
      };

      // Initialize the program
      const programId = new PublicKey('2dv7D1h2w5QcvMEnB6qqFYSudmb31uyvTowBvLoBcUN9');
      const program = new Program(idl.default, programId, provider);

      // Find the energy source PDA
      const [energySourcePDA] = await PublicKey.findProgramAddress(
        [Buffer.from('energy_source'), publicKey.toBuffer()],
        programId
      );

      // Fetch the energy source account
      try {
        const energySource = await program.account.energySource.fetch(energySourcePDA);

        // Convert the account data to our EnergySource interface
        return [{
          id: energySourcePDA.toString(),
          owner: energySource.owner.toString(),
          energyType: energySource.energyType,
          capacity: energySource.capacity.toNumber(),
          verified: energySource.verified,
          totalEnergyProduced: energySource.totalEnergyProduced.toNumber(),
        }];
      } catch (err) {
        console.log('No energy sources found for this user');
        return [];
      }
      */
    } catch (err) {
      console.error('Error fetching energy sources:', err);
      setError('Failed to fetch energy sources');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, wallet, connected, setIsLoading, setError]);

  return {
    initializeEnergySource: initializeNewEnergySource,
    submitEnergyReading: submitReading,
    getEnergySources,
    isLoading,
    error,
  };
};

export default useEnergy;
