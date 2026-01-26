// app/donate/confirm

"use client";

/**
 * Confirm Page - Review donation and process transaction
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/components/wallet-provider";
import TransactionProcessor from "@/components/transaction-processor";
import ProgressIndicator from "@/components/progress-indicator";
import {
  getDonationState,
  addTransactionToHistory,
  clearDonationState,
} from "@/lib/storage-utils";
import { getProjectById } from "@/lib/mock-data";
import { calculateImpact, formatImpactMetrics } from "@/lib/impact-calculator";
import {
  fetchXlmPrice,
  convertUsdToXlm,
  checkAccountBalance,
  getFaucetUrl,
  truncatePublicKey,
} from "@/lib/stellar-utils";

export default function ConfirmPage() {
  const router = useRouter();
  const { publicKey, balance, refreshBalance } = useWallet();
  const [donationState, setDonationState] =
    useState<ReturnType<typeof getDonationState>>(null);
  const [xlmPrice, setXlmPrice] = useState<number | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(true);
  const [hasEnoughBalance, setHasEnoughBalance] = useState(true);
  const [error, setError] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Load donation state
    const state = getDonationState();
    if (!state || !publicKey) {
      router.push("/donate");
      return;
    }
    setDonationState(state);

    // Fetch XLM price and check balance
    const initialize = async () => {
      const price = await fetchXlmPrice();
      setXlmPrice(price);
      setLoadingPrice(false);

      // Check if wallet has enough balance
      const xlmRequired = parseFloat(convertUsdToXlm(state.amount, price));
      const accountBalance = await checkAccountBalance(publicKey, xlmRequired);
      setHasEnoughBalance(accountBalance.hasEnough);
    };

    initialize();
  }, [publicKey, router]);

  if (!donationState || !publicKey || !xlmPrice) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const project = getProjectById(donationState.projectId);
  if (!project) {
    router.push("/donate");
    return null;
  }

  const impact = calculateImpact(donationState.amount);
  const formattedImpact = formatImpactMetrics(impact);
  const xlmAmount = convertUsdToXlm(donationState.amount, xlmPrice);
  const estimatedFee = "0.00001";

  const handleSuccess = async (txHash: string) => {
    setIsProcessing(true);

    // Add to transaction history
    addTransactionToHistory({
      hash: txHash,
      amount: donationState.amount,
      projectId: project.id,
      timestamp: Date.now(),
      cctTokens: impact.cctTokens,
    });

    // Clear donation state
    clearDonationState();

    // Refresh wallet balance
    await refreshBalance();

    // Navigate to success page
    router.push(`/donate/success?tx=${txHash}`);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setIsProcessing(false);
  };

  // Show full-screen processing overlay
  if (isProcessing) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            {/* Animated rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 border-4 border-green-200 rounded-full animate-ping"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 border-4 border-green-400 rounded-full animate-pulse"></div>
            </div>
            {/* Main spinner */}
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            {/* Success checkmark in center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Transaction Confirmed!
          </h2>
          <p className="text-gray-600 mb-4">Preparing your success page...</p>

          {/* Loading dots animation */}
          <div className="flex items-center justify-center gap-2">
            <div
              className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <ProgressIndicator currentStep={2} />
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Confirm Your Donation
          </h1>
          <p className="text-gray-600">
            Review the details before confirming your transaction
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
          {/* Project Details */}
          <div className="pb-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {project.name}
            </h2>
            <p className="text-sm text-gray-600 mb-2">{project.description}</p>
            <p className="text-sm text-gray-500">📍 {project.location}</p>
          </div>

          {/* Donation Summary */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Donation Summary</h3>

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Amount (USD)</span>
              <span className="font-semibold text-gray-900">
                ${donationState.amount.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Payment Amount</span>
              <span className="font-semibold text-gray-900">
                {xlmAmount} XLM
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Network Fee (estimated)</span>
              <span className="text-sm text-gray-500">~{estimatedFee} XLM</span>
            </div>

            <div className="flex justify-between items-center py-2 border-t border-gray-200 pt-3">
              <span className="text-gray-600">Your Wallet</span>
              <span className="text-sm font-mono text-gray-900">
                {truncatePublicKey(publicKey)}
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Wallet Balance</span>
              <span className="text-sm text-gray-900">
                {parseFloat(balance).toFixed(4)} XLM
              </span>
            </div>
          </div>

          {/* Environmental Impact */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
            <h3 className="font-semibold text-gray-900 mb-4">
              Environmental Impact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-2xl font-bold text-green-700">
                  {formattedImpact.trees}
                </p>
                <p className="text-sm text-gray-600">Trees Planted</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">
                  {formattedImpact.co2}
                </p>
                <p className="text-sm text-gray-600">kg CO₂ Offset</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-700">
                  {formattedImpact.cct}
                </p>
                <p className="text-sm text-gray-600">CCT Tokens</p>
              </div>
            </div>
          </div>

          {/* Insufficient Balance Warning */}
          {!hasEnoughBalance && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div className="flex-1">
                  <h4 className="font-semibold text-red-900 mb-1">
                    Insufficient Balance
                  </h4>
                  <p className="text-sm text-red-700 mb-3">
                    Your wallet doesn't have enough XLM to complete this
                    transaction. Please add funds to continue.
                  </p>
                  <a
                    href={getFaucetUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-red-700 hover:text-red-800 font-medium"
                  >
                    Get Testnet XLM from Faucet
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
                </div>
              </div>
            </div>
          )}

          {/* Transaction Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <div className="flex-1">
                  <h4 className="font-semibold text-red-900 mb-1">
                    Transaction Failed
                  </h4>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={() => router.push("/donate")}
              className="flex-1 py-3 px-6 text-gray-700 bg-gray-100 rounded-lg font-semibold hover:bg-gray-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 min-h-[44px]"
            >
              Back
            </button>

            {hasEnoughBalance ? (
              <div className="flex-1">
                <TransactionProcessor
                  sourcePublicKey={publicKey}
                  destinationAddress={publicKey}
                  xlmAmount={xlmAmount}
                  memo={`Donate:${project.id}`}
                  onSuccess={handleSuccess}
                  onError={handleError}
                />
              </div>
            ) : (
              <button
                disabled
                className="flex-1 py-4 px-6 text-white bg-gray-400 rounded-lg font-semibold text-lg cursor-not-allowed min-h-[44px]"
              >
                Insufficient Balance
              </button>
            )}
          </div>

          {/* Security Note */}
          <p className="text-xs text-gray-500 text-center">
            🔒 Your transaction will be securely signed with your Freighter
            wallet on the Stellar testnet
          </p>
        </div>
      </div>
    </div>
  );
}