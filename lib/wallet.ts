// Wallet connection utilities for Stellar
import { isConnected, requestAccess } from '@stellar/freighter-api';

export interface WalletState {
  isConnected: boolean;
  publicKey: string | null;
  address: string | null;
}

// Check if Freighter wallet is available (installed)
export const isFreighterAvailable = async (): Promise<boolean> => {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('timeout')), 3000);
    });
    
    // Try to call isConnected - if it doesn't throw, Freighter is installed
    // Even if not connected, the function should exist if extension is installed
    await Promise.race([isConnected(), timeoutPromise]);
    return true;
  } catch (error) {
    // If it throws or times out, Freighter is likely not installed
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // If timeout, Freighter is not installed
    if (errorMessage.includes('timeout')) {
      return false;
    }
    
    // Check if it's a specific "not installed" error
    if (errorMessage.includes('not installed') || errorMessage.includes('not found')) {
      return false;
    }
    
    // If it's another error (like connection issue), Freighter might still be installed
    // Return true to allow the user to try connecting
    return true;
  }
};

export const getWalletState = (): WalletState => {
  if (typeof window === 'undefined') {
    return { isConnected: false, publicKey: null, address: null };
  }

  const publicKey = localStorage.getItem('wallet_public_key');
  const address = localStorage.getItem('wallet_address');
  
  return {
    isConnected: !!publicKey,
    publicKey,
    address,
  };
};

export const connectWallet = async (): Promise<WalletState> => {
  if (typeof window === 'undefined') {
    throw new Error('Wallet connection is only available in the browser.');
  }

  // First check if Freighter is installed
  const isInstalled = await isFreighterAvailable();
  if (!isInstalled) {
    throw new Error(
      'Freighter wallet is not installed. Please install it from https://freighter.app and refresh the page.'
    );
  }

  try {
    // Request access to the wallet (this will prompt user if not connected)
    const access = await requestAccess();
    
    if (access.error) {
      throw new Error(access.error);
    }
    
    if (access.address) {
      localStorage.setItem('wallet_public_key', access.address);
      localStorage.setItem('wallet_address', access.address);
      
      return {
        isConnected: true,
        publicKey: access.address,
        address: access.address,
      };
    }

    throw new Error('Failed to get public key from wallet.');
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    
    const errorMessage = error instanceof Error ? error.message : '';
    
    // If we already checked and it's not installed, throw that error
    if (errorMessage.includes('not installed')) {
      throw error;
    }
    
    // Provide more helpful error messages
    if (errorMessage.includes('User rejected') || errorMessage.includes('rejected')) {
      throw new Error('Wallet connection was cancelled by user.');
    }
    
    // If it's a connection error, provide a more specific message
    throw new Error(
      errorMessage || 
      'Failed to connect wallet. Please make sure Freighter is installed, unlocked, and refresh the page.'
    );
  }
};

export const disconnectWallet = (): void => {
  localStorage.removeItem('wallet_public_key');
  localStorage.removeItem('wallet_address');
};
