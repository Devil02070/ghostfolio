"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useAccount, useDisconnect, useBalance } from "wagmi";
import { useWalletBalance } from "@/lib/hooks";
import { useState } from "react";
import Logo from "../Logo";

const tabs = [
  { href: "/dashboard", label: "Dashboard", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /> },
  { href: "/dashboard/surveillance", label: "Surveillance", icon: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></> },
  { href: "/dashboard/decoys", label: "Decoys", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" /> },
  { href: "/dashboard/analytics", label: "Analytics", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /> },
];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, email, loggedIn } = useAuth();
  const { address: wagmiAddr, isConnected: wagmiConnected } = useAccount();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const [hovered, setHovered] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { data: balData, isLoading: balLoading } = useWalletBalance();
  const { data: wagmiBal } = useBalance({ address: wagmiAddr, query: { enabled: wagmiConnected } });

  // Use wagmi address if connected via MetaMask/OKX Wallet, otherwise agentic wallet address
  const evmAddr = wagmiConnected ? wagmiAddr : (balData?.evmAddress || null);
  const addrLoading = !wagmiConnected && balLoading;
  const short = evmAddr ? `${evmAddr.slice(0, 6)}...${evmAddr.slice(-4)}` : null;

  return (
    <div className="dash-page fixed inset-0 overflow-hidden">
      {/* ── Light background image ── */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-bottom bg-no-repeat scale-105"
          style={{ backgroundImage: "url('https://images.ctfassets.net/gy95mqeyjg28/6I3I5uvbA2JMkc6DvaTsPi/462e97fe09fff5b6f13ab4ff4023cda0/MCL60_Stealth_Mode_Side-Wide.jpg')", filter: "brightness(0.85) saturate(1.15)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(10,15,30,0.15), rgba(20,29,44,0.1))" }} />
      </div>

      {/* ── Layout: sidebar + panel ── */}
      <div className="relative z-10 flex h-screen p-12 sm:p-16 lg:p-20 gap-6 mx-auto" style={{ maxWidth: "1440px" }}>

        {/* ═══ Icon Sidebar ═══ */}
        <div className="flex flex-col items-center py-5 px-1.5 flex-shrink-0 self-center z-20"
          style={{
            background: "rgba(20, 29, 44, 0.14)",
            backdropFilter: "blur(20px) saturate(1.1)",
            WebkitBackdropFilter: "blur(20px) saturate(1.1)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "22px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255,255,255,0.04)",
            width: "62px",
          }}>

          {/* Logo */}
          <Link href="/" className="hover:scale-110 transition-transform mb-7 block">
            <Logo size={40} />
          </Link>

          {/* Nav */}
          <div className="flex-1 flex flex-col items-center gap-2">
            {tabs.map((tab) => {
              const active = pathname === tab.href;
              return (
                <div key={tab.href} className="relative">
                  <Link href={tab.href}
                    onMouseEnter={() => setHovered(tab.href)}
                    onMouseLeave={() => setHovered(null)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300"
                    style={{
                      background: active ? "rgba(255, 255, 255, 0.12)" : "transparent",
                      color: active ? "#ffffff" : "rgba(255,255,255,0.45)",
                      border: active ? "1px solid rgba(255, 255, 255, 0.2)" : "1px solid transparent",
                    }}>
                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">{tab.icon}</svg>
                  </Link>

                  {/* Tooltip */}
                  {hovered === tab.href && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap pointer-events-none z-50"
                      style={{
                        background: "rgba(10, 14, 25, 0.85)",
                        backdropFilter: "blur(16px)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
                        color: "#ffffff",
                        animation: "tooltipIn 0.2s ease-out",
                      }}>
                      {tab.label}
                      <div className="absolute right-full top-1/2 -translate-y-1/2"
                        style={{ width: 0, height: 0, borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderRight: "5px solid rgba(10, 14, 25, 0.85)" }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Disconnect */}
          <button onClick={async () => { if (wagmiConnected) wagmiDisconnect(); if (loggedIn) await logout(); router.push("/"); }}
            className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 mt-4"
            style={{ color: "rgba(255,255,255,0.6)" }}
            title="Disconnect">
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>

        {/* ═══ Glass Content Panel ═══ */}
        <div className="flex-1 flex flex-col min-w-0 z-10"
          style={{
            background: "rgba(20, 29, 44, 0.12)",
            backdropFilter: "blur(20px) saturate(1.1)",
            WebkitBackdropFilter: "blur(20px) saturate(1.1)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "24px",
            boxShadow: "0 12px 48px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}>

          {/* Top bar */}
          <div className="flex items-center justify-between px-7 py-4 flex-shrink-0"
            style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
            <div className="flex items-center gap-3">
              <h1 className="text-sm font-semibold" style={{ color: "#ffffff" }}>
                {tabs.find((t) => t.href === pathname)?.label || "Dashboard"}
              </h1>
              <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.6)" }}>
                {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] hidden sm:block font-mono" style={{ color: "rgba(255,255,255,0.55)" }}>
                {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-bold"
                  style={{ background: "#3690d2", color: "#fff" }}>0x</div>
                {addrLoading ? (
                  <div className="w-3 h-3 border-2 rounded-full animate-spin hidden md:block" style={{ borderColor: "rgba(255,255,255,0.1)", borderTopColor: "#3690d2" }} />
                ) : (
                  <span className="text-[11px] font-mono hidden md:block" style={{ color: "rgba(255,255,255,0.65)" }}>{short}</span>
                )}
                {evmAddr && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(evmAddr);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="cursor-pointer transition-all duration-200 hover:scale-125"
                    style={{ color: copied ? "#3690d2" : "rgba(255,255,255,0.5)" }}
                    title={copied ? "Copied!" : "Copy full address"}
                  >
                    {copied ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scroll p-6">
            {children}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes tooltipIn {
          from { opacity: 0; transform: translateY(-50%) translateX(-4px); }
          to { opacity: 1; transform: translateY(-50%) translateX(0); }
        }
      `}</style>
    </div>
  );
}
