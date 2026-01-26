/**
 * Stellar blockchain utilities for transaction building and submission
 */

import * as StellarSdk from "@stellar/stellar-sdk";
import { conversionRates } from "./mock-data";

// Stellar testnet configuration
export const STELLAR_NETWORK = "TESTNET";
export const HORIZON_URL = "https://horizon-testnet.stellar.org";
export const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;

// Initialize Horizon server
const server = new StellarSdk.Horizon.Server(HORIZON_URL);

export interface XlmPrice {
  usd: number;
  timestamp: number;
}

export interface TransactionResult {
  success: boolean;
  hash?: string;
  error?: string;
}

export interface AccountBalance {
  xlm: string;
  hasEnough: boolean;
}

/**
 * Fetch live XLM price from CoinGecko API
 * Falls back to mock rate if API fails
 */
export async function fetchXlmPrice(): Promise<number> {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=usd",
      { cache: "no-store" },
    );

    if (!response.ok) {
      throw new Error("CoinGecko API request failed");
    }

    const data = await response.json();
    const price = data?.stellar?.usd;

    if (typeof price === "number" && price > 0) {
      return price;
    }

    throw new Error("Invalid price data from API");
  } catch (error) {
    console.warn("Failed to fetch XLM price, using fallback:", error);
    // Return fallback rate: 1 USD = 10 XLM (mock testnet rate)
    return 1 / conversionRates.fallbackXlmPerDollar;
  }
}

/**
 * Convert USD to XLM amount
 * @param usdAmount - Amount in USD
 * @param xlmPriceUsd - Current XLM price in USD
 * @returns XLM amount as string
 */
export function convertUsdToXlm(
  usdAmount: number,
  xlmPriceUsd: number,
): string {
  const xlmAmount = usdAmount / xlmPriceUsd;
  return xlmAmount.toFixed(7); // Stellar supports 7 decimal places
}

/**
 * Check account balance on Stellar testnet
 * @param publicKey - Stellar public key
 * @returns Account balance and sufficiency check
 */
export async function checkAccountBalance(
  publicKey: string,
  requiredXlm: number = 0,
): Promise<AccountBalance> {
  try {
    const account = await server.loadAccount(publicKey);
    const xlmBalance = account.balances.find(
      (balance) => balance.asset_type === "native",
    );

    const balance = xlmBalance?.balance || "0";
    const balanceNum = parseFloat(balance);

    return {
      xlm: balance,
      hasEnough: balanceNum >= requiredXlm + 0.00001, // Include base fee
    };
  } catch (error: any) {
    // Account doesn't exist on testnet yet (needs funding from faucet)
    // This is normal for new wallets - don't log as error
    if (
      error?.response?.status === 404 ||
      error?.response?.data?.status === 404
    ) {
      console.info(
        "Account not yet funded on testnet:",
        publicKey.substring(0, 8) + "...",
      );
    } else {
      console.error("Failed to load account balance:", error);
    }

    return {
      xlm: "0",
      hasEnough: false,
    };
  }
}

/**
 * Build a payment transaction
 * @param sourcePublicKey - Sender's public key
 * @param destinationAddress - Receiver's public key
 * @param xlmAmount - Amount in XLM
 * @param memo - Transaction memo
 * @returns Transaction XDR string
 */
export async function buildPaymentTransaction(
  sourcePublicKey: string,
  destinationAddress: string,
  xlmAmount: string,
  memo: string = "",
): Promise<string> {
  try {
    // Load source account
    const account = await server.loadAccount(sourcePublicKey);

    // Build transaction
    const transactionBuilder = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    });

    // Add payment operation
    transactionBuilder.addOperation(
      StellarSdk.Operation.payment({
        destination: destinationAddress,
        asset: StellarSdk.Asset.native(), // XLM
        amount: xlmAmount,
      }),
    );

    // Add memo if provided (Stellar text memos have 28 byte limit)
    if (memo) {
      // Truncate memo to 28 bytes if needed
      const truncatedMemo = memo.length > 28 ? memo.substring(0, 28) : memo;
      transactionBuilder.addMemo(StellarSdk.Memo.text(truncatedMemo));
    }

    // Set timeout and build
    const transaction = transactionBuilder.setTimeout(180).build();

    return transaction.toXDR();
  } catch (error) {
    console.error("Failed to build transaction:", error);
    throw new Error("Failed to build payment transaction");
  }
}

/**
 * Submit signed transaction to Stellar Horizon
 * @param signedXdr - Signed transaction XDR
 * @returns Transaction result with hash or error
 */
export async function submitTransaction(
  signedXdr: string,
): Promise<TransactionResult> {
  try {
    const transaction = StellarSdk.TransactionBuilder.fromXDR(
      signedXdr,
      NETWORK_PASSPHRASE,
    );

    const result = await server.submitTransaction(
      transaction as StellarSdk.Transaction,
    );

    return {
      success: true,
      hash: result.hash,
    };
  } catch (error: any) {
    console.error("Transaction submission failed:", error);

    let errorMessage = "Transaction failed";
    if (error?.response?.data?.extras?.result_codes) {
      const codes = error.response.data.extras.result_codes;
      errorMessage = `Transaction failed: ${codes.transaction || "Unknown error"}`;
    } else if (error?.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Poll transaction status from Horizon
 * @param txHash - Transaction hash
 * @param maxAttempts - Maximum polling attempts
 * @returns True if confirmed, false if timeout
 */
export async function pollTransactionStatus(
  txHash: string,
  maxAttempts: number = 10,
): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await server.transactions().transaction(txHash).call();
      return true; // Transaction found and confirmed
    } catch (error) {
      // Wait before next attempt
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return false; // Timeout
}

/**
 * Get Stellar testnet explorer URL
 */
export function getExplorerUrl(txHash: string): string {
  return `https://stellar.expert/explorer/testnet/tx/${txHash}`;
}

/**
 * Get Stellar testnet faucet URL
 */
export function getFaucetUrl(): string {
  return "https://laboratory.stellar.org/#account-creator";
}

/**
 * Truncate Stellar public key for display
 * Example: GABC...XYZ9
 */
export function truncatePublicKey(
  publicKey: string,
  chars: number = 4,
): string {
  if (publicKey.length <= chars * 2) return publicKey;
  return `${publicKey.slice(0, chars)}...${publicKey.slice(-chars)}`;
}