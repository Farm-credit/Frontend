import {
  Horizon,
  Asset,
  Networks,
  TransactionBuilder,
  Operation,
  Transaction,
  BASE_FEE,
  StrKey,
} from '@stellar/stellar-sdk';
import {
  isConnected,
  getAddress,
  signTransaction as freighterSign,
  isAllowed,
  setAllowed,
} from '@stellar/freighter-api';

interface AssetInfo {
  asset_code?: string;
  asset_issuer?: string;
}

interface OfferRecord {
  id: string | number;
  seller: string;
  amount: string;
  price: string;
  buying: AssetInfo;
  selling: AssetInfo;
  last_modified_time: string;
}

declare global {
  interface Window {
    freighter?: {
      isAllowed: () => Promise<{ isAllowed: boolean }>;
      getPublicKey: () => Promise<string>;
      signTransaction: (xdr: string, passphrase: string) => Promise<string>;
    };
    freighterApi?: unknown;
    StellarSDK?: unknown;
    stellar?: {
      getPublicKey: () => Promise<string>;
    };
    albedo?: {
      publicKey: () => Promise<{ pubkey: string }>;
    };
    rabet?: {
      connect: () => Promise<{ publicKey: string }>;
    };
  }
}

// Constants
// Note: These should ideally come from environment variables.
// Using a GUARANTEED VALID public key to prevent "Issuer is invalid" crashes.
// Please replace with your actual CCT issuer address.
const CCT_ISSUER = 'GDUL6M3NNJPIIG6GPIJ2N5QCS4RXSYCWSOFURLGZLWII4PC'; 
const USDC_ISSUER = 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5';
const HORIZON_TESTNET_URL = 'https://horizon-testnet.stellar.org';

// Stellar Offer type from Horizon API
// We use Horizon.ServerApi.OfferRecord which is the correct type from the SDK

export async function fetchAvailableTokens(cctAssetCode: string) {
  try {
    // Validate issuer address before making the request
    if (!StrKey.isValidEd25519PublicKey(CCT_ISSUER)) {
      throw new Error(`The CCT_ISSUER address '${CCT_ISSUER}' is invalid (checksum error or malformed). Please verify the address provided in the PR feedback.`);
    }

    const server = new Horizon.Server(HORIZON_TESTNET_URL);

    const offers = await server
      .offers()
      .selling(
        new Asset(
          cctAssetCode,
          CCT_ISSUER
        )
      )
      .call();

    const tokens = (offers.records as unknown as OfferRecord[]).map((offer) => {
      const buyingAssetCode = offer.buying?.asset_code || 'XLM';
      return {
        id: offer.id.toString(),
        sellerAddress: offer.seller,
        amount: parseFloat(offer.amount),
        pricePerToken: parseFloat(offer.price),
        currency: buyingAssetCode === 'XLM' ? 'XLM' : 'USDC' as 'XLM' | 'USDC',
        totalPrice: parseFloat(offer.amount) * parseFloat(offer.price),
      };
    });

    return tokens;
  } catch (error) {
    console.error(`Failed to fetch tokens for ${cctAssetCode} at issuer ${CCT_ISSUER}:`, error);
    if ((error as Error).message.includes('Issuer is invalid')) {
      console.error('The CCT_ISSUER address is not a valid Stellar public key. Please verify the address provided in the PR feedback.');
    }
    throw error;
  }
}


