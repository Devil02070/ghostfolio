"use client";

import { useSendTransaction, useAccount } from "wagmi";
import { parseEther } from "viem";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Fake token labels for the decoy history display
const DECOY_LABELS = ["LINK", "WBTC", "USDT", "WETH", "USDC", "AAVE", "UNI", "CRV"];

export function useDecoySwap() {
  const { address, isConnected } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!isConnected || !address) throw new Error("Wallet not connected");

      // Pick random label and tiny amount
      const toSymbol = DECOY_LABELS[Math.floor(Math.random() * DECOY_LABELS.length)];
      const amount = (Math.random() * 0.003 + 0.001).toFixed(6);

      // Send OKB to self — creates real on-chain noise without losing funds
      // Observers see the TX but can't tell it's a self-transfer at a glance
      const hash = await sendTransactionAsync({
        to: address,
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
          toAddress: address,
          amount,
          toSymbol,
        }),
      });

      return { hash, target: address, toSymbol, amount };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["decoy-history"] });
      qc.invalidateQueries({ queryKey: ["footprint"] });
      qc.invalidateQueries({ queryKey: ["wallet-balance"] });
      qc.invalidateQueries({ queryKey: ["wagmi-balance"] });
    },
  });
}
