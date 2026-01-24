import {
  Server,
  Asset,
  Networks,
  TransactionBuilder,
  Operation,
  Transaction,
  BASE_FEE,
} from '@stellar/stellar-sdk';

declare global {
  interface Window {
    freighter?: {
      isAllowed: () => Promise<{ isAllowed: boolean }>;
      getPublicKey: () => Promise<string>;
      signTransaction: (xdr: string, passphrase: string) => Promise<string>;
    };
    // Some versions might use different property names
    freighterApi?: any;
  }
}

// Constants
const CCT_ISSUER = 'GBUQWP3BOUZX34ULNQG23RQ6F4YUSXHTIQRXE3YLTZ3A3ZIUCHSCYRJI';
const USDC_ISSUER = 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5';
const HORIZON_TESTNET_URL = 'https://horizon-testnet.stellar.org';

// Stellar Offer type from Horizon API
interface StellarOffer {
  id: string | number;
  seller: string;
  amount: string;
  price: string;
  selling: {
    asset_code: string;
    asset_issuer: string;
  };
  buying: {
    asset_code: string | null;
    asset_issuer: string | null;
  };
  created_at: string;
}

export async function fetchAvailableTokens(cctAssetCode: string) {
  try {
    const server = new Server(HORIZON_TESTNET_URL);

    const offers = await server
      .offers()
      .selling(
        new Asset(
          cctAssetCode,
          CCT_ISSUER
        )
      )
      .call();

    const tokens = offers.records.map((offer: StellarOffer) => {
      const buyingAssetCode = offer.buying.asset_code || 'XLM';
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
    console.error('Failed to fetch tokens:', error);
    throw error;
  }
}


export async function connectWallet() {
  try {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      console.error('Window object not available');
      return null;
    }

    // Check for Freighter using multiple methods
    const checkFreighter = () => {
      // Method 1: Direct window.freighter (most common)
      if (window.freighter) {
        return window.freighter;
      }
      
      // Method 2: Alternative property name
      if (window.freighterApi) {
        return window.freighterApi;
      }
      
      // Method 3: Check if it's available but not yet injected
      // Some extensions inject asynchronously
      return null;
    };

    // Wait for Freighter to be available (it might take a moment to inject)
    let attempts = 0;
    const maxAttempts = 30; // Increased to 3 seconds
    let freighter = checkFreighter();
    
    while (!freighter && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      freighter = checkFreighter();
      attempts++;
    }

    if (!freighter) {
      console.error('Freighter not installed or not available');
      console.log('Debug info:', {
        windowExists: typeof window !== 'undefined',
        freighterExists: !!window.freighter,
        freighterApiExists: !!(window as any).freighterApi,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
        chromeRuntime: !!(window as any).chrome?.runtime
      });
      console.log('Troubleshooting steps:');
      console.log('1. Make sure Freighter extension is installed from freighter.app');
      console.log('2. Check that the extension is enabled in your browser');
      console.log('3. Try refreshing the page (Ctrl+Shift+R or Cmd+Shift+R)');
      console.log('4. Open Freighter extension and make sure it\'s unlocked');
      console.log('5. In browser console, type: window.freighter - if it shows an object, Freighter is available');
      return null;
    }

    // Check if Freighter is connected/allowed
    try {
      const { isAllowed } = await freighter.isAllowed();
      if (!isAllowed) {
        console.error('Freighter not allowed - user may need to approve the connection');
        return null;
      }
    } catch (error) {
      console.error('Error checking Freighter permission:', error);
      // Continue anyway - some versions might not have isAllowed
    }

    // Get public key
    try {
      const publicKey = await freighter.getPublicKey();
      return publicKey;
    } catch (error) {
      console.error('Error getting public key from Freighter:', error);
      return null;
    }
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    return null;
  }
}


export async function signTransaction(transactionXDR: string) {
  try {
    if (!window.freighter) {
      throw new Error('Freighter not available');
    }

    const signedXDR = await window.freighter.signTransaction(
      transactionXDR,
      Networks.TESTNET
    );
    return signedXDR;
  } catch (error) {
    console.error('Failed to sign transaction:', error);
    throw error;
  }
}

export async function submitTransaction(signedXDR: string) {
  try {
    const server = new Server(HORIZON_TESTNET_URL);

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
    const server = new Server(HORIZON_TESTNET_URL);

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
      .setDefaultTimeout(30)
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
    const server = new Server(HORIZON_TESTNET_URL);

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
      .setDefaultTimeout(30)
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
    const server = new Server(HORIZON_TESTNET_URL);

    const offers = await server.offers().forSeller(sellerPublicKey).call();

    const listings = offers.records
      .filter((offer: StellarOffer) => {
        return (
          offer.selling.asset_code === 'CCT' &&
          offer.selling.asset_issuer === CCT_ISSUER
        );
      })
      .map((offer: StellarOffer) => {
        const buyingAssetCode = offer.buying.asset_code || 'XLM';
        return {
          id: offer.id.toString(),
          amount: parseFloat(offer.amount),
          pricePerToken: parseFloat(offer.price),
          currency: buyingAssetCode === 'XLM' ? 'XLM' : 'USDC' as 'XLM' | 'USDC',
          status: 'active' as const,
          listedAt: new Date(offer.created_at),
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
    const server = new Server(HORIZON_TESTNET_URL);

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
      .setDefaultTimeout(30)
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
    const server = new Server(HORIZON_TESTNET_URL);

    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      try {
        const transaction = await server.transactions().transaction(transactionHash).call();
        return transaction;
      } catch (error) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    throw new Error('Transaction confirmation timeout');
  } catch (error) {
    console.error('Failed to confirm transaction:', error);
    throw error;
  }
}

export default {
  fetchAvailableTokens,
  connectWallet,
  signTransaction,
  submitTransaction,
  createListing,
  buyTokens,
  fetchUserListings,
  cancelListing,
  retryOperation,
  waitForTransactionConfirmation,
};
