import { useEffect, useState } from 'react';

/**
 * Hook to check if component is mounted (client-side)
 * Useful for avoiding hydration mismatches
 */
export function useIsMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
