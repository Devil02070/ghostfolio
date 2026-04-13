"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useAccount } from "wagmi";
import { useWalletBalance, useFootprint, parseBalanceToPortfolio } from "@/lib/hooks";
import CountUp from "@/components/reactbits/CountUp";

function Gauge({ score }: { score: number }) {
  const c = 2 * Math.PI * 52, off = c - (score / 100) * c;
  return (
    <div className="relative w-40 h-40">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
        <circle cx="60" cy="60" r="52" fill="none" stroke="#3690d2" strokeWidth="5"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off}
          className="transition-all duration-1000" style={{ filter: "drop-shadow(0 0 8px rgba(54,144,210,0.3))" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold" style={{ color: "#ffffff" }}>{score}<span className="text-lg" style={{ color: "rgba(255,255,255,0.65)" }}>&deg;</span></span>
        <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.65)" }}>Privacy Score</span>
      </div>
    </div>
  );
}

export default function DashboardHome() {
  const ref = useRef<HTMLDivElement>(null);
  const { data: bal, isLoading: bL } = useWalletBalance();
  const { data: fp, isLoading: fL } = useFootprint();

  // wagmi wallet
  const { address: wagmiAddr, isConnected: wagmiConnected } = useAccount();
  const [wagmiOkbBalance, setWagmiOkbBalance] = useState(0);

  // Fetch balance directly from X Layer testnet RPC (reliable, no chain mismatch issues)
  useEffect(() => {
    if (!wagmiConnected || !wagmiAddr) { setWagmiOkbBalance(0); return; }
    async function fetchBal() {
      try {
        const res = await fetch("https://testrpc.xlayer.tech/evm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jsonrpc: "2.0", method: "eth_getBalance", params: [wagmiAddr, "latest"], id: 1 }),
        });
        const json = await res.json();
        if (json.result) setWagmiOkbBalance(Number(BigInt(json.result)) / 1e18);
      } catch { /* ignore */ }
    }
    fetchBal();
    const interval = setInterval(fetchBal, 15000);
    return () => clearInterval(interval);
  }, [wagmiConnected, wagmiAddr]);

  useEffect(() => { if (bL && !wagmiConnected) return; const ctx = gsap.context(() => { gsap.fromTo(".da", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power3.out" }); }, ref); return () => ctx.revert(); }, [bL, wagmiConnected]);

  // Build portfolio from agentic wallet or wagmi
  const portfolio = parseBalanceToPortfolio(bal);
  const agenticTotal = bal?.totalValueUsd ? parseFloat(bal.totalValueUsd) : portfolio.reduce((s, t) => s + t.value, 0);

  const okbPrice = 82;
  const wagmiTotal = wagmiOkbBalance * okbPrice;

  // Use wagmi balance if connected via browser wallet, otherwise agentic
  const hasWagmi = wagmiConnected && wagmiOkbBalance > 0;
  const total = hasWagmi ? wagmiTotal : agenticTotal;
  const tokenCount = hasWagmi ? 1 : portfolio.length;

  const ps = fp?.privacyScore ?? 0, obs = fp?.observedProfile?.holdings || [];
  const decoys = fp?.decoysDeployed ?? 0, sim = fp?.similarity ?? 100;
  const loading = wagmiConnected ? false : bL;
  const Spin = () => <div className="flex items-center justify-center py-8"><div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: "rgba(20,29,44,0.08)", borderTopColor: "#3690d2" }} /></div>;

  return (
    <div ref={ref}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-5">
        <div className="lg:col-span-3 grid grid-cols-3 gap-4">
          {[
            { label: "Portfolio Value", num: Math.round(total), pre: "$", sub: `${tokenCount} token${tokenCount !== 1 ? "s" : ""}` },
            { label: "Accuracy", num: sim, suf: "%", sub: sim < 30 ? "Hidden" : "Exposed" },
            { label: "Decoys", num: decoys, sub: "Deployed" },
          ].map((s, i) => (
            <div key={i} className="da g-stat-pill">
              <div className="relative z-10">
                <div className="text-[9px] uppercase tracking-wider mb-1" style={{ color: "rgba(255,255,255,0.65)" }}>{s.label}</div>
                <div className="text-2xl font-bold" style={{ color: "#ffffff" }}>
                  {loading || fL ? "..." : <CountUp to={s.num} duration={2} delay={i * 0.1} prefix={s.pre || ""} suffix={s.suf || ""} />}
                </div>
                <div className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.65)" }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="da g-inner p-5 flex items-center justify-center">
          <div className="relative z-10"><Gauge score={ps} /></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-5">
        <div className="da g-inner p-5 lg:col-span-3">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold" style={{ color: "#ffffff" }}>Real Portfolio</span>
              <span className="text-[9px] px-2 py-1 rounded-full" style={{ background: "rgba(54,144,210,0.08)", color: "#3690d2" }}>
                {wagmiConnected ? "X Layer Testnet" : "Live"}
              </span>
            </div>

            {/* wagmi wallet portfolio */}
            {hasWagmi ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2.5 rounded-2xl g-item">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-bold"
                    style={{ background: "rgba(54,144,210,0.08)", color: "#3690d2", border: "1px solid rgba(54,144,210,0.2)" }}>
                    O
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-semibold" style={{ color: "#ffffff" }}>OKB</span>
                      <span className="font-semibold" style={{ color: "#ffffff" }}>${wagmiTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-[9px] mt-0.5">
                      <span style={{ color: "rgba(255,255,255,0.65)" }}>{wagmiOkbBalance.toFixed(4)} OKB</span>
                      <span style={{ color: "rgba(255,255,255,0.65)" }}>100%</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : loading ? <Spin /> : portfolio.length === 0 ? (
              <p className="text-xs text-center py-6" style={{ color: "rgba(255,255,255,0.65)" }}>No tokens</p>
            ) : (
              <div className="space-y-2">
                {portfolio.slice(0, 5).map((t, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-2xl g-item">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-bold"
                      style={{ background: "rgba(54,144,210,0.08)", color: "#3690d2", border: "1px solid rgba(54,144,210,0.2)" }}>
                      {t.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-semibold" style={{ color: "#ffffff" }}>{t.symbol}</span>
                        <span className="font-semibold" style={{ color: "#ffffff" }}>${t.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between text-[9px] mt-0.5">
                        <span style={{ color: "rgba(255,255,255,0.65)" }}>{t.balance < 0.001 ? t.balance.toExponential(2) : t.balance.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                        <span style={{ color: "rgba(255,255,255,0.65)" }}>{t.allocation}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="da g-inner p-5 lg:col-span-2">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold" style={{ color: "#ffffff" }}>Public Footprint</span>
              <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.65)" }}>Observers see</span>
            </div>
            {fL ? <Spin /> : obs.length === 0 ? <p className="text-xs text-center py-6" style={{ color: "rgba(255,255,255,0.65)" }}>Deploy decoys</p> : (
              <div className="grid grid-cols-2 gap-2">
                {obs.slice(0, 6).map((t: { symbol: string; allocation: number }, i: number) => (
                  <div key={i} className="g-well p-3 text-center rounded-2xl">
                    <div className="text-lg font-bold" style={{ color: "#ffffff" }}>{t.allocation}%</div>
                    <div className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.65)" }}>{t.symbol}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="da grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Deploy Decoy", href: "/dashboard/decoys" },
          { label: "Scan Watchers", href: "/dashboard/surveillance" },
          { label: "View Analytics", href: "/dashboard/analytics" },
          { label: "X Layer", href: "#" },
        ].map((a, i) => (
          <a key={i} href={a.href} className="g-item p-4 flex items-center gap-3 group cursor-pointer">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
              style={{ background: "rgba(54,144,210,0.12)", border: "1px solid rgba(54,144,210,0.18)" }}>
              <svg className="w-4 h-4" style={{ color: "#3690d2" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.65)" }}>{a.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