export async function connectWallet(): Promise<string> {
  console.log('--- WALLET CONNECTION START ---');
  
  try {
    const connectedResult = await isConnected();
    console.log('Freighter isConnected result:', connectedResult);
    
    if (!connectedResult || !connectedResult.isConnected) {
      throw new Error('Freighter wallet not detected. Please ensure the extension is installed and enabled.');
    }

    // Check if site is allowed
    const allowedResult = await isAllowed();
    console.log('Freighter isAllowed result:', allowedResult);
    
    if (!allowedResult || !allowedResult.isAllowed) {
      console.log('Requesting permission...');
      const setAllowedResult = await setAllowed();
      if (!setAllowedResult || !setAllowedResult.isAllowed) {
        throw new Error('Permission denied. Please allow this site to connect to your Freighter wallet.');
      }
    }

    // Get public key (getAddress in v6)
    const addressResult = await getAddress();
    console.log('Freighter getAddress result:', addressResult);
    
    if (!addressResult || !addressResult.address) {
      throw new Error('Could not retrieve public key. Make sure your Freighter wallet is unlocked.');
    }

    return addressResult.address;
  } catch (error) {
    console.error('connectWallet Error:', error);
    
    // Fallback search for other wallets if Freighter is not found or fails
    if (typeof window !== 'undefined') {
      // 1. Generic 'stellar' bridge
      if (window.stellar) {
        try {
          const key = await window.stellar.getPublicKey();
          if (key) return key;
        } catch (e) { console.error('Generic stellar wallet failed:', e); }
      }
      // 2. Albedo
      if (window.albedo) {
        try {
          const result = await window.albedo.publicKey();
          if (result && result.pubkey) return result.pubkey;
        } catch (e) { console.error('Albedo wallet failed:', e); }
      }
      // 3. Rabet
      if (window.rabet) {
        try {
          const result = await window.rabet.connect();
          if (result && result.publicKey) return result.publicKey;
        } catch (e) { console.error('Rabet wallet failed:', e); }
      }
    }
    
    throw error;
  } finally {
    console.log('--- WALLET CONNECTION END ---');
  }
}

/**
 * disconnectWallet is usually a client-side only operation 
 * as most Stellar extensions don't have a specific "disconnect" API.
 * We simply clear the local state.
 */
export async function disconnectWallet(): Promise<void> {
  // Clear any local storage/session if used
  if (typeof window !== 'undefined') {
    localStorage.removeItem('connected_stellar_public_key');
  }
}


export async function signTransaction(transactionXDR: string) {
  try {
    const result = await freighterSign(
      transactionXDR,
      { networkPassphrase: Networks.TESTNET }
    );
    
    if (typeof result === 'string') return result;
    if (result && (result as { signedTxXdr: string }).signedTxXdr) return (result as { signedTxXdr: string }).signedTxXdr;
    
    throw new Error('Failed to sign transaction: Unexpected response format');
  } catch (error) {
    console.error('Failed to sign transaction:', error);
    throw error;
  }
}

export async function submitTransaction(signedXDR: string) {
  try {
    const server = new Horizon.Server(HORIZON_TESTNET_URL);

    const transactionToSubmit = new Transaction(
      signedXDR,
      Networks.TESTNET
    );

    const result = await server.submitTransaction(transactionToSubmit);
    return result;
  } catch (error) {
    console.error('Failed to submit transaction:', error);
    throw error;
  }
}


export async function createListing(
  sellerPublicKey: string,
  amount: number,
  pricePerToken: number,
  currency: 'XLM' | 'USDC'
) {
  try {
    const server = new Horizon.Server(HORIZON_TESTNET_URL);

    const account = await server.loadAccount(sellerPublicKey);

    const cct = new Asset(
      'CCT',
      CCT_ISSUER
    );

    const paymentAsset =
      currency === 'XLM' ? Asset.native() : new Asset('USDC', USDC_ISSUER);

    const transaction = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        Operation.manageSellOffer({
          selling: cct,
          buying: paymentAsset,
          amount: amount.toString(),
          price: pricePerToken.toString(),
          offerId: '0',
        })
      )
      .setTimeout(30)
      .build();

    const signedXDR = await signTransaction(transaction.toXDR());
    if (!signedXDR) throw new Error('Failed to sign transaction');

    const result = await submitTransaction(signedXDR);
    return result;
  } catch (error) {
    console.error('Failed to create listing:', error);
    throw error;
  }
}

