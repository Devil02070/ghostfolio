import fs from "fs";
import path from "path";

const STORE_DIR = path.join(process.cwd(), ".ghostfolio-data");
const SETTINGS_FILE = path.join(STORE_DIR, "decoy-settings.json");
const DECOY_HISTORY_FILE = path.join(STORE_DIR, "decoy-history.json");
const PRIVACY_HISTORY_FILE = path.join(STORE_DIR, "privacy-history.json");
const SURVEILLANCE_FILE = path.join(STORE_DIR, "surveillance.json");

function ensureDir() {
  if (!fs.existsSync(STORE_DIR)) fs.mkdirSync(STORE_DIR, { recursive: true });
}

function readJSON<T>(file: string, fallback: T): T {
  try {
    ensureDir();
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJSON(file: string, data: unknown) {
  ensureDir();
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ── Decoy Settings ──

export interface DecoySettings {
  enabled: boolean;
  dailyBudget: number;
  maxSwapSize: number;
  frequency: "conservative" | "moderate" | "aggressive";
  blacklistedTokens: string[];
}

const DEFAULT_SETTINGS: DecoySettings = {
  enabled: false,
  dailyBudget: 5.0,
  maxSwapSize: 20,
  frequency: "moderate",
  blacklistedTokens: [],
};

export function getDecoySettings(): DecoySettings {
  return readJSON(SETTINGS_FILE, DEFAULT_SETTINGS);
}

export function updateDecoySettings(updates: Partial<DecoySettings>): DecoySettings {
  const current = getDecoySettings();
  const merged = { ...current, ...updates };
  writeJSON(SETTINGS_FILE, merged);
  return merged;
}

// ── Decoy History ──

export interface DecoySwapRecord {
  id: string;
  timestamp: string;
  fromToken: string;
  fromTokenAddress: string;
  toToken: string;
  toTokenAddress: string;
  amount: string;
  amountUsd: number;
  gasCost: number;
  status: "completed" | "pending" | "simulated" | "failed";
  txHash?: string;
  chain: string;
  route?: string;
  error?: string;
}

export function getDecoyHistory(): DecoySwapRecord[] {
  return readJSON(DECOY_HISTORY_FILE, []);
}

export function addDecoyRecord(record: DecoySwapRecord) {
  const history = getDecoyHistory();
  history.unshift(record);
  // Keep last 200 records
  writeJSON(DECOY_HISTORY_FILE, history.slice(0, 200));
}

export function updateDecoyRecord(id: string, updates: Partial<DecoySwapRecord>) {
  const history = getDecoyHistory();
  const idx = history.findIndex((r) => r.id === id);
  if (idx >= 0) {
    history[idx] = { ...history[idx], ...updates };
    writeJSON(DECOY_HISTORY_FILE, history);
  }
}

// ── Privacy Score History ──

export interface PrivacySnapshot {
  date: string;
  score: number;
  cost: number;
  watchers: number;
  tokensTracked: number;
}

export function getPrivacyHistory(): PrivacySnapshot[] {
  return readJSON(PRIVACY_HISTORY_FILE, []);
}

export function addPrivacySnapshot(snapshot: PrivacySnapshot) {
  const history = getPrivacyHistory();
  // One entry per date
  const existing = history.findIndex((h) => h.date === snapshot.date);
  if (existing >= 0) {
    history[existing] = snapshot;
  } else {
    history.push(snapshot);
  }
  writeJSON(PRIVACY_HISTORY_FILE, history.slice(-30)); // Keep 30 days
}

// ── Surveillance Cache ──

export interface SurveillanceData {
  lastScanned: string;
  threatLevel: string;
  exposureScore: number;
  watchers: Array<{
    address: string;
    label: string;
    type: string;
    similarity: number;
    lastActivity: string;
    firstSeen: string;
  }>;
  timeline: Array<{
    time: string;
    event: string;
    type: string;
    severity: string;
  }>;
}

export function getSurveillanceData(): SurveillanceData | null {
  return readJSON(SURVEILLANCE_FILE, null);
}

export function saveSurveillanceData(data: SurveillanceData) {
  writeJSON(SURVEILLANCE_FILE, data);
}
