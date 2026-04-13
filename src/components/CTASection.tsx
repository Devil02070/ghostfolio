"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { GradientOrb } from "./Vectors";

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".cta-box", { opacity: 0, y: 40, scale: 0.97 }, {
        opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-28 px-6">
      <GradientOrb className="w-[500px] h-[500px] top-[-20%] left-[30%]" />

      <div className="max-w-3xl mx-auto">
        <div className="cta-box card p-10 sm:p-14 text-center relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{ background: "radial-gradient(ellipse at center, var(--glow-sm), transparent 70%)" }}
          />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Ready to go <span className="gradient-text">invisible</span>?
            </h2>
            <p className="text-sm max-w-md mx-auto mb-8" style={{ color: "var(--text-secondary)" }}>
              Connect your wallet, deploy your first decoy, and watch your Privacy Score climb.
            </p>
            <Link href="/dashboard" className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-base">
              Launch Dashboard
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
