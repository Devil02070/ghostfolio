"use client";

/* Reusable SVG vector shapes for decoration */

export function GradientOrb({
  className = "",
  color1 = "var(--accent)",
  color2 = "var(--accent-2)",
}: {
  className?: string;
  color1?: string;
  color2?: string;
}) {
  return (
    <div
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={{
        background: `radial-gradient(circle, ${color1}15, ${color2}08, transparent 70%)`,
        filter: "blur(60px)",
      }}
    />
  );
}

export function GridPattern({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`absolute pointer-events-none ${className}`}
      width="400"
      height="400"
      viewBox="0 0 400 400"
      fill="none"
    >
      {Array.from({ length: 11 }, (_, i) => (
        <line
          key={`h${i}`}
          x1="0"
          y1={i * 40}
          x2="400"
          y2={i * 40}
          stroke="var(--text)"
          strokeOpacity="0.03"
          strokeWidth="1"
        />
      ))}
      {Array.from({ length: 11 }, (_, i) => (
        <line
          key={`v${i}`}
          x1={i * 40}
          y1="0"
          x2={i * 40}
          y2="400"
          stroke="var(--text)"
          strokeOpacity="0.03"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}

export function FloatingShapes({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`absolute pointer-events-none ${className}`}
      width="600"
      height="600"
      viewBox="0 0 600 600"
      fill="none"
    >
      {/* Triangle */}
      <path
        d="M300 80L340 150H260L300 80Z"
        stroke="var(--accent)"
        strokeOpacity="0.08"
        strokeWidth="1"
      />
      {/* Circle */}
      <circle
        cx="480"
        cy="200"
        r="30"
        stroke="var(--accent-2)"
        strokeOpacity="0.06"
        strokeWidth="1"
      />
      {/* Diamond */}
      <rect
        x="100"
        y="300"
        width="35"
        height="35"
        rx="2"
        transform="rotate(45 117 317)"
        stroke="var(--accent-3)"
        strokeOpacity="0.06"
        strokeWidth="1"
      />
      {/* Cross */}
      <path
        d="M500 400v30M485 415h30"
        stroke="var(--accent)"
        strokeOpacity="0.06"
        strokeWidth="1"
      />
      {/* Dots cluster */}
      <circle cx="150" cy="150" r="2" fill="var(--accent)" fillOpacity="0.06" />
      <circle cx="160" cy="145" r="1.5" fill="var(--accent-2)" fillOpacity="0.06" />
      <circle cx="155" cy="160" r="1" fill="var(--accent-3)" fillOpacity="0.06" />
      {/* Curved line */}
      <path
        d="M50 500C100 480 200 520 300 480S500 440 550 480"
        stroke="var(--accent)"
        strokeOpacity="0.04"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}

export function WaveDecoration({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`absolute pointer-events-none w-full ${className}`}
      viewBox="0 0 1440 100"
      preserveAspectRatio="none"
      fill="none"
    >
      <path
        d="M0 50C240 20 480 80 720 50C960 20 1200 80 1440 50V100H0V50Z"
        fill="var(--bg-subtle)"
        fillOpacity="0.5"
      />
    </svg>
  );
}
