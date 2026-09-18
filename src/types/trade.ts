export type TransactionType = 'Purchase' | 'Sale';
export type InsiderRole = 'CEO' | 'CFO' | 'Director' | 'Officer';
export type SignalStrength = 'High' | 'Medium' | 'Low';

export interface InsiderTrade {
  id: string;
  ticker: string;
  company: string;
  sector: string;
  insider: string;
  role: InsiderRole;
  type: TransactionType;
  transactionCode: string;
  shares: number;
  pricePerShare: number;
  value: number;
  transactionDate: string;
  filedAt: string;
  signal: string;
  signalStrength: SignalStrength;
}