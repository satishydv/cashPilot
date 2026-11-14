export type TimeFrame = 'D' | 'W' | 'M';

export interface MetricCardData {
  id: string;
  title: string;
  subtitle: string;
  amount: string;
  changeBadge: string;
  changeType: 'positive' | 'negative' | 'neutral';
  secondaryInfo: string;
  timeFrames?: TimeFrame[];
  activeTimeFrame?: TimeFrame;
  type: 'balance' | 'income' | 'spent' | 'safe';
  avatars?: string[];
}

export interface CashFlowBar {
  id: string;
  amount: string;
  value: number; // in thousands (0 - 50)
  isPeak?: boolean;
  label?: string;
  highlightLabel?: string;
}

export interface AIInsightItem {
  id: string;
  title: string;
  description: string;
  amount: string;
  likelihood: string;
  type: 'credit' | 'savings' | 'dining';
}

export interface Transaction {
  id: string;
  transactionId: string;
  merchant: string;
  merchantLogo: string;
  merchantCategory: string;
  dateTime: string;
  amount: number;
  status: 'Completed' | 'Scheduled' | 'Pending';
}

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
}
