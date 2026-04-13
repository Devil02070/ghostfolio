"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useWalletBalance } from "@/lib/hooks";
import ThemeToggle from "../ThemeToggle";

const navItems = [
  { href: "/dashboard", label: "Home", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
  { href: "/dashboard/surveillance", label: "Surveillance", icon: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></> },
  { href: "/dashboard/decoys", label: "Decoy Control", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" /> },
  { href: "/dashboard/analytics", label: "Analytics", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { email, accountName, logout } = useAuth();

  const { data: balanceData } = useWalletBalance();

  const totalValue = balanceData?.totalValueUsd || null;
  const evmAddress = balanceData?.evmAddress || null;
  const shortAddr = evmAddress ? `${evmAddress.slice(0, 6)}...${evmAddress.slice(-4)}` : accountName || "Wallet";

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[260px] z-20 flex flex-col g-strong" style={{ borderRight: "1px solid var(--d-glass-border)" }}>
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 px-6 py-6">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20">
          C
        </div>
        <div>
          <span className="text-[15px] font-bold block" style={{ color: "var(--d-text)" }}>CloakFi</span>
          <span className="text-[10px]" style={{ color: "var(--d-text-3)" }}>Privacy Shield</span>
        </div>
      </Link>

      {/* Divider */}
      <div className="mx-5 h-px" style={{ background: "var(--d-glass-border)" }} />

      {/* Nav */}
      <nav className="flex-1 px-4 py-5 space-y-1">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className={`g-nav ${pathname === item.href ? "active" : ""}`}>
            <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">{item.icon}</svg>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-4 pb-5 space-y-3">
        <div className="flex items-center justify-between px-3">
          <span className="text-[10px] font-medium" style={{ color: "var(--d-text-3)" }}>Theme</span>
          <ThemeToggle />
        </div>

        {/* Wallet card */}
        <div className="g-card p-4" style={{ borderRadius: "var(--d-radius-sm)" }}>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-[10px] font-bold text-white shadow-md shadow-emerald-400/20">
                0x
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-semibold truncate" style={{ color: "var(--d-text)" }}>{shortAddr}</div>
                <div className="text-[10px] flex items-center gap-1" style={{ color: "var(--d-positive)" }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--d-positive)" }} />
                  {email ? email.split("@")[0] : "Connected"}
                </div>
              </div>
            </div>

            {totalValue && (
              <div className="flex justify-between text-[11px] mb-3 pt-3" style={{ borderTop: "1px solid var(--d-glass-border)" }}>
                <span style={{ color: "var(--d-text-3)" }}>Balance</span>
                <span className="font-bold" style={{ color: "var(--d-text)" }}>
                  ${parseFloat(totalValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            )}

            <button onClick={async () => { await logout(); router.push("/"); }}
              className="g-btn w-full text-[11px] py-2 text-center">
              Disconnect
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
