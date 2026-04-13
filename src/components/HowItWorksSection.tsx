"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { n: "01", title: "Connect Wallet", desc: "Link via OKX Agentic Wallet. We fetch holdings, DeFi positions, and TX history — all private.", accent: "var(--accent)" },
  { n: "02", title: "Analyze Exposure", desc: "Detect if whales, copy-traders, or tracking platforms are monitoring your wallet.", accent: "var(--accent-2)" },
  { n: "03", title: "Deploy Decoys", desc: "Set budget and aggression. GhostFolio runs randomized swaps via Uniswap — real noise, low cost.", accent: "var(--accent-3)" },
  { n: "04", title: "Score Rises", desc: "Watch your Privacy Score climb as observers' view diverges from reality.", accent: "var(--warning)" },
];

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".hiw-heading", { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });
      gsap.fromTo(".hiw-step", { opacity: 0, x: -30 }, {
        opacity: 1, x: 0, duration: 0.6, stagger: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: ".hiw-steps", start: "top 85%" },
      });
      gsap.fromTo(".hiw-terminal", { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".hiw-terminal", start: "top 85%" },
      });
      gsap.fromTo(".hiw-terminal", { y: 40 }, {
        y: -40, ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1.5 },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="how-it-works" className="relative py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 hiw-heading">
          <span className="tag mb-4" style={{ color: "var(--accent-3)" }}>How It Works</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mt-3">
            Four steps to <span className="gradient-text-tri">invisibility</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Steps */}
          <div className="hiw-steps space-y-4">
            {steps.map((s, i) => (
              <div
                key={i}
                className="hiw-step card p-5 flex gap-5 items-start hover:translate-x-1 transition-transform duration-300"
              >
                <div
                  className="flex-shrink-0 w-11 h-11 rounded-lg flex items-center justify-center text-sm font-bold"
                  style={{ background: `${s.accent}10`, border: `1px solid ${s.accent}20`, color: s.accent }}
                >
                  {s.n}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-primary mb-1">{s.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Terminal */}
          <div className="hiw-terminal card overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--negative)", opacity: 0.5 }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--warning)", opacity: 0.5 }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--positive)", opacity: 0.5 }} />
              <span className="text-[10px] ml-2 font-mono" style={{ color: "var(--text-tertiary)" }}>ghostfolio-engine</span>
            </div>
            <div className="p-5 font-mono text-xs space-y-2.5 leading-relaxed">
              <div style={{ color: "var(--accent-3)" }}>$ ghostfolio scan --wallet 0x7a3...f29</div>
              <div style={{ color: "var(--text-tertiary)" }}>Fetching portfolio from OKX...</div>
              <div style={{ color: "var(--text-secondary)" }}>Real: 60% ETH, 25% USDC, 15% ARB</div>
              <div className="pt-1" style={{ color: "var(--accent-2)" }}>Surveillance check...</div>
              <div style={{ color: "var(--warning)" }}>&#9888; 2 whale trackers detected</div>
              <div className="pt-1" style={{ color: "var(--accent)" }}>Deploying decoys...</div>
              <div style={{ color: "var(--text-tertiary)" }}>Swap #1: 0.003 ETH &rarr; LINK &#10003;</div>
              <div style={{ color: "var(--text-tertiary)" }}>Swap #2: 4.2 USDC &rarr; WBTC &#10003;</div>
              <div style={{ color: "var(--text-tertiary)" }}>Swap #3: 0.8 ARB &rarr; MATIC &#10003;</div>
              <div className="pt-1" style={{ color: "var(--positive)" }}>&#10003; Privacy Score: 43 &rarr; 87 (+44)</div>
              <div style={{ color: "var(--text-tertiary)" }}>Observer sees: 40% ETH, 20% LINK, 15% WBTC...</div>
              <div className="inline-block w-1.5 h-3.5 animate-pulse" style={{ background: "var(--text-secondary)" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
