"use client";

/**
 * Transaction Processor - Handles Stellar transaction building, signing, and submission
 */

import React, { useState } from "react";
import { signTransaction } from "@stellar/freighter-api";
import {
  buildPaymentTransaction,
  submitTransaction,
  pollTransactionStatus,
  STELLAR_NETWORK,
  NETWORK_PASSPHRASE,
} from "@/lib/stellar-utils";

interface TransactionProcessorProps {
  sourcePublicKey: string;
  destinationAddress: string;
  xlmAmount: string;
  memo: string;
  onSuccess: (txHash: string) => void;
  onError: (error: string) => void;
}

type ProcessingStep =
  | "idle"
  | "building"
  | "signing"
  | "submitting"
  | "confirming";

export default function TransactionProcessor({
  sourcePublicKey,
  destinationAddress,
  xlmAmount,
  memo,
  onSuccess,
  onError,
}: TransactionProcessorProps) {
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<ProcessingStep>("idle");

  const processTransaction = async () => {
    setProcessing(true);

    try {
      // Step 1: Build transaction
      setStep("building");
      const transactionXdr = await buildPaymentTransaction(
        sourcePublicKey,
        destinationAddress,
        xlmAmount,
        memo,
      );

      // Step 2: Sign with Freighter
      setStep("signing");
      const signedXdr = await signTransaction(transactionXdr, {
        networkPassphrase: NETWORK_PASSPHRASE,
      });

      // Step 3: Submit to Horizon
      setStep("submitting");
      const result = await submitTransaction(signedXdr.signedTxXdr);

      if (!result.success || !result.hash) {
        throw new Error(result.error || "Transaction submission failed");
      }

      // Step 4: Confirm transaction
      setStep("confirming");
      const confirmed = await pollTransactionStatus(result.hash);

      if (!confirmed) {
        throw new Error("Transaction confirmation timeout");
      }

      // Success!
      onSuccess(result.hash);
    } catch (error: any) {
      console.error("Transaction processing error:", error);

      let errorMessage = "Transaction failed";

      if (
        error.message?.includes("rejected") ||
        error.message?.includes("denied")
      ) {
        errorMessage = "Transaction signature rejected. Please try again.";
      } else if (error.message?.includes("insufficient")) {
        errorMessage =
          "Insufficient XLM balance. Please add funds to your wallet.";
      } else if (error.message?.includes("timeout")) {
        errorMessage =
          "Transaction confirmation timeout. It may still be processing.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      onError(errorMessage);
    } finally {
      setProcessing(false);
      setStep("idle");
    }
  };

  const getStepMessage = (): string => {
    switch (step) {
      case "building":
        return "Building transaction...";
      case "signing":
        return "Waiting for signature...";
      case "submitting":
        return "Submitting to network... ~5s";
      case "confirming":
        return "Confirming transaction...";
      default:
        return "Processing";
    }
  };

  return (
    <div>
      <button
        onClick={processTransaction}
        disabled={processing}
        className="w-full py-4 px-6 text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-semibold text-lg hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 min-h-[44px]"
      >
        {processing ? (
          <span className="flex items-center justify-center gap-3">
            <svg
              className="animate-spin h-5 w-5 text-white"
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
            {getStepMessage()}
          </span>
        ) : (
          "Confirm & Donate"
        )}
      </button>
    </div>
  );
}