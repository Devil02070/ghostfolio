"use client";

import Link from "next/link";
import AnimatedContent from "@/components/reactbits/AnimatedContent";
import StarBorder from "@/components/reactbits/StarBorder";
import CountUp from "@/components/reactbits/CountUp";

export default function CTA() {
  return (
    <section id="cta" className="relative py-32 lg:py-44 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <AnimatedContent distance={50} duration={0.8}>
          <div className="rounded-3xl p-12 sm:p-16" style={{
            background: "rgba(20,29,44,0.35)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-white mb-6">
              Stop leaking<br /><span style={{ color: "#3690d2" }}>your strategy</span>
            </h2>
            <p className="text-lg max-w-lg mx-auto mb-8 leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
              Every second unprotected, someone reads your moves. Connect. Deploy. Disappear.
            </p>

            <div className="flex justify-center gap-10 mb-10">
              {[
                { to: 13, suffix: "%", label: "Observer accuracy" },
                { to: 0, suffix: " gas", label: "X Layer fees" },
                { to: 24, suffix: "/7", label: "Auto-decoys" },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-bold text-white">
                    <CountUp to={s.to} duration={2} delay={0.3 + i * 0.2} suffix={s.suffix} />
                  </div>
                  <div className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{s.label}</div>
                </div>
              ))}
            </div>

            <StarBorder as="div" color="rgba(54,144,210,0.5)" speed="5s" className="inline-flex">
              <Link href="/login" className="flex items-center justify-center gap-3 px-10 py-5 text-base font-semibold text-white rounded-xl group"
                style={{ background: "#3690d2", boxShadow: "0 8px 24px rgba(54,144,210,0.3)" }}>
                Connect Wallet & Start
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </StarBorder>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
              {["Free to start", "Zero gas on X Layer", "TEE-secured keys"].map((t, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" style={{ color: "#5bc4a0" }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>{t}
                </span>
              ))}
            </div>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
