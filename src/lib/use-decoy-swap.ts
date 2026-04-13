"use client";

import { useSendTransaction, useAccount } from "wagmi";
import { parseEther } from "viem";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Decoy target addresses — token contracts on X Layer to simulate interaction
const DECOY_TARGETS = [
  { address: "0x779ded0c9e1022225f8e0630b35a9b54be713736", symbol: "USDT" },
  { address: "0x5a77f1443d16ee5761d310e38b62f77f726bc71c", symbol: "WETH" },
  { address: "0xea034fb02eb1808c2cc3adbc15f447b93cbe08e1", symbol: "WBTC" },
  { address: "0x74b7f16337b8972027f6196a17a631ac6de26d22", symbol: "USDC" },
];

export function useDecoySwap() {
  const { address, isConnected } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!isConnected || !address) throw new Error("MetaMask not connected");

      // Pick random target and tiny amount
      const target = DECOY_TARGETS[Math.floor(Math.random() * DECOY_TARGETS.length)];
      const amount = (Math.random() * 0.005 + 0.001).toFixed(6);

      // Triggers MetaMask popup for signing
      const hash = await sendTransactionAsync({
        to: target.address as `0x${string}`,
        value: parseEther(amount),
      });

      // Record to server-side history
      await fetch("/api/decoy/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "record",
          txHash: hash,
          fromAddress: address,
          toAddress: target.address,
          amount,
          toSymbol: target.symbol,
        }),
      });

      return { hash, target: target.address, toSymbol: target.symbol, amount };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["decoy-history"] });
      qc.invalidateQueries({ queryKey: ["footprint"] });
      qc.invalidateQueries({ queryKey: ["wallet-balance"] });
    },
  });
}
