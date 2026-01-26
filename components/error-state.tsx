/**
 * Error State - Reusable error display component
 */

import React from "react";

export type ErrorType =
  | "wallet_not_installed"
  | "connection_rejected"
  | "insufficient_balance"
  | "signature_rejected"
  | "network_error"
  | "transaction_failed"
  | "generic";

interface ErrorStateProps {
  type: ErrorType;
  message?: string;
  onRetry?: () => void;
  onCancel?: () => void;
}

const errorConfig: Record<
  ErrorType,
  {
    icon: string;
    title: string;
    defaultMessage: string;
    actionText?: string;
    actionUrl?: string;
  }
> = {
  wallet_not_installed: {
    icon: "🔌",
    title: "Freighter Wallet Not Found",
    defaultMessage:
      "Please install the Freighter wallet extension to continue.",
    actionText: "Install Freighter",
    actionUrl: "https://www.freighter.app/",
  },
  connection_rejected: {
    icon: "🚫",
    title: "Connection Rejected",
    defaultMessage:
      "You rejected the wallet connection request. Please try again and approve the connection.",
    actionText: "Retry Connection",
  },
  insufficient_balance: {
    icon: "💰",
    title: "Insufficient Balance",
    defaultMessage:
      "Your wallet doesn't have enough XLM to complete this transaction.",
    actionText: "Get Testnet XLM",
    actionUrl: "https://laboratory.stellar.org/#account-creator",
  },
  signature_rejected: {
    icon: "✍️",
    title: "Transaction Signature Rejected",
    defaultMessage:
      "You rejected the transaction signature request. No funds were transferred.",
    actionText: "Try Again",
  },
  network_error: {
    icon: "🌐",
    title: "Network Error",
    defaultMessage:
      "Unable to connect to the Stellar network. Please check your internet connection and try again.",
    actionText: "Retry",
  },
  transaction_failed: {
    icon: "❌",
    title: "Transaction Failed",
    defaultMessage: "The transaction could not be completed. Please try again.",
    actionText: "Retry",
  },
  generic: {
    icon: "⚠️",
    title: "Error",
    defaultMessage: "An unexpected error occurred. Please try again.",
    actionText: "Retry",
  },
};

export default function ErrorState({
  type,
  message,
  onRetry,
  onCancel,
}: ErrorStateProps) {
  const config = errorConfig[type];
  const displayMessage = message || config.defaultMessage;

  return (
    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="text-5xl mb-4">{config.icon}</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{config.title}</h3>
        <p className="text-gray-700">{displayMessage}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {onCancel && (
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-6 text-gray-700 bg-white border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 min-h-[44px]"
          >
            Cancel
          </button>
        )}

        {config.actionUrl ? (
          <a
            href={config.actionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-6 text-center text-white bg-red-600 rounded-lg font-semibold hover:bg-red-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 min-h-[44px] inline-flex items-center justify-center gap-2"
          >
            {config.actionText}
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        ) : (
          onRetry && (
            <button
              onClick={onRetry}
              className="flex-1 py-3 px-6 text-white bg-red-600 rounded-lg font-semibold hover:bg-red-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 min-h-[44px]"
            >
              {config.actionText}
            </button>
          )
        )}
      </div>
    </div>
  );
}