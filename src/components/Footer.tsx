"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative py-8 px-6" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center text-white font-bold text-[10px]"
            style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}
          >
            C
          </div>
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            CloakFi &mdash; Build X Hackathon
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px]" style={{ color: "var(--text-tertiary)" }}>
          <span>OKX OnchainOS</span>
          <span style={{ opacity: 0.3 }}>&middot;</span>
          <span>Uniswap</span>
          <span style={{ opacity: 0.3 }}>&middot;</span>
          <span>X Layer</span>
        </div>

        <Link
          href="/dashboard"
          className="text-xs transition-opacity hover:opacity-80"
          style={{ color: "var(--accent)" }}
        >
          Launch App &rarr;
        </Link>
      </div>
    </footer>
  );
}
