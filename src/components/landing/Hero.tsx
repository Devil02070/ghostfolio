"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { useLoginModal } from "@/components/LoginModal";
import ShinyText from "@/components/reactbits/ShinyText";
import CountUp from "@/components/reactbits/CountUp";
import StarBorder from "@/components/reactbits/StarBorder";
import CardSwap, { Card } from "@/components/reactbits/CardSwap";

const MagicRings = dynamic(() => import("@/components/reactbits/MagicRings"), { ssr: false });

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const { open: openLogin } = useLoginModal();

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-40">
        {/* <MagicRings color="#3690d2" colorTwo="#5bc4a0" speed={0.5} ringCount={4} attenuation={10}
          lineThickness={1.2} baseRadius={0.3} radiusStep={0.1} opacity={0.5} noiseAmount={0.06}
          ringGap={1.8} followMouse mouseInfluence={0.1} hoverScale={1.03} parallax={0.03} clickBurst blur={1.5} /> */}
      </div>

      <motion.div style={{ opacity }} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="flex items-center min-h-screen pt-20 pb-20">
          {/* Left: Text content */}
          <div className="flex-1 max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] tracking-wide"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)" }}>
                <span className="relative w-2 h-2 rounded-full bg-emerald-400 live-dot" />
                <ShinyText text="Live on X Layer  ·  Gas-Free  ·  TEE Secured" speed={3} color="rgba(255,255,255,0.6)" shineColor="#fff" />
              </div>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 text-[clamp(2.5rem,5.5vw,4.5rem)] font-bold leading-[1.05] tracking-tight text-white">
              Your wallet talks.
              <br />
              <span style={{ color: "#3690d2" }}>Make it lie.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.55 }}
              className="mt-6 text-lg max-w-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
              CloakFi deploys intelligent decoy swaps that make your on-chain footprint unreadable. Watchers see noise. Your alpha stays invisible.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.75 }}
              className="mt-10 flex flex-wrap gap-4">
              <StarBorder as="div" color="rgba(54,144,210,0.5)" speed="4s">
                <button onClick={openLogin} className="flex items-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-xl group cursor-pointer"
                  style={{ background: "#3690d2", boxShadow: "0 8px 24px rgba(54,144,210,0.3)" }}>
                  Connect Wallet
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </StarBorder>
              <a href="#features" className="px-8 py-4 text-base font-medium rounded-xl transition-all hover:bg-white/15"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.8)" }}>
                See How It Works
              </a>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.1 }}
              className="mt-16 flex flex-wrap gap-x-12 gap-y-4">
              {[
                { comp: <CountUp to={87} duration={2.5} delay={1.2} />, label: "Avg. Privacy Score" },
                { comp: <><span>$</span><CountUp to={0.14} from={0} duration={2.5} delay={1.4} /></>, label: "Cost per Point" },
                { comp: <CountUp to={0} duration={1} delay={1.6} suffix=" gas" />, label: "On X Layer" },
              ].map((s, i) => (
                <div key={i}>
                  <div className="text-2xl font-bold text-white">{s.comp}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: CardSwap */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block flex-1 relative min-h-[500px]"
          >
            <CardSwap
              width={320}
              height={200}
              cardDistance={50}
              verticalDistance={55}
              delay={4000}
              pauseOnHover
              skewAmount={4}
              easing="elastic"
            >
              {/* Card 1: Privacy Score */}
              <Card customClass="p-6 cursor-pointer"
                style={{ background: "rgba(20,29,44,0.35)", backdropFilter: "blur(28px)", border: "1px solid rgba(255,255,255,0.14)" } as React.CSSProperties}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.55)" }}>Privacy Score</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(91,196,160,0.15)", color: "#5bc4a0" }}>+12</span>
                </div>
                <div className="text-5xl font-bold text-white mb-2">87<span className="text-xl" style={{ color: "rgba(255,255,255,0.45)" }}>/100</span></div>
                <div className="h-2 rounded-full overflow-hidden mt-3" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="h-full rounded-full" style={{ width: "87%", background: "linear-gradient(90deg, #3690d2, #5bc4a0)" }} />
                </div>
                <div className="text-[10px] mt-2" style={{ color: "rgba(255,255,255,0.45)" }}>Observer accuracy: 13%</div>
              </Card>

              {/* Card 2: Decoy Activity */}
              <Card customClass="p-6 cursor-pointer"
                style={{ background: "rgba(20,29,44,0.35)", backdropFilter: "blur(28px)", border: "1px solid rgba(255,255,255,0.14)" } as React.CSSProperties}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.55)" }}>Decoy Swaps</span>
                  <span className="relative w-2 h-2 rounded-full bg-emerald-400 live-dot" />
                </div>
                <div className="space-y-2 font-mono text-[12px]">
                  {[
                    { from: "ETH", to: "LINK", t: "2s ago" },
                    { from: "USDC", to: "WBTC", t: "14s ago" },
                    { from: "ARB", to: "UNI", t: "31s ago" },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-2" style={{ color: "rgba(255,255,255,0.5)" }}>
                      <span style={{ color: "#5bc4a0" }} className="text-[9px] w-12">{s.t}</span>
                      <span>{s.from}</span>
                      <span style={{ color: "rgba(255,255,255,0.15)" }}>&rarr;</span>
                      <span style={{ color: "#3690d2" }}>{s.to}</span>
                      <span className="text-[9px] ml-auto" style={{ color: "#5bc4a0" }}>&#10003;</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Card 3: Surveillance */}
              <Card customClass="p-6 cursor-pointer"
                style={{ background: "rgba(20,29,44,0.35)", backdropFilter: "blur(28px)", border: "1px solid rgba(255,255,255,0.14)" } as React.CSSProperties}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.55)" }}>Surveillance</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(54,144,210,0.12)", color: "#3690d2" }}>5 watchers</span>
                </div>
                <div className="space-y-2.5">
                  {[
                    { name: "Whale Alpha Fund", type: "whale", sim: 78 },
                    { name: "MEV Bot #4421", type: "bot", sim: 92 },
                    { name: "CryptoKOL_Max", type: "kol", sim: 65 },
                  ].map((w, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md flex items-center justify-center text-[7px] font-bold uppercase"
                        style={{ background: "rgba(54,144,210,0.1)", border: "1px solid rgba(54,144,210,0.15)", color: "#3690d2" }}>{w.type.slice(0, 2)}</div>
                      <span className="text-[11px] flex-1 truncate" style={{ color: "rgba(255,255,255,0.6)" }}>{w.name}</span>
                      <span className="text-[10px] font-bold" style={{ color: "rgba(255,255,255,0.7)" }}>{w.sim}%</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Card 4: Portfolio */}
              <Card customClass="p-6 cursor-pointer"
                style={{ background: "rgba(20,29,44,0.35)", backdropFilter: "blur(28px)", border: "1px solid rgba(255,255,255,0.14)" } as React.CSSProperties}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.55)" }}>Real vs Public</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-[9px] mb-1" style={{ color: "rgba(255,255,255,0.45)" }}>Your real allocation</div>
                    <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
                      <div className="rounded-full" style={{ width: "60%", background: "#3690d2" }} />
                      <div className="rounded-full" style={{ width: "25%", background: "#5bc4a0" }} />
                      <div className="rounded-full" style={{ width: "15%", background: "rgba(255,255,255,0.2)" }} />
                    </div>
                    <div className="flex gap-3 mt-1.5 text-[8px]" style={{ color: "rgba(255,255,255,0.5)" }}>
                      <span>ETH 60%</span><span>USDC 25%</span><span>ARB 15%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] mb-1" style={{ color: "rgba(255,255,255,0.45)" }}>What they see</div>
                    <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
                      <div className="rounded-full" style={{ width: "35%", background: "#3690d2" }} />
                      <div className="rounded-full" style={{ width: "22%", background: "rgba(255,255,255,0.25)" }} />
                      <div className="rounded-full" style={{ width: "18%", background: "rgba(255,255,255,0.15)" }} />
                      <div className="rounded-full" style={{ width: "12%", background: "rgba(255,255,255,0.1)" }} />
                      <div className="rounded-full" style={{ width: "13%", background: "rgba(255,255,255,0.07)" }} />
                    </div>
                    <div className="flex gap-2 mt-1.5 text-[8px]" style={{ color: "rgba(255,255,255,0.5)" }}>
                      <span>ETH 35%</span><span>LINK 22%</span><span>WBTC 18%</span><span>...</span>
                    </div>
                  </div>
                </div>
              </Card>
            </CardSwap>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
