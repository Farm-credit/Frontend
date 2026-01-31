'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  fetchAvailableTokens,
  fetchUserListings,
  createListing,
  buyTokens,
  cancelListing,
  retryOperation,
} from '@/lib/stellar-integration';
import { toast, ToastContainer } from '@/components/toast';
import { useWallet } from '@/hooks/useWallet';
import {
  TokenCard,
  ListTokensForm,
  BuyModal,
  UserListingCard,
  EmptyState,
  SectionHeader,
  WalletModal,
} from '@/components/marketplace-components';

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
  const { publicKey, loading: walletLoading, error: walletError, connect, disconnect } = useWallet();

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
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  const handleConnectWallet = async () => {
    setShowWalletModal(true);
  };

  const handleWalletModalConnect = async () => {
    try {
      const key = await connect();
      if (key) {
        setShowWalletModal(false);
      }
    } catch (err) {
      console.error('Wallet connection failed:', err);
      // Keep modal open or show diagnostics
      setShowDiagnostics(true);
    }
  };

  const handleDisconnectWallet = async () => {
    await disconnect();
  };

  const loadMarketplaceData = useCallback(async () => {
    setLoadingTokens(true);
    try {
      const tokens = await retryOperation(() => fetchAvailableTokens('CCT'));
      setTokensForSale(tokens);
    } catch (error) {
      console.error('Failed to load marketplace data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes('CCT_ISSUER')) {
        toast.error('The Marketplace is currently misconfigured with an invalid Issuer address. Please contact support.');
      } else {
        toast.warning(`Could not load tokens from Stellar testnet: ${errorMessage}`);
      }
      
      setTokensForSale([]);
    } finally {
      setLoadingTokens(false);
    }
  }, []);

  const loadUserListings = useCallback(async () => {
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
  }, [publicKey]);

  useEffect(() => {
    loadMarketplaceData();
  }, [loadMarketplaceData]);

  useEffect(() => {
    if (publicKey) {
      loadUserListings();
    }
  }, [publicKey, loadUserListings]);

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
      <section className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-8 sm:py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 mb-6">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 leading-tight">
                Carbon Credit <span className="text-orange-400">Marketplace</span>
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-gray-300 max-w-2xl mb-6">
                Buy and sell Carbon Credit Tokens (CCT) directly with other users. Set your own prices and control your portfolio.
              </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-4 sm:p-6 text-center lg:text-right w-full lg:w-auto lg:min-w-[240px] shadow-2xl">
              {publicKey ? (
                <div className="flex flex-col items-center lg:items-end">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-lime-500 shadow-[0_0_10px_rgba(132,204,22,0.5)]"></span>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Connected Wallet</p>
                  </div>
                  <p className="font-mono text-xs sm:text-sm text-lime-400 bg-black/40 px-3 py-1.5 rounded-lg border border-lime-500/20 mb-3 break-all">{truncateAddress(publicKey)}</p>
                  <button 
                    onClick={handleDisconnectWallet}
                    className="text-[10px] text-red-400 hover:text-red-300 font-bold uppercase tracking-tighter transition-colors flex items-center gap-1 group"
                  >
                    <span>Disconnect Wallet</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-center lg:justify-between mb-3">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Account Access</p>
                    <span className="w-2 h-2 rounded-full bg-orange-500/50 ml-2 lg:ml-0"></span>
                  </div>
                  <p className="text-sm text-orange-400 mb-4 font-semibold">Ready to connect</p>
                  {walletError && (
                    <div className="text-[10px] text-red-200 mb-4 whitespace-pre-line bg-red-900/40 p-2.5 rounded-xl border border-red-800/50 leading-relaxed text-left">
                      {walletError}
                    </div>
                  )}
                  <button
                    onClick={handleConnectWallet}
                    disabled={walletLoading}
                    className="w-full px-4 sm:px-5 py-3 bg-gradient-to-br from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 disabled:from-gray-700 disabled:to-gray-800 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-xl shadow-orange-950/20 transition-all active:scale-95 mb-3"
                  >
                    {walletLoading ? 'Processing...' : 'Connect Wallet'}
                  </button>
                  <button 
                    onClick={() => setShowDiagnostics(!showDiagnostics)}
                    className="text-[10px] text-gray-500 hover:text-gray-300 transition-colors uppercase tracking-tighter"
                  >
                    {showDiagnostics ? '[-] Hide System Info' : '[+] System Diagnostics'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {showDiagnostics && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
          <div className="bg-blue-900/10 border border-blue-200 rounded-xl p-4 sm:p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16"></div>
            <h3 className="text-base sm:text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white">i</span>
              Wallet Diagnostics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
              <div className="bg-white/50 p-3 rounded border border-blue-100">
                <p className="text-blue-700 mb-1">Protocol</p>
                <p className="text-blue-900 font-bold break-all">{typeof window !== 'undefined' ? window.location.protocol : 'N/A'}</p>
              </div>
              <div className="bg-white/50 p-3 rounded border border-blue-100">
                <p className="text-blue-700 mb-1">Injection Status</p>
                <p className={window.freighter ? "text-green-600" : "text-orange-600"}>
                  window.freighter: {window.freighter ? 'Y' : 'N'}
                </p>
                <p className={window.freighterApi ? "text-green-600" : "text-orange-600"}>
                  window.freighterApi: {window.freighterApi ? 'Y' : 'N'}
                </p>
              </div>
              <div className="bg-white/50 p-3 rounded border border-blue-100 col-span-1 sm:col-span-2">
                <p className="text-blue-700 mb-1">Browser Info</p>
                <p className="text-blue-900 break-all text-[10px] sm:text-xs">{typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'}</p>
              </div>
            </div>
            <p className="mt-4 text-[10px] sm:text-xs text-blue-800 leading-relaxed">
              Note: The Freighter extension must be unlocked and set to the <strong>Testnet</strong> network. If you still don&apos;t see it, ensure &quot;Allow access to file URLs&quot; is enabled in browser extension settings (if applicable) and that no privacy shields (like Brave&apos;s) are blocking the injection.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="mb-8 lg:mb-12">
              <SectionHeader title="Available Tokens" />
              
              {loadingTokens ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 text-sm sm:text-base">Loading tokens from Stellar testnet...</p>
                </div>
              ) : tokensForSale.length === 0 ? (
                <div className="text-center py-8 border border-gray-200 rounded-lg">
                  <EmptyState message="No tokens available for sale right now." />
                  <p className="text-sm text-gray-500 mt-2">Be the first to list your tokens!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tokensForSale.map((token) => (
                    <TokenCard
                      key={token.id}
                      sellerAddress={token.sellerAddress}
                      amount={token.amount}
                      pricePerToken={token.pricePerToken}
                      currency={token.currency}
                      totalPrice={token.totalPrice}
                      onBuy={() => handleBuyClick(token)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-gradient-to-br from-lime-50 to-green-50 border border-lime-200 rounded-lg p-4 sm:p-6 mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-black mb-4">List Your Tokens</h3>
              <p className="text-sm text-gray-600 mb-6">
                Set your price and list your Carbon Credit Tokens to the marketplace.
              </p>
              
              <button
                onClick={() => setShowListForm(!showListForm)}
                className="w-full px-4 sm:px-6 py-3 bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 text-white font-bold rounded-lg transition-all duration-200 text-sm sm:text-base"
              >
                {showListForm ? 'Cancel' : 'List My Tokens'}
              </button>

              {showListForm && (
                <ListTokensForm
                  amount={listAmount}
                  price={listPrice}
                  currency={listCurrency}
                  onAmountChange={setListAmount}
                  onPriceChange={setListPrice}
                  onCurrencyChange={setListCurrency}
                  onSubmit={handleListTokens}
                  onCancel={() => setShowListForm(false)}
                  isSubmitting={submittingList}
                />
              )}
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-black mb-4">My Listings</h3>
              
              {!publicKey ? (
                <EmptyState message="Connect your wallet to see your listings." />
              ) : loadingListings ? (
                <EmptyState message="Loading your listings..." />
              ) : userListings.length === 0 ? (
                <EmptyState message="You haven't listed any tokens yet." />
              ) : (
                <div className="space-y-3">
                  {userListings.map((listing) => (
                    <UserListingCard
                      key={listing.id}
                      amount={listing.amount}
                      pricePerToken={listing.pricePerToken}
                      currency={listing.currency}
                      status={listing.status}
                      listedAt={listing.listedAt}
                      onCancel={() => handleCancelListing(listing)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showBuyModal && selectedToken && (
        <BuyModal
          sellerAddress={selectedToken.sellerAddress}
          availableAmount={selectedToken.amount}
          pricePerToken={selectedToken.pricePerToken}
          currency={selectedToken.currency}
          buyAmount={buyAmount}
          onAmountChange={setBuyAmount}
          onConfirm={handleConfirmBuy}
          onCancel={() => setShowBuyModal(false)}
          isSubmitting={submittingBuy}
        />
      )}

      <WalletModal 
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onConnect={handleWalletModalConnect}
        isLoading={walletLoading}
      />

      <ToastContainer />
    </div>
  );
}
