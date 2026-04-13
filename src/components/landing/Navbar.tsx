"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Logo from "@/components/Logo";
import { useLoginModal } from "@/components/LoginModal";

const links = [
  { href: "#features", label: "Features" },
  { href: "#live", label: "Live" },
  { href: "#testimonials", label: "Proof" },
  { href: "#cta", label: "Get Started" },
];

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { open: openLogin } = useLoginModal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: scrolled ? "rgba(20,29,44,0.3)" : "transparent",
          backdropFilter: scrolled ? "blur(28px) saturate(1.2)" : "blur(0px)",
          WebkitBackdropFilter: scrolled ? "blur(28px) saturate(1.2)" : "blur(0px)",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.1)" : "1px solid transparent",
          transition: "background 0.5s ease, backdrop-filter 0.5s ease, -webkit-backdrop-filter 0.5s ease, border-color 0.5s ease",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5 group">
              <Logo size={36} className="group-hover:scale-105 transition-transform" />
              <span className="text-[15px] font-semibold text-white">CloakFi</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {links.map((l) => (
                <a key={l.href} href={l.href} className="px-4 py-2 text-[13px] rounded-lg transition-colors duration-300"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.45)"; e.currentTarget.style.background = "transparent"; }}>
                  {l.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button onClick={openLogin} className="hidden sm:inline-flex text-[13px] font-semibold px-5 py-2 rounded-xl transition-all hover:shadow-lg cursor-pointer"
                style={{ background: "#3690d2", color: "#fff", boxShadow: "0 4px 16px rgba(54,144,210,0.25)" }}>
                Connect Wallet
              </button>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg">
                <div className="space-y-1.5">
                  <div className={`w-5 h-px bg-white/60 transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-[3px]" : ""}`} />
                  <div className={`w-5 h-px bg-white/60 transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-[4px]" : ""}`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-4 top-20 z-50 rounded-2xl p-4 md:hidden"
            style={{ background: "rgba(20,29,44,0.6)", backdropFilter: "blur(28px)", border: "1px solid rgba(255,255,255,0.12)" }}>
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm rounded-lg" style={{ color: "rgba(255,255,255,0.7)" }}>{l.label}</a>
            ))}
            <button onClick={() => { setMobileOpen(false); openLogin(); }} className="block w-full text-center mt-3 text-sm py-3 rounded-xl font-semibold cursor-pointer"
              style={{ background: "#3690d2", color: "#fff" }}>Connect Wallet</button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
