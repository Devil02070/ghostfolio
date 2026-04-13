"use client";

import SpotlightCard from "@/components/reactbits/SpotlightCard";
import AnimatedContent from "@/components/reactbits/AnimatedContent";
import CountUp from "@/components/reactbits/CountUp";

const features = [
  {
    tag: "Detection", title: "Know when you're being watched",
    desc: "Our surveillance engine scans smart money trackers, whale watchers, and MEV bots. If someone mirrors your trades, you'll know within minutes.",
    stat: { value: 5, suffix: " watchers", label: "avg. detected" },
    icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>,
  },
  {
    tag: "Decoys", title: "Automated noise generation",
    desc: "Small, randomized swaps into unrelated tokens. Realistic amounts, random timing, safety-checked. Observers see a completely different portfolio.",
    stat: { value: 8, suffix: " swaps/day", label: "moderate mode" },
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />,
  },
  {
    tag: "Score", title: "Measure your invisibility",
    desc: "A real-time score from 0 to 100 based on cosine similarity. Watch it climb as decoys deploy and your on-chain footprint becomes unreadable.",
    stat: { value: 87, suffix: "/100", label: "privacy score" },
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
  },
];

const small = [
  { title: "Gas-Free on X Layer", desc: "Zero fees for decoy swaps", icon: "$0" },
  { title: "TEE Wallet Security", desc: "Key never leaves enclave", icon: "TEE" },
  { title: "Budget Controls", desc: "Daily limits & blacklists", icon: "BDG" },
];

export default function Features() {
  return (
    <section id="features" className="relative py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <AnimatedContent distance={60}>
          <div className="max-w-2xl mb-20">
            <div className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: "#3690d2" }}>How it works</div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] text-white">
              Three layers of <span style={{ color: "#3690d2" }}>on-chain privacy</span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed max-w-lg" style={{ color: "rgba(255,255,255,0.6)" }}>
              Each engine works independently but compounds together.
            </p>
          </div>
        </AnimatedContent>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-16">
          {features.map((f, i) => (
            <AnimatedContent key={i} distance={60} delay={i * 0.15} className={i === 1 ? "lg:mt-10" : i === 2 ? "lg:mt-20" : ""}>
              <SpotlightCard spotlightColor="rgba(54,144,210,0.08)" className="rounded-2xl p-8 h-full"
                style={{ background: "rgba(20,29,44,0.2)", backdropFilter: "blur(28px)", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 8px 32px rgba(0,0,0,0.1)" } as React.CSSProperties}>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                    style={{ background: "rgba(54,144,210,0.1)", border: "1px solid rgba(54,144,210,0.15)" }}>
                    <svg className="w-6 h-6" fill="none" stroke="#3690d2" strokeWidth={1.5} viewBox="0 0 24 24">{f.icon}</svg>
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.15em] mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>{f.tag}</div>
                  <h3 className="text-xl font-semibold text-white mb-3 leading-tight">{f.title}</h3>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.6)" }}>{f.desc}</p>
                  <div className="pt-5 flex items-baseline gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <span className="text-2xl font-bold" style={{ color: "#3690d2" }}>
                      <CountUp to={f.stat.value} duration={2} delay={0.5 + i * 0.2} suffix={f.stat.suffix} />
                    </span>
                    <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>{f.stat.label}</span>
                  </div>
                </div>
              </SpotlightCard>
            </AnimatedContent>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {small.map((f, i) => (
            <AnimatedContent key={i} distance={30} delay={0.6 + i * 0.1}>
              <div className="flex items-start gap-4 p-5 rounded-xl transition-all duration-300 hover:bg-white/[0.03]"
                style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-[10px] font-mono flex-shrink-0"
                  style={{ background: "rgba(54,144,210,0.08)", border: "1px solid rgba(54,144,210,0.12)", color: "#3690d2" }}>{f.icon}</div>
                <div>
                  <div className="text-sm font-medium text-white">{f.title}</div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>{f.desc}</div>
                </div>
              </div>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  );
}
