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
        {/* Shield with lock — privacy/cloak */}
        <path
          d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"
          fill="white"
          fillOpacity="0.9"
        />
        <path
          d="M12 8a2 2 0 00-2 2v1h-.5a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h5a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5H14v-1a2 2 0 00-2-2zm1 3h-2v-1a1 1 0 112 0v1z"
          fill="#3690d2"
        />
      </svg>
    </div>
  );
}
