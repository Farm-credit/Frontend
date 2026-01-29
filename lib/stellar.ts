// Stellar and Soroban integration utilities
// Using direct Horizon API calls to avoid Turbopack bundling issues with stellar-sdk

// Stellar testnet configuration
const STELLAR_NETWORK = process.env.NEXT_PUBLIC_STELLAR_NETWORK || 'testnet';
const HORIZON_URL = 
  STELLAR_NETWORK === 'testnet' 
    ? 'https://horizon-testnet.stellar.org'
    : 'https://horizon.stellar.org';

// CCT Token contract address (replace with actual contract address)
// Note: RPC_URL will be used when Soroban contract integration is implemented
const CCT_TOKEN_CONTRACT = process.env.NEXT_PUBLIC_CCT_TOKEN_CONTRACT || '';

// Helper function to fetch from Horizon API
const fetchFromHorizon = async (endpoint: string) => {
  const response = await fetch(`${HORIZON_URL}${endpoint}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw { response: { status: 404 } };
    }
    throw new Error(`Horizon API error: ${response.statusText}`);
  }
  return response.json();
};

export interface TokenBalance {
  balance: string;
  assetCode: string;
  assetIssuer?: string;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'Donation' | 'Transfer' | 'Retirement';
  amount: string;
  co2Impact: string;
  hash: string;
}

// Fetch CCT token balance from Soroban contract or Stellar account
export const getCCTTokenBalance = async (publicKey: string): Promise<string> => {
  try {
    // If CCT_TOKEN_CONTRACT is set, try to fetch from Soroban contract
    if (CCT_TOKEN_CONTRACT) {
      // TODO: Implement Soroban contract call when Soroban SDK is available
      // For now, fall through to check account balances
      console.log('CCT Token Contract specified, but Soroban SDK integration needed');
    }
    
    // Fetch account balances from Stellar using Horizon API
    try {
      const account = await fetchFromHorizon(`/accounts/${publicKey}`);
      
      // Look for CCT asset in account balances
      // If CCT is a Stellar asset (not Soroban token), it will be in balances
      interface Balance {
        asset_code?: string;
        balance?: string;
      }
      const cctBalance = (account.balances as Balance[] | undefined)?.find(
        (balance) => 
          balance.asset_code === 'CCT' || 
          balance.asset_code === 'CCTTOKEN'
      );
      
      if (cctBalance) {
        return cctBalance.balance || '0';
      }
      
      // If no CCT asset found, return 0
      // This could mean:
      // 1. CCT is a Soroban token (needs contract call)
      // 2. Account has no CCT tokens
      return '0';
    } catch (accountError) {
      // Account might not exist or have no balances
      interface ErrorWithResponse {
        response?: { status?: number };
      }
      const error = accountError as ErrorWithResponse;
      if (error?.response?.status === 404) {
        console.log('Account not found on Stellar network');
        return '0';
      }
      throw accountError;
    }
  } catch (error) {
    console.error('Error fetching CCT token balance:', error);
    return '0';
  }
};

// Fetch transaction history from Stellar Horizon API
export const getTransactionHistory = async (
  publicKey: string,
  limit: number = 50
): Promise<Transaction[]> => {
  try {
    // Fetch transactions directly from Horizon API
    const transactionsResponse = await fetchFromHorizon(
      `/accounts/${publicKey}/transactions?limit=${limit}&order=desc`
    );
    
    const transactions: Transaction[] = [];
    const seenHashes = new Set<string>();
    
    for (const tx of transactionsResponse._embedded?.records || []) {
      // Skip if we've already processed this transaction
      if (seenHashes.has(tx.hash)) continue;
      seenHashes.add(tx.hash);
      
      // Determine transaction type based on memo
      let type: 'Donation' | 'Transfer' | 'Retirement' = 'Transfer';
      
      if (tx.memo) {
        const memo = typeof tx.memo === 'string' 
          ? tx.memo.toLowerCase() 
          : String(tx.memo).toLowerCase();
        
        if (memo.includes('donation') || memo.includes('donate')) {
          type = 'Donation';
        } else if (memo.includes('retire') || memo.includes('retirement')) {
          type = 'Retirement';
        }
      }
      
      // Get operations for this transaction to find payment amounts
      const operations = await fetchFromHorizon(`/transactions/${tx.hash}/operations`);
      
      // Find payment operations (both incoming and outgoing)
      interface Operation {
        type: string;
        to?: string;
        from?: string;
        amount?: string;
      }
      const paymentOps = (operations._embedded?.records as Operation[] | undefined || []).filter(
        (op) => op.type === 'payment' && (op.to === publicKey || op.from === publicKey)
      );
      
      if (paymentOps.length > 0) {
        const payment = paymentOps[0];
        const amount = payment.amount || '0';
        const co2Impact = type === 'Retirement' ? amount : '0';
        
        transactions.push({
          id: tx.id,
          date: tx.created_at,
          type,
          amount,
          co2Impact,
          hash: tx.hash,
        });
      } else {
        // If no payment operation found, still add transaction for other operation types
        // This handles cases where transaction has other operation types
        transactions.push({
          id: tx.id,
          date: tx.created_at,
          type,
          amount: '0',
          co2Impact: '0',
          hash: tx.hash,
        });
      }
    }
    
    return transactions;
  } catch (error) {
    // Handle account not found or other errors gracefully
    interface ErrorWithResponse {
      response?: { status?: number };
    }
    const err = error as ErrorWithResponse;
    if (err?.response?.status === 404) {
      console.log('Account not found or has no transactions');
      return [];
    }
    console.error('Error fetching transaction history:', error);
    return [];
  }
};

// Calculate total CO2 offset from transactions
export const getTotalCO2Offset = async (publicKey: string): Promise<string> => {
  try {
    const transactions = await getTransactionHistory(publicKey);
    const total = transactions
      .filter(tx => tx.type === 'Retirement')
      .reduce((sum, tx) => sum + parseFloat(tx.co2Impact || '0'), 0);
    
    return total.toFixed(2);
  } catch (error) {
    console.error('Error calculating CO2 offset:', error);
    return '0';
  }
};

// Calculate number of trees funded (assuming 1 token = 10 trees, adjust as needed)
export const getTreesFunded = async (publicKey: string): Promise<number> => {
  try {
    const transactions = await getTransactionHistory(publicKey);
    const totalDonations = transactions
      .filter(tx => tx.type === 'Donation')
      .reduce((sum, tx) => sum + parseFloat(tx.amount || '0'), 0);
    
    // 1 token = 10 trees (adjust based on your project's calculation)
    return Math.floor(totalDonations * 10);
  } catch (error) {
    console.error('Error calculating trees funded:', error);
    return 0;
  }
};

// Get Stellar explorer link for transaction
export const getTransactionLink = (hash: string): string => {
  const explorerBase = 
    STELLAR_NETWORK === 'testnet'
      ? 'https://stellar.expert/explorer/testnet/tx'
      : 'https://stellar.expert/explorer/public/tx';
  
  return `${explorerBase}/${hash}`;
};
