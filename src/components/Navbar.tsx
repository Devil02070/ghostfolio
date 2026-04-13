"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.1 }
    );
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl"
      style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm transition-transform group-hover:scale-105"
            style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}
          >
            G
          </div>
          <span className="text-base font-semibold gradient-text">
            GhostFolio
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {["Features", "How It Works", "Privacy", "Stack"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-sm transition-colors"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--text)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text-secondary)")
              }
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login" className="btn-primary text-sm px-5 py-2.5">
            Launch App
          </Link>
        </div>
      </div>
    </nav>
  );
}
