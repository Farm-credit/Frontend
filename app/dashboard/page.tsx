"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getWalletState } from '@/lib/wallet';
import showToast from '@/components/simple-toast';
import { ErrorBoundary } from '@/components/error-boundary';
import {
  getCCTTokenBalance,
  getTransactionHistory,
  getTotalCO2Offset,
  getTreesFunded,
  Transaction,
} from '@/lib/stellar';
import { StatsCard } from '@/components/dashboard/stats-card';
import { TransactionTable } from '@/components/dashboard/transaction-table';
import dynamic from 'next/dynamic';
// Dynamically import ImpactCharts on the client to avoid SSR/hydration issues with Recharts
const ImpactCharts = dynamic(
  () => import('@/components/dashboard/impact-charts').then((mod) => mod.ImpactCharts),
  { ssr: false }
);
import { RetireTokensButton } from '@/components/dashboard/retire-tokens-button';
import { WalletPrompt } from '@/components/dashboard/wallet-prompt';
import type { DashboardData } from '@/types/dashboard';

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [walletConnected, setWalletConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [showWalletPrompt, setShowWalletPrompt] = useState(false);
  const [data, setData] = useState<DashboardData>({
    tokenBalance: '0',
    co2Offset: '0',
    treesFunded: 0,
    transactions: [],
    monthlyData: [],
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkWallet = async () => {
      const wallet = await getWalletState();
      if (!wallet.isConnected || !wallet.publicKey) {
        // Show wallet connection prompt
        setShowWalletPrompt(true);
        setIsLoading(false);
        return;
      }

      // Wallet is connected, load dashboard data
      setWalletConnected(true);
      setPublicKey(wallet.publicKey);
      setShowWalletPrompt(false);
      loadDashboardData(wallet.publicKey);
    };

    checkWallet();
  }, [router]);

  const loadDashboardData = async (publicKey: string) => {
    setIsLoading(true);
    try {
      const [balance, co2Offset, trees, transactions] = await Promise.all([
        getCCTTokenBalance(publicKey),
        getTotalCO2Offset(publicKey),
        getTreesFunded(publicKey),
        getTransactionHistory(publicKey),
      ]);

      // Process monthly data for charts
      const monthlyMap = new Map<string, { contributions: number; co2Offset: number }>();
      
      transactions.forEach((tx) => {
        const date = new Date(tx.date);
        const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        
        const existing = monthlyMap.get(monthKey) || { contributions: 0, co2Offset: 0 };
        
        if (tx.type === 'Donation' || tx.type === 'Retirement') {
          existing.contributions += parseFloat(tx.amount);
        }
        
        if (tx.type === 'Retirement') {
          existing.co2Offset += parseFloat(tx.co2Impact);
        }
        
        monthlyMap.set(monthKey, existing);
      });

      const monthlyData = Array.from(monthlyMap.entries())
        .map(([month, values]) => ({
          month,
          contributions: values.contributions,
          co2Offset: values.co2Offset,
        }))
        .sort((a, b) => {
          const dateA = new Date(a.month);
          const dateB = new Date(b.month);
          return dateA.getTime() - dateB.getTime();
        });

      setData({
        tokenBalance: balance,
        co2Offset,
        treesFunded: trees,
        transactions,
        monthlyData,
      });
      setError(null);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to load dashboard data. Please try refreshing the page.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetireTokens = async (amount: number) => {
    if (!publicKey) return;

    try {
      // TODO: Implement token retirement logic (placeholder)
      console.log('Retiring tokens:', amount, 'for', publicKey);
      showToast(`Retired ${amount} tokens (simulated)`, 'success');
    } catch (err) {
      console.error('Error retiring tokens:', err);
      showToast('Failed to retire tokens. Please try again.', 'error');
    }
  };

  const handleWalletConnect = (publicKey: string) => {
    setPublicKey(publicKey);
    setWalletConnected(true);
    setShowWalletPrompt(false);
    loadDashboardData(publicKey);
  };

  const handleWalletCancel = () => {
    // Redirect to home page if user cancels wallet connection
    router.push('/');
  };

  // Show wallet prompt if not connected
  if (showWalletPrompt) {
    return <WalletPrompt onConnect={handleWalletConnect} onCancel={handleWalletCancel} />;
  }

  // Show loading state while checking wallet
  if (isLoading && !walletConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If wallet is not connected and prompt is not shown, redirect
  if (!walletConnected || !publicKey) {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            View your environmental impact and token holdings
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-red-400 mt-0.5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Error loading data</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <button
                  onClick={() => publicKey && loadDashboardData(publicKey)}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="CCT Token Balance"
            value={`${parseFloat(data.tokenBalance).toLocaleString()} CCT`}
            subtitle="Available tokens"
            isLoading={isLoading}
            icon={
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
          <StatsCard
            title="Total CO₂ Offset"
            value={`${parseFloat(data.co2Offset).toLocaleString()} tons`}
            subtitle="Carbon dioxide removed"
            isLoading={isLoading}
            icon={
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
          <StatsCard
            title="Trees Funded"
            value={data.treesFunded.toLocaleString()}
            subtitle="Trees planted"
            isLoading={isLoading}
            icon={
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            }
          />
        </div>

        {/* Retire Tokens Button */}
        <div className="mb-8 flex justify-center md:justify-start">
          <RetireTokensButton
            onRetire={handleRetireTokens}
            disabled={isLoading || parseFloat(data.tokenBalance) === 0}
          />
        </div>

        {/* Charts */}
        <div className="mb-8">
          <ErrorBoundary>
            <ImpactCharts
              monthlyData={data.monthlyData}
              isLoading={isLoading}
            />
          </ErrorBoundary>
        </div>

        {/* Transaction History */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Transaction History
          </h2>
          <TransactionTable
            transactions={data.transactions}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
