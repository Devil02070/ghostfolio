"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { GradientOrb, FloatingShapes } from "./Vectors";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      tl.fromTo(".hero-tag", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
        .fromTo(".hero-title", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: "power4.out" }, "-=0.3")
        .fromTo(".hero-sub", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.5")
        .fromTo(".hero-cta", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.3")
        .fromTo(".hero-visual", { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" }, "-=0.5");

      // Subtle floating
      gsap.to(".hero-visual", { y: -8, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Background decorations */}
      <div className="hero-mesh absolute inset-0" />
      <GradientOrb className="w-[600px] h-[600px] -top-[15%] -left-[10%]" />
      <GradientOrb className="w-[400px] h-[400px] bottom-[10%] -right-[5%]" color1="var(--accent-2)" color2="var(--accent-3)" />
      <FloatingShapes className="top-0 left-0 w-full h-full opacity-60" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-20">
        {/* Text */}
        <div className="flex-1 text-center lg:text-left">
          <div className="hero-tag tag mb-6 mx-auto lg:mx-0">
            <span
              className="w-1.5 h-1.5 rounded-full soft-pulse"
              style={{ background: "var(--accent-3)" }}
            />
            Built on X Layer &middot; Powered by OKX
          </div>

          <h1 className="hero-title text-5xl sm:text-6xl lg:text-[4.25rem] font-bold leading-[1.08] tracking-tight text-primary">
            Your wallet talks.
            <br />
            <span className="gradient-text">Make it lie.</span>
          </h1>

          <p
            className="hero-sub mt-6 text-lg leading-relaxed max-w-lg mx-auto lg:mx-0"
            style={{ color: "var(--text-secondary)" }}
          >
            GhostFolio masks your real strategy behind intelligent decoy swaps.
            Confuse watchers. Protect your alpha.
          </p>

          <div className="hero-cta mt-10 flex flex-wrap gap-3 justify-center lg:justify-start">
            <Link href="/dashboard" className="btn-primary px-7 py-3.5 flex items-center gap-2 text-base">
              Launch Dashboard
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <a href="#how-it-works" className="btn-secondary px-7 py-3.5 text-base">
              How It Works
            </a>
          </div>
        </div>

        {/* Privacy Score Visual */}
        <div className="hero-visual flex-1 flex justify-center">
          <div className="relative w-[300px] h-[300px]">
            {/* Glow */}
            <div
              className="absolute inset-0 rounded-full blur-3xl opacity-20"
              style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}
            />

            {/* Card */}
            <div className="card absolute inset-6 rounded-full flex flex-col items-center justify-center">
              <span className="text-xs uppercase tracking-[0.2em] mb-2" style={{ color: "var(--text-tertiary)" }}>
                Privacy Score
              </span>
              <span className="text-6xl font-bold gradient-text">87</span>
              <span className="text-xs mt-2 flex items-center gap-1" style={{ color: "var(--positive)" }}>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                +12 this week
              </span>
            </div>

            {/* Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="var(--border)" strokeWidth="1.5" />
              <circle
                cx="50" cy="50" r="45" fill="none"
                stroke="url(#heroRingGrad)" strokeWidth="2"
                strokeLinecap="round" strokeDasharray="283" strokeDashoffset="37"
                style={{ animation: "score-fill 2s ease-out 1s both" }}
              />
              <defs>
                <linearGradient id="heroRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--accent)" />
                  <stop offset="100%" stopColor="var(--accent-2)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ color: "var(--text-tertiary)" }}>
        <span className="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
        <div className="w-4 h-7 rounded-full border flex justify-center pt-1" style={{ borderColor: "var(--border)" }}>
          <div className="w-0.5 h-1.5 rounded-full animate-bounce" style={{ background: "var(--text-tertiary)" }} />
        </div>
      </div>
    </section>
  );
}
