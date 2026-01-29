"use client";

import React, { useState, useEffect } from 'react';
import { getWalletState, connectWallet, disconnectWallet } from '@/lib/wallet';
import showToast from '@/components/simple-toast';

interface WalletConnectProps {
  onConnect?: (publicKey: string) => void;
  onDisconnect?: () => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({
  onConnect,
  onDisconnect,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const fetchState = async () => {
      const wallet = await getWalletState();
      setIsConnected(wallet.isConnected);
      setPublicKey(wallet.publicKey);
    };

    fetchState();
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const wallet = await connectWallet();
      setIsConnected(wallet.isConnected);
      setPublicKey(wallet.publicKey);
      if (onConnect && wallet.publicKey) {
        onConnect(wallet.publicKey);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      showToast('Please install Freighter wallet to connect. Visit https://freighter.app', 'error');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setIsConnected(false);
    setPublicKey(null);
    if (onDisconnect) {
      onDisconnect();
    }
  };

  if (isConnected && publicKey) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600">
          <span className="font-medium">Connected:</span>{' '}
          <span className="font-mono">
            {publicKey.slice(0, 6)}...{publicKey.slice(-4)}
          </span>
        </div>
        <button
          onClick={handleDisconnect}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Disconnect
        </button>
        <a
          href="/dashboard"
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
        >
          Dashboard
        </a>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
};
