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
    let mounted = true;

    const fetchWallet = async () => {
      try {
        const wallet = await getWalletState();
        if (!mounted) return;
        if (wallet.isConnected && wallet.publicKey) {
          setAccount({
            publicKey: wallet.publicKey,
            address: wallet.publicKey,
            displayName: `${wallet.publicKey.slice(0, 6)}...${wallet.publicKey.slice(-4)}`,
          });
        } else {
          setAccount(null);
        }
      } catch (e) {
        if (!mounted) return;
        setAccount(null);
      }
    };

    fetchWallet();

    return () => {
      mounted = false;
    };
  }, []);

  return account;
}
