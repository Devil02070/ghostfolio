"use client";

import React from "react";

export default function StarBorder({
  children,
  className = "",
  color = "rgba(139, 92, 246, 0.7)",
  speed = "6s",
  as: Component = "button",
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  color?: string;
  speed?: string;
  as?: React.ElementType;
  [key: string]: unknown;
}) {
  return (
    <Component
      className={`star-border-container ${className}`}
      style={{ padding: "1px 0", ...((rest.style as React.CSSProperties) || {}) }}
      {...rest}
    >
      <div
        className="border-gradient-bottom"
        style={{ background: `radial-gradient(circle, ${color}, transparent 10%)`, animationDuration: speed }}
      />
      <div
        className="border-gradient-top"
        style={{ background: `radial-gradient(circle, ${color}, transparent 10%)`, animationDuration: speed }}
      />
      <div className="inner-content">{children}</div>
    </Component>
  );
}
