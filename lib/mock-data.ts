/**
 * Mock data for environmental projects and conversion rates
 */

export interface Project {
  id: string;
  name: string;
  location: string;
  description: string;
  walletAddress: string; // Stellar testnet address
  imageUrl?: string;
}

export interface ConversionRates {
  treesPerDollar: number;
  co2PerDollar: number; // kg of CO₂
  cctPerDollar: number; // Carbon Credit Tokens
  fallbackXlmPerDollar: number; // Fallback XLM exchange rate if API fails
}

/**
 * Mock environmental projects available for donation
 * Using Stellar testnet wallet addresses
 * NOTE: For testing, the destination wallet is set to the user's connected wallet.
 * In production, each project would have its own verified wallet address.
 */
export const mockProjects: Project[] = [
  {
    id: "forest-restore-001",
    name: "Amazon Rainforest Restoration",
    location: "Brazil",
    description:
      "Help restore degraded rainforest areas and protect biodiversity in the Amazon basin. Your donation plants native trees and supports local communities.",
    walletAddress: "", // Not used - destination is the user's wallet for testing
  },
  {
    id: "ocean-cleanup-002",
    name: "Ocean Plastic Cleanup Initiative",
    location: "Pacific Ocean",
    description:
      "Remove plastic waste from ocean gyres and prevent marine pollution. Funds support cleanup vessels and coastal waste management.",
    walletAddress: "", // Not used - destination is the user's wallet for testing
  },
  {
    id: "solar-village-003",
    name: "Rural Solar Energy Program",
    location: "Kenya",
    description:
      "Bring clean solar energy to off-grid villages, reducing reliance on fossil fuels and improving quality of life.",
    walletAddress: "", // Not used - destination is the user's wallet for testing
  },
];

/**
 * Conversion rates for impact calculations
 */
export const conversionRates: ConversionRates = {
  treesPerDollar: 0.5, // $1 = 0.5 trees planted
  co2PerDollar: 2.5, // $1 = 2.5 kg CO₂ offset
  cctPerDollar: 1, // $1 = 1 CCT token
  fallbackXlmPerDollar: 10, // Fallback: 1 USD = 10 XLM (testnet mock rate)
};

/**
 * Get a project by ID
 */
export function getProjectById(projectId: string): Project | undefined {
  return mockProjects.find((project) => project.id === projectId);
}

/**
 * Get default project (first in list)
 */
export function getDefaultProject(): Project {
  return mockProjects[0];
}