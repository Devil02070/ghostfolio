"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GradientOrb } from "./Vectors";

gsap.registerPlugin(ScrollTrigger);

const realHoldings = [
  { token: "ETH", pct: 60, accent: "var(--accent)" },
  { token: "USDC", pct: 25, accent: "var(--accent-2)" },
  { token: "ARB", pct: 15, accent: "var(--accent-3)" },
];

const observerSees = [
  { token: "ETH", pct: 35, accent: "var(--accent)" },
  { token: "LINK", pct: 22, accent: "var(--accent-2)" },
  { token: "WBTC", pct: 18, accent: "var(--warning)" },
  { token: "MATIC", pct: 12, accent: "var(--accent-rose)" },
  { token: "USDC", pct: 8, accent: "var(--accent-2)" },
  { token: "Misc", pct: 5, accent: "var(--text-tertiary)" },
];

export default function PrivacyScoreSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".ps-heading", { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });
      gsap.fromTo(".ps-left", { opacity: 0, x: -50 }, {
        opacity: 1, x: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".ps-cards", start: "top 80%" },
      });
      gsap.fromTo(".ps-right", { opacity: 0, x: 50 }, {
        opacity: 1, x: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".ps-cards", start: "top 80%" },
      });
      gsap.fromTo(".bar-fill", { scaleX: 0 }, {
        scaleX: 1, duration: 1, stagger: 0.08, ease: "power3.out",
        scrollTrigger: { trigger: ".ps-cards", start: "top 75%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="privacy" className="relative py-28 px-6">
      <GradientOrb className="w-[500px] h-[500px] bottom-[5%] -right-[10%]" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 ps-heading">
          <span className="tag mb-4" style={{ color: "var(--accent)" }}>Privacy Score</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mt-3">
            Reality vs. <span className="gradient-text">perception</span>
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-sm" style={{ color: "var(--text-secondary)" }}>
            The wider the gap, the higher your privacy score.
          </p>
        </div>

        <div className="ps-cards grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {/* Real */}
          <div className="ps-left card p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full" style={{ background: "var(--positive)" }} />
              <span className="text-sm font-semibold text-primary">Your Real Portfolio</span>
              <span className="tag ml-auto text-[10px]">Private</span>
            </div>
            <div className="space-y-4">
              {realHoldings.map((h, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span style={{ color: "var(--text-secondary)" }}>{h.token}</span>
                    <span style={{ color: "var(--text-tertiary)" }}>{h.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--surface)" }}>
                    <div className="bar-fill h-full rounded-full origin-left" style={{ width: `${h.pct}%`, background: h.accent }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                Strategy: <span style={{ color: "var(--text-secondary)" }}>ETH-heavy with stable hedge</span>
              </p>
            </div>
          </div>

          {/* Observer */}
          <div className="ps-right card p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full" style={{ background: "var(--negative)" }} />
              <span className="text-sm font-semibold text-primary">What Observers See</span>
              <span className="tag ml-auto text-[10px]">Public</span>
            </div>
            <div className="space-y-4">
              {observerSees.map((h, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span style={{ color: "var(--text-secondary)" }}>{h.token}</span>
                    <span style={{ color: "var(--text-tertiary)" }}>{h.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--surface)" }}>
                    <div className="bar-fill h-full rounded-full origin-left" style={{ width: `${h.pct}%`, background: h.accent }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                Apparent: <span style={{ color: "var(--text-secondary)" }}>Diversified blue-chip holder</span>
              </p>
            </div>
          </div>
        </div>

        {/* Score badge */}
        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-4 card px-7 py-4">
            <div className="text-3xl font-bold gradient-text">87</div>
            <div className="text-left">
              <div className="text-xs font-semibold text-primary">Privacy Score</div>
              <div className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                Observer accuracy: only 13%
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
