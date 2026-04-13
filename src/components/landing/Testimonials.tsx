"use client";

import AnimatedContent from "@/components/reactbits/AnimatedContent";
import SpotlightCard from "@/components/reactbits/SpotlightCard";

const testimonials = [
  { quote: "I was on three whale tracker lists. Within a week of running GhostFolio, two dropped me. My copy-traders went from 8 to 1.", name: "0xMarc", role: "DeFi trader, $2M+ portfolio", avatar: "M" },
  { quote: "The privacy score is addictive. Watching it climb from 30 to 85 while spending less than $5 total on X Layer was wild. Zero gas fees is a game changer.", name: "cryptoSarah", role: "Yield farmer & LP provider", avatar: "S" },
  { quote: "I built a 200-ETH position over two months. Without GhostFolio, every whale tracker would have front-run me. They still think I'm a diversified small-cap holder.", name: "anon_alpha", role: "Smart money trader", avatar: "A" },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <AnimatedContent distance={40}>
          <div className="mb-16">
            <div className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: "#3690d2" }}>Proof</div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight max-w-lg text-white">
              Real traders.<br /><span style={{ color: "rgba(255,255,255,0.3)" }}>Real results.</span>
            </h2>
          </div>
        </AnimatedContent>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <AnimatedContent key={i} distance={50} delay={i * 0.15} className={i === 1 ? "md:-mt-6" : ""}>
              <SpotlightCard spotlightColor="rgba(54,144,210,0.06)" className="rounded-2xl p-7 flex flex-col h-full"
                style={{ background: "rgba(20,29,44,0.3)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.08)" } as React.CSSProperties}>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <svg key={j} className="w-4 h-4" style={{ color: "#3690d2" }} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-[15px] leading-relaxed flex-1" style={{ color: "rgba(255,255,255,0.55)" }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 mt-6 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                      style={{ background: "linear-gradient(135deg, #3690d2, #5bc4a0)" }}>{t.avatar}</div>
                    <div>
                      <div className="text-sm font-medium text-white">{t.name}</div>
                      <div className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  );
}
