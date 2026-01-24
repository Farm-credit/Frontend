'use client';

import React, { useState, useEffect } from 'react';
import {
  fetchAvailableTokens,
  fetchUserListings,
  createListing,
  buyTokens,
  cancelListing,
  connectWallet,
  retryOperation,
} from '@/lib/stellar-integration';
import { toast, ToastContainer } from '@/components/toast';

interface Token {
  id: string;
  sellerAddress: string;
  amount: number;
  pricePerToken: number;
  currency: 'XLM' | 'USDC';
  totalPrice: number;
}

interface UserListing {
  id: string;
  amount: number;
  pricePerToken: number;
  currency: 'XLM' | 'USDC';
  status: 'active' | 'completed';
  listedAt: Date;
}

export default function MarketplacePage() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [walletConnecting, setWalletConnecting] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);

  const [loadingTokens, setLoadingTokens] = useState(true);
  const [loadingListings, setLoadingListings] = useState(false);
  const [submittingList, setSubmittingList] = useState(false);
  const [submittingBuy, setSubmittingBuy] = useState(false);

  const [tokensForSale, setTokensForSale] = useState<Token[]>([]);
  const [userListings, setUserListings] = useState<UserListing[]>([]);

  const [showListForm, setShowListForm] = useState(false);
  const [listAmount, setListAmount] = useState('');
  const [listPrice, setListPrice] = useState('');
  const [listCurrency, setListCurrency] = useState<'XLM' | 'USDC'>('XLM');
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [buyAmount, setBuyAmount] = useState('');

  useEffect(() => {
    const initializeWallet = async () => {
      // Small delay to ensure Freighter is injected
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      try {
        const key = await connectWallet();
        if (key) {
          setPublicKey(key);
          setWalletError(null);
        } else {
          // Don't set error immediately - user might need to click connect
          if (typeof window !== 'undefined' && !window.freighter) {
            setWalletError('Freighter wallet not detected. Please install it to use the marketplace.');
          }
        }
      } catch (error) {
        setWalletError('Failed to connect wallet: ' + (error as Error).message);
      }
    };

    initializeWallet();
  }, []);

  const handleConnectWallet = async () => {
    setWalletConnecting(true);
    setWalletError(null);
    
    // First, check if Freighter is available
    if (typeof window === 'undefined') {
      setWalletError('Browser environment not detected');
      setWalletConnecting(false);
      return;
    }

    // Log diagnostic info
    console.log('Freighter detection:', {
      windowFreighter: !!window.freighter,
      userAgent: navigator.userAgent,
    });

    try {
      const key = await connectWallet();
      if (key) {
        setPublicKey(key);
        toast.success('Wallet connected successfully!');
      } else {
        // More detailed error messages
        if (!window.freighter) {
          setWalletError(
            'Freighter extension not detected. Please:\n' +
            '1. Install Freighter from freighter.app\n' +
            '2. Enable the extension in your browser\n' +
            '3. Refresh this page'
          );
          toast.error('Freighter wallet not found. Please install the extension.');
        } else {
          setWalletError('Failed to connect. Please:\n1. Open Freighter and unlock it\n2. Make sure Testnet is selected\n3. Try again');
          toast.error('Failed to connect. Make sure Freighter is unlocked and on Testnet.');
        }
      }
    } catch (error) {
      const errorMsg = (error as Error).message;
      console.error('Connection error:', error);
      setWalletError('Failed to connect wallet: ' + errorMsg);
      toast.error('Failed to connect wallet: ' + errorMsg);
    } finally {
      setWalletConnecting(false);
    }
  };

  useEffect(() => {
    loadMarketplaceData();
  }, []);

  useEffect(() => {
    if (publicKey) {
      loadUserListings();
    }
  }, [publicKey]);

  const loadMarketplaceData = async () => {
    setLoadingTokens(true);
    try {
      const tokens = await retryOperation(() => fetchAvailableTokens('CCT'));
      setTokensForSale(tokens);
    } catch (error) {
      console.error('Failed to load marketplace data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.warning(`Could not load tokens from Stellar testnet: ${errorMessage}`);
      // Set empty array on error so UI shows empty state instead of blocking
      setTokensForSale([]);
    } finally {
      setLoadingTokens(false);
    }
  };

  const loadUserListings = async () => {
    if (!publicKey) return;

    setLoadingListings(true);
    try {
      const listings = await retryOperation(() => fetchUserListings(publicKey));
      setUserListings(listings);
    } catch (error) {
      console.error('Failed to load user listings:', error);
    } finally {
      setLoadingListings(false);
    }
  };

  const handleListTokens = async () => {
    if (!publicKey) {
      toast.warning('Please connect your wallet first');
      return;
    }

    if (!listAmount || !listPrice) {
      toast.warning('Please fill in all fields');
      return;
    }

    const amount = parseFloat(listAmount);
    const price = parseFloat(listPrice);

    if (amount <= 0 || price <= 0) {
      toast.warning('Amount and price must be greater than 0');
      return;
    }

    setSubmittingList(true);
    try {
      const result = await retryOperation(() =>
        createListing(publicKey, amount, price, listCurrency)
      );

      if (result) {
        toast.success(`Listing created successfully! Transaction: ${result.hash}`);
        setListAmount('');
        setListPrice('');
        setShowListForm(false);
        await loadUserListings();
        await loadMarketplaceData();
      } else {
        toast.error('Failed to create listing. Please try again.');
      }
    } catch (error) {
      toast.error('Error creating listing: ' + (error as Error).message);
    } finally {
      setSubmittingList(false);
    }
  };

  const handleBuyClick = (token: Token) => {
    if (!publicKey) {
      toast.warning('Please connect your wallet first');
      return;
    }
    setSelectedToken(token);
    setBuyAmount('');
    setShowBuyModal(true);
  };

  const handleConfirmBuy = async () => {
    if (!publicKey || !selectedToken) {
      toast.warning('Please enter an amount');
      return;
    }

    const amount = parseFloat(buyAmount);
    if (!amount || amount <= 0) {
      toast.warning('Please enter a valid amount');
      return;
    }

    if (amount > selectedToken.amount) {
      toast.warning('Amount exceeds available tokens');
      return;
    }

    setSubmittingBuy(true);
    try {
      const result = await retryOperation(() =>
        buyTokens(publicKey, amount, selectedToken.pricePerToken, selectedToken.currency)
      );

      if (result) {
        toast.success(`Purchase successful! Transaction: ${result.hash}, Amount: ${amount} CCT`);
        setShowBuyModal(false);
        setBuyAmount('');
        await loadMarketplaceData();
      } else {
        toast.error('Failed to complete purchase. Please try again.');
      }
    } catch (error) {
      toast.error('Error during purchase: ' + (error as Error).message);
    } finally {
      setSubmittingBuy(false);
    }
  };

  const handleCancelListing = async (listing: UserListing) => {
    if (!publicKey) {
      toast.warning('Please connect your wallet first');
      return;
    }

    if (!window.confirm('Are you sure you want to cancel this listing?')) {
      return;
    }

    try {
      const result = await retryOperation(() => cancelListing(publicKey, listing.id, listing.currency));
      if (result) {
        toast.success(`Listing cancelled! Transaction: ${result.hash}`);
        await loadUserListings();
        await loadMarketplaceData();
      } else {
        toast.error('Failed to cancel listing. Please try again.');
      }
    } catch (error) {
      toast.error('Error cancelling listing: ' + (error as Error).message);
    }
  };

  const truncateAddress = (address: string) => {
    return address.slice(0, 6) + '...' + address.slice(-4);
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Carbon Credit <span className="text-orange-400">Marketplace</span>
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl">
                Buy and sell Carbon Credit Tokens (CCT) directly with other users. Set your own prices and control your portfolio.
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-right">
              {publicKey ? (
                <div>
                  <p className="text-sm text-gray-400 mb-1">Connected Wallet</p>
                  <p className="font-mono text-sm text-lime-400">{truncateAddress(publicKey)}</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-400 mb-1">Wallet Status</p>
                  <p className="text-sm text-orange-400 mb-2">Not Connected</p>
                  {walletError && (
                    <div className="text-xs text-red-400 mb-2 whitespace-pre-line bg-red-50 p-2 rounded border border-red-200">
                      {walletError}
                    </div>
                  )}
                  <button
                    onClick={handleConnectWallet}
                    disabled={walletConnecting}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white text-sm font-semibold rounded transition-colors w-full"
                  >
                    {walletConnecting ? 'Connecting...' : 'Connect Wallet'}
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    Having issues? Open browser console (F12) for details.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-black mb-8">Available Tokens</h2>
              
              {loadingTokens ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Loading tokens from Stellar testnet...</p>
                </div>
              ) : tokensForSale.length === 0 ? (
                <div className="text-center py-8 border border-gray-200 rounded-lg">
                  <p className="text-gray-600">No tokens available for sale right now.</p>
                  <p className="text-sm text-gray-500 mt-2">Be the first to list your tokens!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tokensForSale.map((token) => (
                    <div
                      key={token.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-2">Seller</p>
                        <p className="text-lg font-semibold text-black mb-4">
                          {truncateAddress(token.sellerAddress)}
                        </p>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Amount</p>
                            <p className="text-xl font-bold text-black">{token.amount}</p>
                            <p className="text-xs text-gray-500">CCT</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Price</p>
                            <p className="text-xl font-bold text-orange-500">{token.pricePerToken}</p>
                            <p className="text-xs text-gray-500">{token.currency}/token</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Total</p>
                            <p className="text-xl font-bold text-lime-600">{token.totalPrice}</p>
                            <p className="text-xs text-gray-500">{token.currency}</p>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleBuyClick(token)}
                        className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold rounded-lg transition-all duration-200"
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-lime-50 to-green-50 border border-lime-200 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-black mb-4">List Your Tokens</h3>
              <p className="text-sm text-gray-600 mb-6">
                Set your price and list your Carbon Credit Tokens to the marketplace.
              </p>
              
              <button
                onClick={() => setShowListForm(!showListForm)}
                className="w-full px-6 py-3 bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 text-white font-bold rounded-lg transition-all duration-200"
              >
                {showListForm ? 'Cancel' : 'List My Tokens'}
              </button>

              {showListForm && (
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Amount (CCT)
                    </label>
                    <input
                      type="number"
                      value={listAmount}
                      onChange={(e) => setListAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-lime-500 text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Price Per Token
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={listPrice}
                      onChange={(e) => setListPrice(e.target.value)}
                      placeholder="Enter price"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-lime-500 text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Currency
                    </label>
                    <select
                      value={listCurrency}
                      onChange={(e) => setListCurrency(e.target.value as 'XLM' | 'USDC')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-lime-500 text-black"
                    >
                      <option value="XLM">XLM</option>
                      <option value="USDC">USDC</option>
                    </select>
                  </div>

                  <button
                    onClick={handleListTokens}
                    disabled={submittingList}
                    className="w-full px-4 py-3 bg-lime-600 hover:bg-lime-700 disabled:bg-gray-400 text-white font-bold rounded-lg transition-all duration-200 mt-4"
                  >
                    {submittingList ? 'Creating listing...' : 'Confirm Listing'}
                  </button>
                </div>
              )}
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-black mb-4">My Listings</h3>
              
              {!publicKey ? (
                <p className="text-gray-600 text-sm">Connect your wallet to see your listings.</p>
              ) : loadingListings ? (
                <p className="text-gray-600 text-sm">Loading your listings...</p>
              ) : userListings.length === 0 ? (
                <p className="text-gray-600 text-sm">You haven't listed any tokens yet.</p>
              ) : (
                <div className="space-y-3">
                  {userListings.map((listing) => (
                    <div
                      key={listing.id}
                      className="bg-white border border-gray-200 rounded p-4"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-sm text-gray-600">Listing</p>
                          <p className="font-bold text-black">
                            {listing.amount} CCT @ {listing.pricePerToken} {listing.currency}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded text-xs font-semibold ${
                            listing.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {listing.status}
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-500 mb-3">
                        Listed: {listing.listedAt.toLocaleDateString()}
                      </p>

                      <button
                        onClick={() => handleCancelListing(listing)}
                        className="w-full px-3 py-2 text-sm bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded transition-colors duration-200"
                      >
                        Cancel Listing
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showBuyModal && selectedToken && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-xl">
            <h2 className="text-2xl font-bold text-black mb-6">Buy Tokens</h2>
            
            <div className="bg-gray-50 rounded p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">From Seller</p>
              <p className="font-semibold text-black mb-4">
                {truncateAddress(selectedToken.sellerAddress)}
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600">Available</p>
                  <p className="font-bold text-black">{selectedToken.amount} CCT</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Price</p>
                  <p className="font-bold text-orange-500">
                    {selectedToken.pricePerToken} {selectedToken.currency}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-black mb-2">
                Amount to Buy (CCT)
              </label>
              <input
                type="number"
                max={selectedToken.amount}
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 text-black"
              />
            </div>

            {buyAmount && (
              <div className="bg-lime-50 border border-lime-200 rounded p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">Total Cost</p>
                <p className="text-2xl font-bold text-lime-600">
                  {(parseFloat(buyAmount) * selectedToken.pricePerToken).toFixed(2)} {selectedToken.currency}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowBuyModal(false)}
                className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-black font-bold rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBuy}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold rounded-lg transition-all duration-200"
              >
                Confirm Buy
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
