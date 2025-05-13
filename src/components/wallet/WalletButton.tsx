import React, { FC, useCallback, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { initializeSolana } from '../../lib/solana';

interface WalletButtonProps {
  className?: string;
  network?: 'mainnet-beta' | 'devnet' | 'testnet' | 'localnet';
}

export const WalletButton: FC<WalletButtonProps> = ({
  className = '',
  network = 'testnet'
}) => {
  const { wallet, publicKey, connected } = useWallet();

  const initSolana = useCallback(async () => {
    if (wallet && publicKey && connected) {
      try {
        await initializeSolana(wallet.adapter, network);
        console.log('Solana connection initialized with wallet:', publicKey.toString());
      } catch (error) {
        console.error('Failed to initialize Solana connection:', error);
      }
    }
  }, [wallet, publicKey, connected, network]);

  useEffect(() => {
    initSolana();
  }, [initSolana]);

  return (
    <div className={`wallet-button-container ${className}`}>
      <WalletMultiButton className="wallet-button" />
      {connected && publicKey && (
        <div className="wallet-info">
          <p className="wallet-address">
            {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
          </p>
        </div>
      )}
    </div>
  );
};

export default WalletButton;
