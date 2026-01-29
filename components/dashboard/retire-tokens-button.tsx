"use client";

import React, { useState } from 'react';
import showToast from '@/components/simple-toast';

interface RetireTokensButtonProps {
  onRetire: (amount: number) => Promise<void>;
  disabled?: boolean;
}

export const RetireTokensButton: React.FC<RetireTokensButtonProps> = ({
  onRetire,
  disabled = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setError(null);

    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      setError('Please enter a valid amount greater than zero.');
      return;
    }

    setIsLoading(true);
    try {
      await onRetire(parsed);
    } catch (err) {
      console.error('Error retiring tokens:', err);
      showToast('Failed to retire tokens. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full md:w-auto">
      <div className="flex gap-3 items-center">
        <input
          type="number"
          min="0"
          step="any"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount to retire"
          className="px-4 py-2 rounded-lg border border-gray-300 text-sm w-40"
        />
        <button
          onClick={handleClick}
          disabled={
            disabled ||
            isLoading ||
            (() => {
              const parsed = parseFloat(amount);
              return isNaN(parsed) || parsed <= 0;
            })()
          }
          className="px-5 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg shadow-md hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading ? 'Processing...' : 'Retire Tokens'}
        </button>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-700">{error}</p>
      )}
    </div>
  );
};
