"use client";

import { useRef, useEffect } from "react";
import { motion, useMotionValue, useAnimationFrame, useTransform } from "framer-motion";

export default function ShinyText({
  text,
  speed = 2,
  className = "",
  color = "#b5b5b5a0",
  shineColor = "#ffffff",
  spread = 120,
}: {
  text: string;
  speed?: number;
  className?: string;
  color?: string;
  shineColor?: string;
  spread?: number;
}) {
  const progress = useMotionValue(0);
  const lastTimeRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);
  const dur = speed * 1000;

  useAnimationFrame((time) => {
    if (lastTimeRef.current === null) { lastTimeRef.current = time; return; }
    elapsedRef.current += time - lastTimeRef.current;
    lastTimeRef.current = time;
    const cycleTime = elapsedRef.current % dur;
    progress.set((cycleTime / dur) * 100);
  });

  const backgroundPosition = useTransform(progress, (p) => `${150 - p * 2}% center`);

  return (
    <motion.span
      className={className}
      style={{
        backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,
        backgroundSize: "200% auto",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundPosition,
        display: "inline-block",
      }}
    >
      {text}
    </motion.span>
  );
}
