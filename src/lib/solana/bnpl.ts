import { useWallet } from '@solana/wallet-adapter-react';
import { useCallback, useState } from 'react';
import { createLoan, repayLoanWithEnergy } from './index';
import { userBalances } from './marketplace';

export interface Loan {
  id: string;
  borrower: string;
  amount: number;
  termDays: number;
  creationTime: number;
  repaidAmount: number;
  status: 'Active' | 'Repaid' | 'Defaulted';
}

export const useBNPL = () => {
  const { wallet, publicKey, connected } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create a new loan
  const createNewLoan = useCallback(
    async (amount: number, termDays: number) => {
      if (!wallet || !publicKey || !connected) {
        setError('Wallet not connected');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await createLoan(wallet.adapter, amount, termDays);

        if (!result.success) {
          throw new Error(result.error || 'Failed to create loan');
        }

        // Create a new loan object
        const newLoan = {
          id: result.loanAddress,
          borrower: publicKey.toString(),
          amount,
          termDays,
          creationTime: Date.now(),
          repaidAmount: 0,
          status: 'Active' as const,
        };

        // Update user balance - increment loans count and add eZap tokens
        const walletAddress = publicKey.toString();
        if (!userBalances[walletAddress]) {
          userBalances[walletAddress] = {
            eZap: 0,
            loans: 0,
            energySources: 0
          };
        }

        // Increment loans count and add eZap tokens
        userBalances[walletAddress].loans += 1;
        userBalances[walletAddress].eZap += amount;

        console.log(`Updated user balance: ${JSON.stringify(userBalances[walletAddress])}`);
        console.log(`Created new loan: ${JSON.stringify(newLoan)}`);

        return newLoan;
      } catch (err) {
        setError(err.message || 'An error occurred while creating the loan');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [wallet, publicKey, connected]
  );

  // Repay a loan with energy tokens
  const repayLoan = useCallback(
    async (loanId: string, amount: number) => {
      if (!wallet || !publicKey || !connected) {
        setError('Wallet not connected');
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await repayLoanWithEnergy(wallet.adapter, loanId, amount);

        if (!result.success) {
          throw new Error(result.error || 'Failed to repay loan');
        }

        // Update user balance - decrease eZap tokens
        const walletAddress = publicKey.toString();
        if (!userBalances[walletAddress]) {
          userBalances[walletAddress] = {
            eZap: 0,
            loans: 0,
            energySources: 0
          };
        }

        // Decrease eZap tokens (but don't go below 0)
        userBalances[walletAddress].eZap = Math.max(0, userBalances[walletAddress].eZap - amount);

        console.log(`Updated user balance after loan repayment: ${JSON.stringify(userBalances[walletAddress])}`);

        return true;
      } catch (err) {
        setError(err.message || 'An error occurred while repaying the loan');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [wallet, publicKey, connected]
  );

  // Get all loans for the current user from the blockchain
  const getLoans = useCallback(async (): Promise<Loan[]> => {
    if (!publicKey || !wallet || !connected) {
      return [];
    }

    try {
      setIsLoading(true);
      setError(null);

      // For demo purposes, return mock data since the program isn't deployed
      console.log('Using mock data for loans since the program is not deployed');

      // Check if the user has any loans in their balance
      const walletAddress = publicKey.toString();
      if (!userBalances[walletAddress]) {
        userBalances[walletAddress] = {
          eZap: 0,
          loans: 0,
          energySources: 0
        };
      }

      // If the user has no loans, return an empty array
      if (userBalances[walletAddress].loans === 0) {
        // Initialize with one mock loan for better UX
        userBalances[walletAddress].loans = 1;

        // Mock data for demonstration with valid Solana addresses
        const mockLoans: Loan[] = [
          {
            id: '3Mc6vR1yGDBQvmDm8z3RpRJJEAyX5zvVZrTXuSdb3kJE',
            borrower: publicKey.toString(),
            amount: 1000,
            termDays: 30,
            creationTime: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
            repaidAmount: 300,
            status: 'Active',
          }
        ];

        return mockLoans;
      } else {
        // Mock data for demonstration with valid Solana addresses
        const mockLoans: Loan[] = [
          {
            id: '3Mc6vR1yGDBQvmDm8z3RpRJJEAyX5zvVZrTXuSdb3kJE',
            borrower: publicKey.toString(),
            amount: 1000,
            termDays: 30,
            creationTime: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
            repaidAmount: 300,
            status: 'Active',
          },
          {
            id: 'BvgRy3YNvkZKvMdxqzZ6RvY9VPfUgS5d8WNLC5WXZRG3',
            borrower: publicKey.toString(),
            amount: 500,
            termDays: 15,
            creationTime: Date.now() - 14 * 24 * 60 * 60 * 1000, // 14 days ago
            repaidAmount: 500,
            status: 'Repaid',
          }
        ];

        return mockLoans;
      }

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

      // Get all program accounts of type Loan
      const loans = await program.account.loan.all([
        {
          memcmp: {
            offset: 8, // Skip the account discriminator
            bytes: publicKey.toBase58(), // Filter by borrower
          }
        }
      ]);

      // Convert the account data to our Loan interface
      return loans.map(loan => {
        const loanData = loan.account;
        let status: 'Active' | 'Repaid' | 'Defaulted';

        // Convert the enum to our status string
        if ('active' in loanData.status) {
          status = 'Active';
        } else if ('repaid' in loanData.status) {
          status = 'Repaid';
        } else {
          status = 'Defaulted';
        }

        return {
          id: loan.publicKey.toString(),
          borrower: loanData.borrower.toString(),
          amount: loanData.amount.toNumber(),
          termDays: loanData.termDays,
          creationTime: loanData.creationTime.toNumber() * 1000, // Convert to milliseconds
          repaidAmount: loanData.repaidAmount.toNumber(),
          status,
        };
      });
      */
    } catch (err) {
      console.error('Error fetching loans:', err);
      setError('Failed to fetch loans');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, wallet, connected, setIsLoading, setError]);

  return {
    createLoan: createNewLoan,
    repayLoan,
    getLoans,
    isLoading,
    error,
  };
};

export default useBNPL;
