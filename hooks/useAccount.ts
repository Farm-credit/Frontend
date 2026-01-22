import { useEffect, useState } from 'react';
import { getWalletState, connectWallet, disconnectWallet, WalletState } from '@/lib/wallet';

export interface Account {
  publicKey: string;
  address: string;
  displayName: string;
}

/**
 * Hook to manage wallet account state
 * Returns account if connected, null otherwise
 */
export function useAccount(): Account | null {
  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    const wallet = getWalletState();
    
    if (wallet.isConnected && wallet.publicKey) {
      setAccount({
        publicKey: wallet.publicKey,
        address: wallet.publicKey,
        displayName: `${wallet.publicKey.slice(0, 6)}...${wallet.publicKey.slice(-4)}`,
      });
    } else {
      setAccount(null);
    }

    // Listen for storage changes (when wallet connects/disconnects in another tab)
    const handleStorageChange = () => {
      const updatedWallet = getWalletState();
      if (updatedWallet.isConnected && updatedWallet.publicKey) {
        setAccount({
          publicKey: updatedWallet.publicKey,
          address: updatedWallet.publicKey,
          displayName: `${updatedWallet.publicKey.slice(0, 6)}...${updatedWallet.publicKey.slice(-4)}`,
        });
      } else {
        setAccount(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return account;
}
