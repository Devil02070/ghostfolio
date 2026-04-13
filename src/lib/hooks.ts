"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";

// ── Wallet Balance ──
export function useWalletBalance() {
  const { loggedIn } = useAuth();
  return useQuery({
    queryKey: ["wallet-balance"],
    queryFn: async () => {
      const res = await fetch("/api/wallet/balance");
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Failed");
      return json.data;
    },
    enabled: loggedIn,
    refetchInterval: 60000,
    staleTime: 10_000,
  });
}

// ── Footprint (privacy score + real vs observed) ──
export function useFootprint() {
  return useQuery({
    queryKey: ["footprint"],
    queryFn: async () => {
      const res = await fetch("/api/footprint");
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Failed");
      return json.data;
    },
    refetchInterval: 120000,
  });
}

// ── Surveillance ──
export function useSurveillance(refresh = false) {
  return useQuery({
    queryKey: ["surveillance", refresh],
    queryFn: async () => {
      const res = await fetch(`/api/surveillance${refresh ? "?refresh=true" : ""}`);
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Failed");
      return json.data;
    },
    refetchInterval: 120000,
  });
}

// ── Decoy Settings ──
export function useDecoySettings() {
  return useQuery({
    queryKey: ["decoy-settings"],
    queryFn: async () => {
      const res = await fetch("/api/decoy/settings");
      const json = await res.json();
      return json.data;
    },
  });
}

export function useUpdateDecoySettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (updates: Record<string, unknown>) => {
      const res = await fetch("/api/decoy/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      return res.json();
    },
    onSuccess: (data) => {
      qc.setQueryData(["decoy-settings"], data.data);
    },
  });
}

// ── Decoy History ──
export function useDecoyHistory() {
  return useQuery({
    queryKey: ["decoy-history"],
    queryFn: async () => {
      const res = await fetch("/api/decoy/history");
      const json = await res.json();
      return json.data;
    },
    refetchInterval: 15000,
  });
}

// ── Decoy Execute / Simulate ──
export function useDecoyAction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: { mode: "simulate" | "execute"; fromToken?: string; fromSymbol?: string; toToken?: string; toSymbol?: string; amount?: string }) => {
      const res = await fetch("/api/decoy/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["decoy-history"] });
      qc.invalidateQueries({ queryKey: ["footprint"] });
      qc.invalidateQueries({ queryKey: ["wallet-balance"] });
    },
  });
}

// ── Analytics ──
export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const res = await fetch("/api/analytics");
      const json = await res.json();
      return json.data;
    },
    refetchInterval: 60000,
  });
}

// ── Parse balance to portfolio tokens ──
interface BalToken { symbol: string; balance: string; usdValue: string; tokenPrice: string; tokenContractAddress: string }

export function parseBalanceToPortfolio(balanceData: unknown) {
  if (!balanceData || typeof balanceData !== "object") return [];
  const data = balanceData as { details?: Array<{ tokenAssets?: BalToken[] }> };
  if (!Array.isArray(data.details)) return [];

  const tokens: Array<{ symbol: string; name: string; balance: number; value: number; price: number; allocation: number; icon: string; contractAddress: string }> = [];
  let totalUsd = 0;

  for (const group of data.details) {
    if (!group.tokenAssets) continue;
    for (const t of group.tokenAssets) {
      const val = parseFloat(t.usdValue || "0");
      if (val < 0.01) continue;
      totalUsd += val;
      tokens.push({
        symbol: t.symbol || "???",
        name: t.symbol || "Unknown",
        balance: parseFloat(t.balance || "0"),
        value: val,
        price: parseFloat(t.tokenPrice || "0"),
        allocation: 0,
        icon: (t.symbol || "?").charAt(0),
        contractAddress: t.tokenContractAddress || "",
      });
    }
  }
  tokens.sort((a, b) => b.value - a.value);
  for (const t of tokens) t.allocation = totalUsd > 0 ? Math.round((t.value / totalUsd) * 100) : 0;
  return tokens;
}
