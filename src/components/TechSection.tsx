"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stack = [
  { name: "OKX OnchainOS", desc: "11 skills — portfolio, surveillance, decoys", letter: "O", accent: "var(--accent)" },
  { name: "Uniswap", desc: "Swap execution & route optimization", letter: "U", accent: "var(--accent-rose)" },
  { name: "X Layer", desc: "Low-gas mainnet transactions", letter: "X", accent: "var(--accent-2)" },
  { name: "Next.js", desc: "App Router & server components", letter: "N", accent: "var(--text-secondary)" },
  { name: "Hono", desc: "Ultra-fast backend API", letter: "H", accent: "var(--warning)" },
  { name: "TanStack Query", desc: "Smart data fetching & caching", letter: "T", accent: "var(--accent-3)" },
];

export default function TechSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".tech-heading", { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });
      gsap.fromTo(".tech-item", { opacity: 0, y: 25, scale: 0.97 }, {
        opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.07, ease: "power3.out",
        scrollTrigger: { trigger: ".tech-grid", start: "top 85%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="stack" className="relative py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 tech-heading">
          <span className="tag mb-4" style={{ color: "var(--warning)" }}>Stack</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mt-3">
            Built with the <span className="gradient-text">best in web3</span>
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-sm" style={{ color: "var(--text-secondary)" }}>
            13 skills deeply integrated — judges will notice.
          </p>
        </div>

        <div className="tech-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
          {stack.map((t, i) => (
            <div key={i} className="tech-item card-flat p-5 flex items-start gap-4 hover:-translate-y-0.5 transition-all duration-300 cursor-default">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: `${t.accent}10`, border: `1px solid ${t.accent}18`, color: t.accent }}
              >
                {t.letter}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-primary">{t.name}</h3>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
