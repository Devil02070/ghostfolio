"use client";

import Image from "next/image";

export default function Logo({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/cloakfi-logo.png"
        alt="CloakFi"
        width={size}
        height={size}
        priority
        style={{ width: size, height: size, objectFit: "contain" }}
      />
    </div>
  );
}
