"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import AnimatedContent from "@/components/reactbits/AnimatedContent";

const tokens = ["LINK", "WBTC", "UNI", "AAVE", "CRV", "SNX", "COMP", "SUSHI", "MATIC"];

function useSimulatedScore() {
  const [score, setScore] = useState(43);
  useEffect(() => {
    const i = setInterval(() => setScore((p) => { const n = p + Math.floor(Math.random() * 3); return n > 94 ? 43 : n; }), 2500);
    return () => clearInterval(i);
  }, []);
  return score;
}

export default function LiveSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const score = useSimulatedScore();
  const [feed, setFeed] = useState([
    { from: "ETH", to: "LINK", amt: "$4.20", time: "2s ago" },
    { from: "USDC", to: "WBTC", amt: "$8.75", time: "14s ago" },
    { from: "ARB", to: "MATIC", amt: "$2.30", time: "31s ago" },
    { from: "ETH", to: "UNI", amt: "$12.10", time: "58s ago" },
    { from: "USDC", to: "AAVE", amt: "$6.50", time: "1m ago" },
    { from: "ETH", to: "CRV", amt: "$3.80", time: "2m ago" },
  ]);

  useEffect(() => {
    const i = setInterval(() => {
      const from = ["ETH", "USDC", "ARB"][Math.floor(Math.random() * 3)];
      const to = tokens[Math.floor(Math.random() * tokens.length)];
      setFeed((p) => [{ from, to, amt: `$${(Math.random() * 15 + 2).toFixed(2)}`, time: "just now" }, ...p.slice(0, 5)]);
    }, 4000);
    return () => clearInterval(i);
  }, []);

  const c = 2 * Math.PI * 42, off = c - (score / 100) * c;

  return (
    <section id="live" ref={ref} className="relative py-32 lg:py-40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <AnimatedContent distance={40}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] mb-5"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>
              <span className="relative w-2 h-2 rounded-full bg-red-500 live-dot" />
              Live Simulation
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
              Watch privacy happen <span style={{ color: "#3690d2" }}>in real time</span>
            </h2>
          </div>
        </AnimatedContent>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <AnimatedContent distance={40} direction="horizontal" className="lg:col-span-3">
            <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(20,29,44,0.3)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                </div>
                <span className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.25)" }}>ghostfolio-engine</span>
                <div className="flex items-center gap-1.5">
                  <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-400 live-dot" />
                  <span className="text-[10px]" style={{ color: "#5bc4a0" }}>Active</span>
                </div>
              </div>
              <div className="p-5 space-y-2 font-mono text-[13px] min-h-[320px]">
                {feed.map((item, i) => (
                  <motion.div key={`${item.from}-${item.to}-${i}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
                    className="flex items-center gap-3 py-2 px-3 rounded-lg transition-colors hover:bg-white/[0.03]">
                    <span className="text-[10px] w-14 text-right flex-shrink-0" style={{ color: "#5bc4a0" }}>{item.time}</span>
                    <span style={{ color: "rgba(255,255,255,0.6)" }}>{item.from}</span>
                    <svg className="w-3 h-3 flex-shrink-0" style={{ color: "rgba(255,255,255,0.15)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                    <span style={{ color: "#3690d2" }}>{item.to}</span>
                    <span className="ml-auto" style={{ color: "rgba(255,255,255,0.3)" }}>{item.amt}</span>
                    <span className="text-[10px]" style={{ color: "#5bc4a0" }}>&#10003;</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedContent>

          <AnimatedContent distance={40} direction="horizontal" reverse className="lg:col-span-2">
            <div className="rounded-2xl p-8 flex flex-col items-center justify-center"
              style={{ background: "rgba(20,29,44,0.3)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="text-[10px] uppercase tracking-[0.2em] mb-6" style={{ color: "rgba(255,255,255,0.3)" }}>Privacy Score</div>
              <div className="relative w-44 h-44 mb-6">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#3690d2" strokeWidth="3.5"
                    strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off}
                    className="transition-all duration-1000 ease-out" style={{ filter: "drop-shadow(0 0 8px rgba(54,144,210,0.4))" }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span key={score} initial={{ scale: 1.2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="text-5xl font-bold text-white">{score}</motion.span>
                </div>
              </div>
              <div className="w-full space-y-3">
                {[
                  { l: "Observer accuracy", v: `${100 - score}%`, c: "#5bc4a0" },
                  { l: "Decoys deployed", v: `${Math.floor((score - 43) * 0.8 + 6)}`, c: "rgba(255,255,255,0.6)" },
                  { l: "Gas spent", v: "$0.00", c: "rgba(255,255,255,0.6)" },
                ].map((r, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span style={{ color: "rgba(255,255,255,0.3)" }}>{r.l}</span>
                    <span style={{ color: r.c }}>{r.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedContent>
        </div>
      </div>
    </section>
  );
}
