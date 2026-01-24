// app/donate/succcess

"use client";

/**
 * Success Page - Display transaction success and impact
 */

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getTransactionHistory, clearDonationState } from "@/lib/storage-utils";
import ProgressIndicator from "@/components/progress-indicator";
import { getProjectById } from "@/lib/mock-data";
import { formatImpactMetrics } from "@/lib/impact-calculator";
import { getExplorerUrl } from "@/lib/stellar-utils";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const txHash = searchParams.get("tx");
  const [transaction, setTransaction] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Clear any leftover donation state
    clearDonationState();

    if (!txHash) {
      router.push("/donate");
      return;
    }

    // Get transaction from history
    const history = getTransactionHistory();
    const tx = history.find((t) => t.hash === txHash);
    setTransaction(tx);
  }, [txHash, router]);

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transaction details...</p>
        </div>
      </div>
    );
  }

  const project = getProjectById(transaction.projectId);
  const impact = {
    trees: transaction.amount * 0.5,
    co2Kg: transaction.amount * 2.5,
    cctTokens: transaction.cctTokens,
  };
  const formattedImpact = formatImpactMetrics(impact);
  const explorerUrl = getExplorerUrl(txHash!);

  const copyToClipboard = () => {
    if (txHash) {
      navigator.clipboard.writeText(txHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <ProgressIndicator currentStep={4} />
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-6 animate-bounce">
            <svg
              className="w-10 h-10 text-white"
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Donation Successful! 🎉
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for making a positive impact on our planet
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
          {/* Transaction Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Transaction Details
            </h2>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-1">Transaction Hash</p>
                  <p className="font-mono text-xs text-gray-900 break-all">
                    {txHash}
                  </p>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="flex-shrink-0 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mt-2"
              >
                View on Stellar Explorer
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

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Amount Donated</span>
              <span className="font-semibold text-gray-900">
                ${transaction.amount.toFixed(2)} USD
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Project</span>
              <span className="font-semibold text-gray-900">
                {project?.name}
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Date</span>
              <span className="text-sm text-gray-900">
                {new Date(transaction.timestamp).toLocaleString()}
              </span>
            </div>
          </div>

          {/* CCT Tokens Received */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-300">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">You Received</p>
                <p className="text-3xl font-bold text-amber-900">
                  {formattedImpact.cct} CCT
                </p>
                <p className="text-xs text-gray-600">Carbon Credit Tokens</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mt-4">
              ✨ Your Carbon Credit Tokens have been simulated on the Stellar
              testnet. In a production environment, these would be real
              tokenized carbon credits.
            </p>
          </div>

          {/* Environmental Impact Summary */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span>🌍</span>
              Your Environmental Impact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formattedImpact.trees}
                  </p>
                  <p className="text-sm text-gray-600">Trees Planted</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formattedImpact.co2}
                  </p>
                  <p className="text-sm text-gray-600">kg CO₂ Offset</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={() => router.push("/donate")}
              className="flex-1 py-3 px-6 text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 min-h-[44px]"
            >
              Make Another Donation
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex-1 py-3 px-6 text-gray-700 bg-gray-100 rounded-lg font-semibold hover:bg-gray-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 min-h-[44px]"
            >
              Back to Home
            </button>
          </div>

          {/* Social Sharing Note */}
          <p className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
            💚 Share your impact with friends and inspire others to make a
            difference!
          </p>
        </div>
      </div>
    </div>
  );
}