"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import { useLoginModal } from "@/components/LoginModal";

export default function Footer() {
  const { open: openLogin } = useLoginModal();
  return (
    <footer className="relative" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <Logo size={28} />
              <span className="text-sm font-semibold text-white">CloakFi</span>
            </div>
            <p className="text-xs max-w-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
              On-chain privacy through intelligent decoy swaps. Built for the OKX Build X Hackathon on X Layer.
            </p>
          </div>

          <div className="flex gap-8">
            <div>
              <div className="text-[10px] uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>Product</div>
              <div className="space-y-2">
                {[{ href: "#features", l: "Features" }, { href: "#live", l: "Live Demo" }].map((x, i) => (
                  <a key={i} href={x.href} className="block text-xs transition-colors hover:text-white/60" style={{ color: "rgba(255,255,255,0.55)" }}>{x.l}</a>
                ))}
                {[{ l: "Connect Wallet" }].map((x, i) => (
                  <button key={i} onClick={openLogin} className="block text-xs transition-colors hover:text-white/60 text-left cursor-pointer" style={{ color: "rgba(255,255,255,0.55)" }}>{x.l}</button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>Built With</div>
              <div className="space-y-2">
                {["OKX OnchainOS", "Uniswap V4", "X Layer"].map((t, i) => (
                  <span key={i} className="block text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          <button onClick={openLogin} className="text-xs px-5 py-2.5 rounded-xl inline-flex items-center gap-2 font-semibold transition-all hover:shadow-lg cursor-pointer"
            style={{ background: "#3690d2", color: "#fff", boxShadow: "0 4px 16px rgba(54,144,210,0.25)" }}>
            Connect Wallet
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>

        <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>Built for Build X Hackathon 2026</span>
          <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>Powered by OKX Agentic Wallet &middot; TEE Secured</span>
        </div>
      </div>
    </footer>
  );
}