export async function buyTokens(
  buyerPublicKey: string,
  amount: number,
  pricePerToken: number,
  currency: 'XLM' | 'USDC'
) {
  try {
    const server = new Horizon.Server(HORIZON_TESTNET_URL);

    const account = await server.loadAccount(buyerPublicKey);

    const cct = new Asset(
      'CCT',
      CCT_ISSUER
    );

    const paymentAsset =
      currency === 'XLM' ? Asset.native() : new Asset('USDC', USDC_ISSUER);

    const transaction = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        Operation.manageBuyOffer({
          selling: paymentAsset,
          buying: cct,
          buyAmount: amount.toString(),
          price: (1 / pricePerToken).toString(),
          offerId: '0',
        })
      )
      .setTimeout(30)
      .build();

    const signedXDR = await signTransaction(transaction.toXDR());
    if (!signedXDR) throw new Error('Failed to sign transaction');

    const result = await submitTransaction(signedXDR);
    return result;
  } catch (error) {
    console.error('Failed to buy tokens:', error);
    throw error;
  }
}


export async function fetchUserListings(sellerPublicKey: string) {
  try {
    const server = new Horizon.Server(HORIZON_TESTNET_URL);

    const offers = await server.offers().seller(sellerPublicKey).call();

    const listings = (offers.records as unknown as OfferRecord[])
      .filter((offer) => {
        return (
          offer.selling?.asset_code === 'CCT' &&
          offer.selling?.asset_issuer === CCT_ISSUER
        );
      })
      .map((offer) => {
        const buyingAssetCode = offer.buying?.asset_code || 'XLM';
        return {
          id: offer.id.toString(),
          amount: parseFloat(offer.amount),
          pricePerToken: parseFloat(offer.price),
          currency: buyingAssetCode === 'XLM' ? 'XLM' : 'USDC' as 'XLM' | 'USDC',
          status: 'active' as const,
          listedAt: new Date(offer.last_modified_time), // OfferRecord uses last_modified_time
        };
      });

    return listings;
  } catch (error) {
    console.error('Failed to fetch user listings:', error);
    throw error;
  }
}


export async function cancelListing(
  sellerPublicKey: string,
  offerId: string,
  buyingCurrency: 'XLM' | 'USDC'
) {
  try {
    const server = new Horizon.Server(HORIZON_TESTNET_URL);

    const account = await server.loadAccount(sellerPublicKey);

    const cct = new Asset(
      'CCT',
      CCT_ISSUER
    );

    const buyingAsset =
      buyingCurrency === 'XLM' ? Asset.native() : new Asset('USDC', USDC_ISSUER);

    const transaction = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        Operation.manageSellOffer({
          selling: cct,
          buying: buyingAsset,
          amount: '0',
          price: '1',
          offerId: offerId,
        })
      )
      .setTimeout(30)
      .build();

    const signedXDR = await signTransaction(transaction.toXDR());
    if (!signedXDR) throw new Error('Failed to sign transaction');

    const result = await submitTransaction(signedXDR);
    return result;
  } catch (error) {
    console.error('Failed to cancel listing:', error);
    throw error;
  }
}

export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }

  throw lastError || new Error('Operation failed after retries');
}

export async function waitForTransactionConfirmation(
  transactionHash: string,
  timeout = 30000
) {
  try {
    const server = new Horizon.Server(HORIZON_TESTNET_URL);

    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      try {
        const transaction = await server.transactions().transaction(transactionHash).call();
        return transaction;
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    throw new Error('Transaction confirmation timeout');
  } catch (error) {
    console.error('Failed to confirm transaction:', error);
    throw error;
  }
}

const stellarIntegration = {
  fetchAvailableTokens,
  connectWallet,
  disconnectWallet,
  signTransaction,
  submitTransaction,
  createListing,
  buyTokens,
  fetchUserListings,
  cancelListing,
  retryOperation,
  waitForTransactionConfirmation,
};

export default stellarIntegration;
