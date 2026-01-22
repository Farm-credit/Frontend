"use client";

import React, { useState, useEffect } from 'react';
import { connectWallet, isFreighterAvailable } from '@/lib/wallet';

interface WalletPromptProps {
  onConnect: (publicKey: string) => void;
  onCancel: () => void;
}

export const WalletPrompt: React.FC<WalletPromptProps> = ({
  onConnect,
  onCancel,
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFreighterInstalled, setIsFreighterInstalled] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkFreighter = async () => {
      setIsChecking(true);
      const available = await isFreighterAvailable();
      setIsFreighterInstalled(available);
      setIsChecking(false);
    };
    
    checkFreighter();
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);
    
    // Re-check if Freighter is installed before attempting connection
    const isInstalled = await isFreighterAvailable();
    if (!isInstalled) {
      setIsFreighterInstalled(false);
      setError('Freighter wallet is not installed. Please install it from https://freighter.app and refresh the page.');
      setIsConnecting(false);
      return;
    }
    
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Connection timeout. Please make sure Freighter is installed and try again.')), 10000);
      });
      
      const walletPromise = connectWallet();
      const wallet = await Promise.race([walletPromise, timeoutPromise]);
      
      if (wallet.publicKey) {
        onConnect(wallet.publicKey);
      } else {
        setError('Failed to connect wallet. Please try again.');
      }
    } catch (err) {
      console.error('Wallet connection error:', err);
      const errorMessage = err instanceof Error
        ? err.message
        : 'Please install Freighter wallet to continue. Visit https://freighter.app';
      setError(errorMessage);
      
      // If error indicates Freighter is not installed, update state
      if (errorMessage.includes('not installed') || errorMessage.includes('timeout')) {
        setIsFreighterInstalled(false);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 md:p-8">
        <div className="text-center mb-6">
        
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Connect Your Wallet
          </h2>
          <p className="text-gray-600">
            Please connect your Stellar wallet to access your dashboard and view your environmental impact.
          </p>
        </div>

        {/* Freighter Not Installed Prompt */}
        {(!isChecking && isFreighterInstalled === false) || (error && error.includes('not installed')) ? (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800 mb-1">
                  Freighter Wallet Not Detected
                </p>
                <p className="text-sm text-yellow-700 mb-3">
                  Please install the Freighter browser extension to connect your wallet and access the dashboard.
                </p>
                <a
                  href="https://freighter.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 text-sm font-medium text-yellow-800 bg-yellow-100 rounded-lg hover:bg-yellow-200 transition-colors"
                >
                  Install Freighter →
                </a>
              </div>
            </div>
          </div>
        ) : null}

        {error && !error.includes('not installed') && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleConnect}
            disabled={isConnecting || isChecking || isFreighterInstalled === false}
            className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg shadow-md hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isConnecting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Connecting...
              </span>
            ) : (
              'Connect Wallet'
            )}
          </button>

          <button
            onClick={onCancel}
            disabled={isConnecting}
            className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Don&apos;t have a wallet?{' '}
            <a
              href="https://freighter.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Install Freighter
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
