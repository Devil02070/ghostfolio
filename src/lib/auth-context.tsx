"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface WalletState {
  loggedIn: boolean;
  email: string;
  accountId: string;
  accountName: string;
  accountCount: number;
  loading: boolean;
}

interface AuthContextType extends WalletState {
  login: (email: string) => Promise<{ ok: boolean; error?: string }>;
  verify: (otp: string) => Promise<{ ok: boolean; error?: string; isNew?: boolean }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  loggedIn: false,
  email: "",
  accountId: "",
  accountName: "",
  accountCount: 0,
  loading: true,
  login: async () => ({ ok: false }),
  verify: async () => ({ ok: false }),
  logout: async () => {},
  refresh: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [state, setState] = useState<WalletState>({
    loggedIn: false,
    email: "",
    accountId: "",
    accountName: "",
    accountCount: 0,
    loading: true,
  });

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/status");
      const json = await res.json();
      if (json.ok) {
        setState({
          loggedIn: json.data.loggedIn,
          email: json.data.email || "",
          accountId: json.data.currentAccountId || "",
          accountName: json.data.currentAccountName || "",
          accountCount: json.data.accountCount || 0,
          loading: false,
        });
      } else {
        setState((prev) => ({ ...prev, loading: false }));
      }
    } catch {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (email: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const json = await res.json();
    if (json.ok) {
      setState((prev) => ({ ...prev, email }));
    }
    return { ok: json.ok, error: json.error };
  }, []);

  const verify = useCallback(
    async (otp: string) => {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });
      const json = await res.json();
      if (json.ok) {
        await refresh();
        queryClient.invalidateQueries();
        return { ok: true, isNew: json.data?.isNew };
      }
      return { ok: false, error: json.error || "Verification failed" };
    },
    [refresh, queryClient]
  );

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setState({
      loggedIn: false,
      email: "",
      accountId: "",
      accountName: "",
      accountCount: 0,
      loading: false,
    });
    queryClient.clear();
  }, [queryClient]);

  return (
    <AuthContext.Provider value={{ ...state, login, verify, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}
