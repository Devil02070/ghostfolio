"use client";

export default function Logo({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-xl ${className}`}
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #3690d2, #5bc4a0)",
        boxShadow: "0 4px 12px rgba(54,144,210,0.3)",
      }}
    >
      <svg
        width={size * 0.55}
        height={size * 0.55}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Ghost/stealth shield icon */}
        <path
          d="M12 2C7.03 2 3 6.03 3 11v5.5c0 1.1.45 2.1 1.17 2.83L6 21.5V18l1.5-1.5L9 18l1.5-1.5L12 18l1.5-1.5L15 18l1.5-1.5L18 18v3.5l1.83-2.17C20.55 18.6 21 17.6 21 16.5V11c0-4.97-4.03-9-9-9z"
          fill="white"
          fillOpacity="0.9"
        />
        {/* Eyes */}
        <circle cx="9" cy="11" r="1.5" fill="#3690d2" />
        <circle cx="15" cy="11" r="1.5" fill="#3690d2" />
      </svg>
    </div>
  );
}
