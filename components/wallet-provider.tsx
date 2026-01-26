"use client";

/**
 * Wallet Provider - Global wallet state management using React Context
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  isConnected,
  requestAccess,
  getAddress,
  signTransaction,
} from "@stellar/freighter-api";
import { checkAccountBalance } from "@/lib/stellar-utils";
import {
  saveWalletPublicKey,
  getWalletPublicKey,
  clearWalletPublicKey,
} from "@/lib/storage-utils";

interface WalletContextType {
  publicKey: string | null;
  balance: string;
  isConnecting: boolean;
  isLoadingBalance: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  refreshBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>("0");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  // Load saved wallet on mount
  useEffect(() => {
    const savedKey = getWalletPublicKey();
    if (savedKey) {
      setPublicKey(savedKey);
      loadBalance(savedKey);
    }
  }, []);

  // Load account balance
  const loadBalance = async (key: string) => {
    setIsLoadingBalance(true);
    try {
      const accountBalance = await checkAccountBalance(key);
      setBalance(accountBalance.xlm);
    } catch (error: any) {
      // Account doesn't exist on testnet yet (needs funding)
      if (error?.response?.status === 404 || error?.message?.includes("404")) {
        console.warn(
          "Account not found on testnet - needs funding from faucet",
        );
        setBalance("0");
      } else {
        console.error("Failed to load balance:", error);
        setBalance("0");
      }
    } finally {
      setIsLoadingBalance(false);
    }
  };

  // Connect Freighter wallet
  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      // Check if Freighter is installed
      const freighterInstalled = await isConnected();
      if (!freighterInstalled) {
        throw new Error("Freighter wallet is not installed");
      }

      // Request access to wallet (this triggers the Freighter popup)
      console.log("Requesting access to Freighter wallet...");
      await requestAccess();

      // Get wallet address after access is granted
      console.log("Getting wallet address...");
      const addressResponse = await getAddress();
      console.log("Freighter response:", addressResponse);

      if (!addressResponse || !addressResponse.address) {
        throw new Error(
          "Failed to get address from Freighter. Please make sure you have a wallet set up.",
        );
      }

      const key = addressResponse.address;
      console.log("Connected wallet:", key);
      setPublicKey(key);
      saveWalletPublicKey(key);

      // Load balance (will be 0 if account doesn't exist on testnet yet)
      await loadBalance(key);
    } catch (error: any) {
      console.error("Failed to connect wallet:", error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setPublicKey(null);
    setBalance("0");
    clearWalletPublicKey();
  };

  // Refresh balance
  const refreshBalance = async () => {
    if (publicKey) {
      await loadBalance(publicKey);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        publicKey,
        balance,
        isConnecting,
        isLoadingBalance,
        connectWallet,
        disconnectWallet,
        refreshBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

// Custom hook to use wallet context
export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}