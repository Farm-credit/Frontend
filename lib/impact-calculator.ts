/**
 * Impact calculations for environmental donations
 */

import { conversionRates } from "./mock-data";

export interface ImpactMetrics {
  trees: number;
  co2Kg: number;
  cctTokens: number;
}

/**
 * Calculate environmental impact from donation amount
 * @param amountUsd - Donation amount in USD
 * @returns Impact metrics (trees, CO₂, CCT tokens)
 */
export function calculateImpact(amountUsd: number): ImpactMetrics {
  return {
    trees: amountUsd * conversionRates.treesPerDollar,
    co2Kg: amountUsd * conversionRates.co2PerDollar,
    cctTokens: amountUsd * conversionRates.cctPerDollar,
  };
}

/**
 * Format impact metrics for display
 */
export function formatImpactMetrics(impact: ImpactMetrics): {
  trees: string;
  co2: string;
  cct: string;
} {
  return {
    trees: impact.trees.toFixed(1),
    co2: impact.co2Kg.toFixed(1),
    cct: impact.cctTokens.toFixed(0),
  };
}

/**
 * Validate donation amount
 */
export function validateDonationAmount(amount: number): {
  valid: boolean;
  error?: string;
} {
  const MIN_DONATION = 5;
  const MAX_DONATION = 10000;

  if (isNaN(amount) || amount <= 0) {
    return { valid: false, error: "Please enter a valid amount" };
  }

  if (amount < MIN_DONATION) {
    return { valid: false, error: `Minimum donation is $${MIN_DONATION}` };
  }

  if (amount > MAX_DONATION) {
    return { valid: false, error: `Maximum donation is $${MAX_DONATION}` };
  }

  return { valid: true };
}