"use client";

import React from 'react';
import { connectWallet } from '@/lib/wallet';
import showToast from '@/components/simple-toast';

interface ConnectButtonProps {
  label?: string;
  onConnect?: (publicKey: string) => void;
  className?: string;
}

export const ConnectButton: React.FC<ConnectButtonProps> = ({
  label = 'Connect Wallet',
  onConnect,
  className = '',
}) => {
  const [isConnecting, setIsConnecting] = React.useState(false);

  const handleClick = async () => {
    setIsConnecting(true);
    try {
      const wallet = await connectWallet();
      if (wallet.publicKey && onConnect) {
        onConnect(wallet.publicKey);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      const errorMessage = error instanceof Error
        ? error.message
        : 'Failed to connect wallet. Please try again.';
      showToast(errorMessage, 'error');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isConnecting}
      className={`px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
    >
      {isConnecting ? 'Connecting...' : label}
    </button>
  );
};
