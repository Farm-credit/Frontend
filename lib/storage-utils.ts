/**
 * LocalStorage utilities for donation flow state persistence
 */

export interface DonationState {
  amount: number;
  projectId: string;
  timestamp: number;
}

export interface TransactionRecord {
  hash: string;
  amount: number;
  projectId: string;
  timestamp: number;
  cctTokens: number;
}

const STORAGE_KEYS = {
  DONATION_STATE: "drip_donation_state",
  TRANSACTION_HISTORY: "drip_transaction_history",
  WALLET_PUBLIC_KEY: "drip_wallet_public_key",
} as const;

/**
 * Save donation state to localStorage
 */
export function saveDonationState(state: DonationState): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEYS.DONATION_STATE, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save donation state:", error);
  }
}

/**
 * Get donation state from localStorage
 */
export function getDonationState(): DonationState | null {
  if (typeof window === "undefined") return null;

  try {
    const data = localStorage.getItem(STORAGE_KEYS.DONATION_STATE);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Failed to get donation state:", error);
    return null;
  }
}

/**
 * Clear donation state from localStorage
 */
export function clearDonationState(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEYS.DONATION_STATE);
  } catch (error) {
    console.error("Failed to clear donation state:", error);
  }
}

/**
 * Add transaction to history
 */
export function addTransactionToHistory(transaction: TransactionRecord): void {
  if (typeof window === "undefined") return;

  try {
    const history = getTransactionHistory();
    history.unshift(transaction); // Add to beginning
    localStorage.setItem(
      STORAGE_KEYS.TRANSACTION_HISTORY,
      JSON.stringify(history),
    );
  } catch (error) {
    console.error("Failed to add transaction to history:", error);
  }
}

/**
 * Get transaction history
 */
export function getTransactionHistory(): TransactionRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTION_HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to get transaction history:", error);
    return [];
  }
}

/**
 * Save wallet public key
 */
export function saveWalletPublicKey(publicKey: string): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEYS.WALLET_PUBLIC_KEY, publicKey);
  } catch (error) {
    console.error("Failed to save wallet public key:", error);
  }
}

/**
 * Get saved wallet public key
 */
export function getWalletPublicKey(): string | null {
  if (typeof window === "undefined") return null;

  try {
    return localStorage.getItem(STORAGE_KEYS.WALLET_PUBLIC_KEY);
  } catch (error) {
    console.error("Failed to get wallet public key:", error);
    return null;
  }
}

/**
 * Clear wallet public key
 */
export function clearWalletPublicKey(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEYS.WALLET_PUBLIC_KEY);
  } catch (error) {
    console.error("Failed to clear wallet public key:", error);
  }
}