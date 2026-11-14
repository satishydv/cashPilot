import { MetricCardData, CashFlowBar, AIInsightItem, Transaction, TeamMember } from '../types';

export const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    role: 'Financial Analyst',
  },
  {
    id: '2',
    name: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    role: 'Operations Lead',
  },
  {
    id: '3',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    role: 'Portfolio Manager',
  },
];

export const currentUser = {
  name: 'Rahul Ornob',
  role: 'PRO USER',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
};

export const initialMetricCards: MetricCardData[] = [
  {
    id: 'available-balance',
    title: 'Available balance',
    subtitle: 'Across 4 accounts',
    amount: '₹38,176',
    changeBadge: '↓ 15%',
    changeType: 'negative', // in design shown in soft pink pill
    secondaryInfo: 'since last week',
    timeFrames: ['D', 'W', 'M'],
    activeTimeFrame: 'W',
    type: 'balance',
  },
  {
    id: 'income-month',
    title: 'Income this month',
    subtitle: '+ 8.2% vs last month',
    amount: '₹8,420',
    changeBadge: '↑ 12%',
    changeType: 'positive',
    secondaryInfo: '₹3,450 received recently',
    timeFrames: ['W', 'M'],
    activeTimeFrame: 'W',
    type: 'income',
  },
  {
    id: 'spent-month',
    title: 'Spent this month',
    subtitle: 'Single liner description',
    amount: '₹5,230',
    changeBadge: '↓ 7.1%',
    changeType: 'negative',
    secondaryInfo: '68% of monthly budget used',
    timeFrames: ['D', 'W', 'M'],
    activeTimeFrame: 'M',
    type: 'spent',
  },
  {
    id: 'safe-to-spend',
    title: 'Safe to spend',
    subtitle: 'Until your next payday',
    amount: '₹2,480',
    changeBadge: '↓ 2.5%',
    changeType: 'negative',
    secondaryInfo: 'Next income in 8 days',
    type: 'safe',
    avatars: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    ],
  },
];

export const initialCashFlowBars: CashFlowBar[] = [
  { id: 'b1', amount: '₹30,130', value: 30.13 },
  { id: 'b2', amount: '₹35,210', value: 35.21 },
  {
    id: 'b3',
    amount: '₹45,820',
    value: 45.82,
    isPeak: true,
    highlightLabel: 'Recieved',
  },
  { id: 'b4', amount: '₹26,782', value: 26.78 },
  { id: 'b5', amount: '₹38,420', value: 38.42 },
];

export const initialAIInsights: AIInsightItem[] = [
  {
    id: 'insight-1',
    title: 'Move credit card payment to May 28',
    description: 'Aligns with income cycle',
    amount: '₹420',
    likelihood: '82% likely',
    type: 'credit',
  },
  {
    id: 'insight-2',
    title: 'Move excess cash to savings',
    description: 'Builds your emergency fund',
    amount: '₹1,200',
    likelihood: '75% likely',
    type: 'savings',
  },
  {
    id: 'insight-3',
    title: 'Spend less on dining this week',
    description: 'Typical overspend detected',
    amount: '₹180',
    likelihood: '68% likely',
    type: 'dining',
  },
];

export const initialTransactions: Transaction[] = [
  {
    id: '1',
    transactionId: 'TXN - 7G31L9',
    merchant: 'Spotify',
    merchantLogo: 'spotify',
    merchantCategory: 'Subscription',
    dateTime: 'MAY 19, 2026, 11:07 AM',
    amount: -4.99,
    status: 'Completed',
  },
  {
    id: '2',
    transactionId: 'TXN - 7G31L9',
    merchant: 'Apple',
    merchantLogo: 'apple',
    merchantCategory: 'Digital Services',
    dateTime: 'MAY 19, 2026 9:42 AM',
    amount: -18.45,
    status: 'Completed',
  },
  {
    id: '3',
    transactionId: 'TXN - 7H84M4',
    merchant: 'Uber',
    merchantLogo: 'uber',
    merchantCategory: 'Transportation',
    dateTime: 'MAY 18, 2026 7:14 PM',
    amount: 3450.00,
    status: 'Scheduled',
  },
  {
    id: '4',
    transactionId: 'PAY - 5J19N8',
    merchant: 'Amazon Prime',
    merchantLogo: 'amazon',
    merchantCategory: 'Ecommerce',
    dateTime: 'MAY 16, 2026 9:00 AM',
    amount: -1600.00,
    status: 'Completed',
  },
  {
    id: '5',
    transactionId: 'BILL - 4K08Q2',
    merchant: 'Adidas',
    merchantLogo: 'adidas',
    merchantCategory: 'Apparel',
    dateTime: 'MAY 15, 2026 8:00 AM',
    amount: -153.99,
    status: 'Pending',
  },
  {
    id: '6',
    transactionId: 'TXN - 3L57P6',
    merchant: 'Klarna',
    merchantLogo: 'klarna',
    merchantCategory: 'Fintech BNPL',
    dateTime: 'MAY 14, 2026 2:42 PM',
    amount: -89.31,
    status: 'Pending',
  },
];
