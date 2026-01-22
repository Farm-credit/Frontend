
import React from 'react';

declare global {
  interface Window {
    freighter?: {
      isAllowed: () => Promise<{ isAllowed: boolean }>;
      getPublicKey: () => Promise<string>;
      signTransaction: (xdr: string, passphrase: string) => Promise<string>;
    };
  }
}


export async function fetchAvailableTokens(cctAssetCode: string) {
  try {
    const Stellar = require('@stellar/js-sdk');
    const server = new Stellar.Server('https://horizon-testnet.stellar.org');

    const offers = await server
      .offers()
      .selling(
        new Stellar.Asset(
          cctAssetCode,
          'GBUQWP3BOUZX34ULNQG23RQ6F4YUSXHTIQRXE3YLTZ3A3ZIUCHSCYRJI'
        )
      )
      .call();

    const tokens = offers.records.map((offer: any) => ({
      id: offer.id.toString(),
      sellerAddress: offer.seller,
      amount: parseFloat(offer.amount),
      pricePerToken: parseFloat(offer.price),
      currency: 'XLM',
      totalPrice: parseFloat(offer.amount) * parseFloat(offer.price),
    }));

    return tokens;
  } catch (error) {
    console.error('Failed to fetch tokens:', error);
    return [];
  }
}


export async function connectWallet() {
  try {
    if (!window.freighter) {
      console.error('Freighter not installed');
      return null;
    }

    const { isAllowed } = await window.freighter.isAllowed();
    if (!isAllowed) {
      console.error('Freighter not allowed');
      return null;
    }

    const publicKey = await window.freighter.getPublicKey();
    return publicKey;
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    return null;
  }
}


export function useWallet() {
  const [publicKey, setPublicKey] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const init = async () => {
      const key = await connectWallet();
      setPublicKey(key);
      setLoading(false);
    };
    init();
  }, []);

  return { publicKey, loading };
}


export async function signTransaction(transactionXDR: string) {
  try {
    if (!window.freighter) {
      throw new Error('Freighter not available');
    }

    const signedXDR = await window.freighter.signTransaction(
      transactionXDR,
      'TESTNET_NETWORK_PASSPHRASE'
    );
    return signedXDR;
  } catch (error) {
    console.error('Failed to sign transaction:', error);
    return null;
  }
}

export async function submitTransaction(signedXDR: string) {
  try {
    const Stellar = require('@stellar/js-sdk');
    const server = new Stellar.Server('https://horizon-testnet.stellar.org');

    const transactionToSubmit = new Stellar.Transaction(
      signedXDR,
      'TESTNET_NETWORK_PASSPHRASE'
    );

    const result = await server.submitTransaction(transactionToSubmit);
    return result;
  } catch (error) {
    console.error('Failed to submit transaction:', error);
    return null;
  }
}


export async function createListing(
  sellerPublicKey: string,
  amount: number,
  pricePerToken: number,
  currency: 'XLM' | 'USDC'
) {
  try {
    const Stellar = require('@stellar/js-sdk');
    const server = new Stellar.Server('https://horizon-testnet.stellar.org');

    const account = await server.loadAccount(sellerPublicKey);

    const cct = new Stellar.Asset(
      'CCT',
      'GBUQWP3BOUZX34ULNQG23RQ6F4YUSXHTIQRXE3YLTZ3A3ZIUCHSCYRJI'
    );

    const paymentAsset =
      currency === 'XLM' ? Stellar.Asset.native() : new Stellar.Asset('USDC', 'GAB...');

    const transaction = new Stellar.TransactionBuilder(account, {
      fee: Stellar.BASE_FEE,
      networkPassphrase: 'Test SDF Network ; September 2015',
    })
      .addOperation(
        Stellar.Operation.manageSellOffer({
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
    const Stellar = require('@stellar/js-sdk');
    const server = new Stellar.Server('https://horizon-testnet.stellar.org');

    const account = await server.loadAccount(buyerPublicKey);

    const cct = new Stellar.Asset(
      'CCT',
      'GBUQWP3BOUZX34ULNQG23RQ6F4YUSXHTIQRXE3YLTZ3A3ZIUCHSCYRJI'
    );

    const paymentAsset =
      currency === 'XLM' ? Stellar.Asset.native() : new Stellar.Asset('USDC', 'GAB...');

    const transaction = new Stellar.TransactionBuilder(account, {
      fee: Stellar.BASE_FEE,
      networkPassphrase: 'Test SDF Network ; September 2015',
    })
      .addOperation(
        Stellar.Operation.manageBuyOffer({
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
    const Stellar = require('@stellar/js-sdk');
    const server = new Stellar.Server('https://horizon-testnet.stellar.org');

    const offers = await server.offers().forSeller(sellerPublicKey).call();

    const listings = offers.records
      .filter((offer: any) => {
        return (
          offer.selling.asset_code === 'CCT' &&
          offer.selling.asset_issuer === 'GBUQWP3BOUZX34ULNQG23RQ6F4YUSXHTIQRXE3YLTZ3A3ZIUCHSCYRJI'
        );
      })
      .map((offer: any) => ({
        id: offer.id.toString(),
        amount: parseFloat(offer.amount),
        pricePerToken: parseFloat(offer.price),
        currency: offer.buying.asset_code === 'XLM' ? 'XLM' : 'USDC',
        status: 'active' as const,
        listedAt: new Date(offer.created_at),
      }));

    return listings;
  } catch (error) {
    console.error('Failed to fetch user listings:', error);
    return [];
  }
}


export async function cancelListing(sellerPublicKey: string, offerId: string) {
  try {
    const Stellar = require('@stellar/js-sdk');
    const server = new Stellar.Server('https://horizon-testnet.stellar.org');

    const account = await server.loadAccount(sellerPublicKey);

    const cct = new Stellar.Asset(
      'CCT',
      'GBUQWP3BOUZX34ULNQG23RQ6F4YUSXHTIQRXE3YLTZ3A3ZIUCHSCYRJI'
    );

    const xlm = Stellar.Asset.native();

    const transaction = new Stellar.TransactionBuilder(account, {
      fee: Stellar.BASE_FEE,
      networkPassphrase: 'Test SDF Network ; September 2015',
    })
      .addOperation(
        Stellar.Operation.manageSellOffer({
          selling: cct,
          buying: xlm,
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
    const Stellar = require('@stellar/js-sdk');
    const server = new Stellar.Server('https://horizon-testnet.stellar.org');

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
