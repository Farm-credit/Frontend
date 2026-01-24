"use client";

/**
 * Wallet Connector - UI component for Freighter wallet connection
 */

import React, { useState } from "react";
import { useWallet } from "./wallet-provider";
import { truncatePublicKey } from "@/lib/stellar-utils";

export default function WalletConnector() {
  const { publicKey, balance, isConnecting, connectWallet, disconnectWallet } =
    useWallet();
  const [error, setError] = useState<string>("");

  const handleConnect = async () => {
    setError("");
    try {
      await connectWallet();
    } catch (err: any) {
      if (err.message?.includes("not installed")) {
        setError("Freighter wallet not installed");
      } else if (
        err.message?.includes("rejected") ||
        err.message?.includes("denied")
      ) {
        setError("Connection rejected");
      } else {
        setError("Failed to connect wallet");
      }
    }
  };

  const handleDisconnect = () => {
    setError("");
    disconnectWallet();
  };

  if (publicKey) {
    const balanceNum = parseFloat(balance);
    const needsFunding = balanceNum === 0;

    return (
      <div className="flex items-center gap-2 md:gap-3">
        <div className="flex flex-col items-end">
          <span className="text-xs md:text-sm font-medium text-gray-900">
            {truncatePublicKey(publicKey, 3)}
          </span>
          <span
            className={`text-xs ${needsFunding ? "text-amber-600 font-medium" : "text-gray-500"}`}
          >
            {balanceNum.toFixed(2)} XLM
            {needsFunding && " (Fund)"}
          </span>
        </div>
        <button
          onClick={handleDisconnect}
          className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 min-w-[140px]"
      >
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </button>

      {error && (
        <div className="flex flex-col items-end gap-1">
          <p className="text-xs text-red-600">{error}</p>
          {error.includes("not installed") && (
            <a
              href="https://www.freighter.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline"
            >
              Install Freighter →
            </a>
          )}
        </div>
      )}
    </div>
  );
}