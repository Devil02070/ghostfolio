"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GradientOrb } from "./Vectors";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
    title: "Private Portfolio",
    description: "Your real holdings, P&L, and DeFi positions — visible only to you.",
    accent: "var(--accent)",
  },
  {
    icon: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>,
    title: "Surveillance Detection",
    description: "Know when whales, KOLs, or copy-bots are watching your wallet.",
    accent: "var(--accent-2)",
  },
  {
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />,
    title: "Decoy Swaps",
    description: "Automated, randomized trades into unrelated tokens. Realistic noise.",
    accent: "var(--accent-3)",
  },
  {
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
    title: "Footprint Analysis",
    description: "See exactly what observers conclude about your portfolio.",
    accent: "var(--accent-rose)",
  },
  {
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    title: "Privacy Score",
    description: "Real-time 0-100 score measuring how hidden your strategy really is.",
    accent: "var(--warning)",
  },
  {
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    title: "Budget Controls",
    description: "Daily limits, max swap sizes, token blacklists. Your rules.",
    accent: "var(--accent)",
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".feat-heading", { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });
      gsap.fromTo(".feat-card", { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power3.out",
        scrollTrigger: { trigger: ".feat-grid", start: "top 85%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="features" className="relative py-28 px-6">
      <GradientOrb className="w-[500px] h-[500px] top-0 right-[-15%]" color1="var(--accent-2)" color2="var(--accent-3)" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 feat-heading">
          <span className="tag mb-4" style={{ color: "var(--accent-2)" }}>Features</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mt-3">
            Everything to <span className="gradient-text">go ghost</span>
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-sm" style={{ color: "var(--text-secondary)" }}>
            Six tools working in unison to make your on-chain footprint completely misleading.
          </p>
        </div>

        <div className="feat-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="feat-card card p-6 group cursor-default hover:-translate-y-0.5 transition-all duration-300"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-5 transition-transform group-hover:scale-105"
                style={{ background: `${f.accent}12`, border: `1px solid ${f.accent}20` }}
              >
                <svg className="w-5 h-5" fill="none" stroke={f.accent} viewBox="0 0 24 24">{f.icon}</svg>
              </div>
              <h3 className="text-base font-semibold text-primary mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
