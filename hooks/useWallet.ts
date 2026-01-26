import { useState, useEffect, useCallback } from 'react';
import { connectWallet, disconnectWallet } from '@/lib/stellar-integration';
import { toast } from '@/components/toast';

export function useWallet() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async (silent = false) => {
    setLoading(true);
    setError(null);
    try {
      const key = await connectWallet();
      setPublicKey(key);
      if (typeof window !== 'undefined') {
        localStorage.setItem('connected_stellar_public_key', key);
      }
      if (!silent) {
        toast.success('Wallet connected successfully!');
      }
      return key;
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      if (!silent) {
        toast.error(errorMessage);
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    await disconnectWallet();
    setPublicKey(null);
    toast.info('Wallet disconnected');
  }, []);

  useEffect(() => {
    // Attempt to restore connection from local storage
    const savedKey = typeof window !== 'undefined' ? localStorage.getItem('connected_stellar_public_key') : null;
    if (savedKey) {
      setPublicKey(savedKey);
      setLoading(false);
    } else {
      // Attempt silent connection on mount if no saved key
      connect(true);
    }
  }, [connect]);

  return { publicKey, loading, error, connect, disconnect };
}
