// Mock data for dashboard - will be replaced with real OKX skill calls

export interface Token {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  price: number;
  change24h: number;
  allocation: number;
  icon: string;
}

export interface DeFiPosition {
  protocol: string;
  type: "lending" | "staking" | "liquidity";
  token: string;
  amount: number;
  value: number;
  apy: number;
}

export interface Watcher {
  address: string;
  label: string;
  type: "whale" | "kol" | "bot" | "tracker";
  firstSeen: string;
  lastActivity: string;
  similarity: number;
}

export interface DecoySwap {
  id: string;
  timestamp: string;
  fromToken: string;
  toToken: string;
  amount: number;
  gasCost: number;
  status: "completed" | "pending" | "simulated" | "failed";
  txHash?: string;
}

export interface DecoySettings {
  enabled: boolean;
  dailyBudget: number;
  maxSwapSize: number;
  frequency: "conservative" | "moderate" | "aggressive";
  blacklistedTokens: string[];
}

export const mockPortfolio: Token[] = [
  { symbol: "ETH", name: "Ethereum", balance: 2.45, value: 7840, price: 3200, change24h: 2.4, allocation: 60, icon: "E" },
  { symbol: "USDC", name: "USD Coin", balance: 3267, value: 3267, price: 1.0, change24h: 0.01, allocation: 25, icon: "U" },
  { symbol: "ARB", name: "Arbitrum", balance: 1580, value: 1959, price: 1.24, change24h: -1.2, allocation: 15, icon: "A" },
];

export const mockDeFiPositions: DeFiPosition[] = [
  { protocol: "Aave V3", type: "lending", token: "USDC", amount: 2000, value: 2000, apy: 4.2 },
  { protocol: "Lido", type: "staking", token: "stETH", amount: 0.5, value: 1600, apy: 3.8 },
  { protocol: "Uniswap V3", type: "liquidity", token: "ETH/USDC", amount: 1, value: 3200, apy: 12.5 },
];

export const mockObserverView: Token[] = [
  { symbol: "ETH", name: "Ethereum", balance: 1.2, value: 3840, price: 3200, change24h: 2.4, allocation: 35, icon: "E" },
  { symbol: "LINK", name: "Chainlink", balance: 152, value: 2280, price: 15.0, change24h: 3.1, allocation: 22, icon: "L" },
  { symbol: "WBTC", name: "Wrapped Bitcoin", balance: 0.028, value: 1890, price: 67500, change24h: 1.8, allocation: 18, icon: "W" },
  { symbol: "MATIC", name: "Polygon", balance: 1650, value: 1237, price: 0.75, change24h: -0.5, allocation: 12, icon: "M" },
  { symbol: "USDC", name: "USD Coin", balance: 845, value: 845, price: 1.0, change24h: 0.01, allocation: 8, icon: "U" },
  { symbol: "MISC", name: "Various", balance: 0, value: 520, price: 0, change24h: 0, allocation: 5, icon: "?" },
];

export const mockWatchers: Watcher[] = [
  { address: "0x3f8c...a2d1", label: "Whale Alpha Fund", type: "whale", firstSeen: "2025-03-28", lastActivity: "2 hours ago", similarity: 78 },
  { address: "0x91b2...f4e8", label: "CryptoKOL_Max", type: "kol", firstSeen: "2025-04-01", lastActivity: "45 min ago", similarity: 65 },
  { address: "0x5de7...c390", label: "MEV Bot #4421", type: "bot", firstSeen: "2025-04-05", lastActivity: "12 min ago", similarity: 92 },
  { address: "0xa1f3...b7d2", label: "Nansen Tracker", type: "tracker", firstSeen: "2025-03-15", lastActivity: "1 hour ago", similarity: 45 },
  { address: "0x82c4...d9e5", label: "Copy Trader Pro", type: "bot", firstSeen: "2025-04-10", lastActivity: "5 min ago", similarity: 88 },
];

export const mockDecoyHistory: DecoySwap[] = [
  { id: "d1", timestamp: "2025-04-13T10:32:00Z", fromToken: "ETH", toToken: "LINK", amount: 12.5, gasCost: 0.42, status: "completed", txHash: "0xabc...123" },
  { id: "d2", timestamp: "2025-04-13T09:15:00Z", fromToken: "USDC", toToken: "WBTC", amount: 8.3, gasCost: 0.38, status: "completed", txHash: "0xdef...456" },
  { id: "d3", timestamp: "2025-04-13T07:45:00Z", fromToken: "ARB", toToken: "MATIC", amount: 5.7, gasCost: 0.31, status: "completed", txHash: "0xghi...789" },
  { id: "d4", timestamp: "2025-04-12T22:10:00Z", fromToken: "ETH", toToken: "UNI", amount: 15.2, gasCost: 0.45, status: "completed", txHash: "0xjkl...012" },
  { id: "d5", timestamp: "2025-04-12T18:30:00Z", fromToken: "USDC", toToken: "AAVE", amount: 9.8, gasCost: 0.35, status: "completed", txHash: "0xmno...345" },
  { id: "d6", timestamp: "2025-04-12T14:05:00Z", fromToken: "ETH", toToken: "CRV", amount: 7.1, gasCost: 0.29, status: "completed", txHash: "0xpqr...678" },
  { id: "d7", timestamp: "2025-04-13T11:00:00Z", fromToken: "ARB", toToken: "SNX", amount: 11.0, gasCost: 0.40, status: "simulated" },
  { id: "d8", timestamp: "2025-04-13T11:00:00Z", fromToken: "USDC", toToken: "COMP", amount: 6.5, gasCost: 0.33, status: "pending" },
];

export const mockDecoySettings: DecoySettings = {
  enabled: true,
  dailyBudget: 5.0,
  maxSwapSize: 20,
  frequency: "moderate",
  blacklistedTokens: ["DOGE", "SHIB", "PEPE"],
};

export const mockPrivacyHistory = [
  { date: "Apr 7", score: 23, cost: 0 },
  { date: "Apr 8", score: 31, cost: 1.2 },
  { date: "Apr 9", score: 45, cost: 2.8 },
  { date: "Apr 10", score: 58, cost: 4.1 },
  { date: "Apr 11", score: 67, cost: 5.5 },
  { date: "Apr 12", score: 79, cost: 7.2 },
  { date: "Apr 13", score: 87, cost: 8.9 },
];

export const mockSurveillanceHistory = [
  { date: "Apr 7", watchers: 1, threatLevel: 20 },
  { date: "Apr 8", watchers: 1, threatLevel: 25 },
  { date: "Apr 9", watchers: 2, threatLevel: 40 },
  { date: "Apr 10", watchers: 3, threatLevel: 55 },
  { date: "Apr 11", watchers: 4, threatLevel: 65 },
  { date: "Apr 12", watchers: 5, threatLevel: 72 },
  { date: "Apr 13", watchers: 5, threatLevel: 68 },
];
