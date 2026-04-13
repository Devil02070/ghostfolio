"use client";

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { xlayerTestnet } from "@/lib/wagmi-config";

export default function ConnectWallet() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  const wrongChain = isConnected && chain?.id !== xlayerTestnet.id;

  if (isConnected && address) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-bold"
            style={{ background: "linear-gradient(135deg, #f6851b, #e2761b)", color: "#fff" }}>M</div>
          <span className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.7)" }}>
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          <span className="text-[8px] px-2 py-0.5 rounded-full"
            style={{
              background: wrongChain ? "rgba(232,118,106,0.12)" : "rgba(91,196,160,0.12)",
              color: wrongChain ? "#e8766a" : "#5bc4a0",
              border: `1px solid ${wrongChain ? "rgba(232,118,106,0.2)" : "rgba(91,196,160,0.2)"}`,
            }}>
            {wrongChain ? "Wrong Network" : "X Layer Testnet"}
          </span>
          <button onClick={() => disconnect()} className="text-[9px] hover:underline cursor-pointer"
            style={{ color: "rgba(255,255,255,0.4)" }}>
            ×
          </button>
        </div>
        {wrongChain && (
          <button onClick={() => switchChain({ chainId: xlayerTestnet.id })}
            className="w-full text-[10px] py-1.5 rounded-lg font-semibold cursor-pointer transition-all"
            style={{ background: "rgba(232,118,106,0.12)", border: "1px solid rgba(232,118,106,0.2)", color: "#e8766a" }}>
            Switch to X Layer Testnet
          </button>
        )}
      </div>
    );
  }

  const metamask = connectors.find((c) => c.name === "MetaMask") || connectors[0];

  return (
    <button
      onClick={() => connect({ connector: metamask })}
      disabled={isPending}
      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-semibold transition-all cursor-pointer disabled:opacity-50"
      style={{
        background: "rgba(246,133,27,0.1)",
        border: "1px solid rgba(246,133,27,0.2)",
        color: "#f6851b",
      }}>
      {isPending ? (
        <div className="w-3 h-3 border-2 rounded-full animate-spin"
          style={{ borderColor: "rgba(246,133,27,0.2)", borderTopColor: "#f6851b" }} />
      ) : (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
          <path d="M21.3 2L13 8.2l1.5-3.6L21.3 2z" fill="#E2761B" />
          <path d="M2.7 2L11 8.3 9.5 4.6 2.7 2z" fill="#E4761B" />
          <path d="M18.5 17.3l-2 3 4.3 1.2 1.2-4.2h-3.5z" fill="#E4761B" />
          <path d="M2 17.3l1.2 4.2L7.5 20.3l-2-3H2z" fill="#E4761B" />
        </svg>
      )}
      Connect MetaMask
    </button>
  );
}
