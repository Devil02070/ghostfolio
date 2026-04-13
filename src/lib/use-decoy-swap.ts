"use client";

import { useSendTransaction, useAccount } from "wagmi";
import { parseEther } from "viem";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Decoy targets — random wallet addresses to send tiny OKB as noise
// On testnet, contract addresses don't exist, so we use EOAs
const DECOY_TARGETS = [
  { address: "0x000000000000000000000000000000000000dEaD", symbol: "BURN" },
  { address: "0x1111111111111111111111111111111111111111", symbol: "LINK" },
  { address: "0x2222222222222222222222222222222222222222", symbol: "WBTC" },
  { address: "0x3333333333333333333333333333333333333333", symbol: "USDT" },
  { address: "0x4444444444444444444444444444444444444444", symbol: "WETH" },
  { address: "0x5555555555555555555555555555555555555555", symbol: "USDC" },
];

export function useDecoySwap() {
  const { address, isConnected } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!isConnected || !address) throw new Error("Wallet not connected");

      // Pick random target and tiny amount
      const target = DECOY_TARGETS[Math.floor(Math.random() * DECOY_TARGETS.length)];
      const amount = (Math.random() * 0.003 + 0.001).toFixed(6);

      // Triggers wallet popup for signing — simple native OKB transfer
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
      qc.invalidateQueries({ queryKey: ["wagmi-balance"] });
    },
  });
}
