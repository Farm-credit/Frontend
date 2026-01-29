import type { Transaction } from '@/lib/stellar';

export interface MonthlyDataPoint {
  month: string;
  contributions: number;
  co2Offset: number;
}

export interface DashboardData {
  tokenBalance: string;
  co2Offset: string;
  treesFunded: number;
  transactions: Transaction[];
  monthlyData: MonthlyDataPoint[];
}

export default DashboardData;
