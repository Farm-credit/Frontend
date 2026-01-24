import { useState, useEffect } from 'react';
import { connectWallet } from '@/lib/stellar-integration';

export function useWallet() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const key = await connectWallet();
      setPublicKey(key);
      setLoading(false);
    };
    init();
  }, []);

  return { publicKey, loading };
}
