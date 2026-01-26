
"use client";

/**
 * Donation Amount Selector - Preset amounts and custom input with impact calculations
 */

import React, { useState, useEffect } from "react";
import {
  calculateImpact,
  formatImpactMetrics,
  validateDonationAmount,
} from "@/lib/impact-calculator";
import { fetchXlmPrice, convertUsdToXlm } from "@/lib/stellar-utils";

interface DonationAmountSelectorProps {
  onSelect: (amount: number) => void;
  selectedAmount?: number;
}

const PRESET_AMOUNTS = [10, 25, 50, 100, 250];

export default function DonationAmountSelector({
  onSelect,
  selectedAmount = 0,
}: DonationAmountSelectorProps) {
  const [customAmount, setCustomAmount] = useState<string>("");
  const [selected, setSelected] = useState<number>(selectedAmount);
  const [error, setError] = useState<string>("");
  const [xlmPrice, setXlmPrice] = useState<number | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(true);

  // Fetch XLM price on mount
  useEffect(() => {
    fetchXlmPrice()
      .then(setXlmPrice)
      .finally(() => setLoadingPrice(false));
  }, []);

  const handlePresetClick = (amount: number) => {
    setSelected(amount);
    setCustomAmount("");
    setError("");
    onSelect(amount);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);

    const amount = parseFloat(value);
    if (value && !isNaN(amount)) {
      const validation = validateDonationAmount(amount);
      if (validation.valid) {
        setSelected(amount);
        setError("");
        onSelect(amount);
      } else {
        setError(validation.error || "");
        setSelected(0);
      }
    } else {
      setSelected(0);
      setError("");
    }
  };

  const impact = selected > 0 ? calculateImpact(selected) : null;
  const formattedImpact = impact ? formatImpactMetrics(impact) : null;
  const xlmAmount =
    selected > 0 && xlmPrice ? convertUsdToXlm(selected, xlmPrice) : null;

  return (
    <section className="space-y-6">
      {/* Preset Amounts */}
      <article>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Amount
        </label>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {PRESET_AMOUNTS.map((amount) => (
            <button
              key={amount}
              onClick={() => handlePresetClick(amount)}
              className={`py-3 px-4 rounded-lg font-semibold text-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 min-h-[44px] ${
                selected === amount && !customAmount
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              ${amount}
            </button>
          ))}
        </div>
      </article>

      {/* Custom Amount */}
      <article>
        <label
          htmlFor="custom-amount"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Or Enter Custom Amount
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
            $
          </span>
          <input
            id="custom-amount"
            type="number"
            min="5"
            max="10000"
            step="1"
            value={customAmount}
            onChange={handleCustomChange}
            placeholder="Enter amount"
            className={`w-full pl-10 pr-4 py-3 text-lg border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-500 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          />
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <p className="mt-2 text-xs text-gray-500">
          Minimum: $5 • Maximum: $10,000
        </p>
      </article>

      {/* Impact Display */}
      {selected > 0 && formattedImpact && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Your Impact
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Trees */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {formattedImpact.trees}
                </p>
                <p className="text-sm text-gray-600">Trees Planted</p>
              </div>
            </div>

            {/* CO₂ */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {formattedImpact.co2}
                </p>
                <p className="text-sm text-gray-600">kg CO₂ Offset</p>
              </div>
            </div>

            {/* CCT Tokens */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {formattedImpact.cct}
                </p>
                <p className="text-sm text-gray-600">CCT Tokens</p>
              </div>
            </div>
          </div>

          {/* XLM Conversion */}
          {xlmAmount && (
            <div className="mt-4 pt-4 border-t border-green-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Payment Amount:</span>
                <span className="font-semibold text-gray-900">
                  {xlmAmount} XLM
                  {loadingPrice && (
                    <span className="ml-1 text-gray-500">(updating...)</span>
                  )}
                </span>
              </div>
              {!loadingPrice && xlmPrice && (
                <p className="text-xs text-gray-500 text-right mt-1">
                  1 XLM ≈ ${xlmPrice.toFixed(4)} USD
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}