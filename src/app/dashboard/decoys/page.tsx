"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useAccount } from "wagmi";
import { useDecoySettings, useUpdateDecoySettings, useDecoyHistory, useDecoyAction } from "@/lib/hooks";
import { useDecoySwap } from "@/lib/use-decoy-swap";
import ConnectWallet from "@/components/dashboard/ConnectWallet";

export default function DecoyControlPage() {
  const ref = useRef<HTMLDivElement>(null);
  const { data: s, isLoading: sL } = useDecoySettings();
  const up = useUpdateDecoySettings();
  const { data: h, isLoading: hL } = useDecoyHistory();
  const act = useDecoyAction();
  const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null);

  // MetaMask / wagmi
  const { isConnected: metamaskConnected } = useAccount();
  const decoySwap = useDecoySwap();

  useEffect(() => { if (sL) return; const ctx = gsap.context(() => { gsap.fromTo(".da", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power3.out" }); }, ref); return () => ctx.revert(); }, [sL]);

  const swaps = h?.swaps || [], gas = h?.totalGasSpent || 0, done = h?.completedSwaps || 0;
  const on = s?.enabled ?? false, bud = s?.dailyBudget ?? 5, mx = s?.maxSwapSize ?? 20, fr = s?.frequency ?? "moderate";

  const busy = act.isPending || decoySwap.isPending;

  async function sim() { setToast(null); const r = await act.mutateAsync({ mode: "simulate" }); setToast({ ok: r.ok, msg: r.ok ? `Simulated: ${r.data.swap.fromToken} → ${r.data.swap.toToken}` : r.error || "Failed" }); }

  async function exe() {
    setToast(null);
    if (metamaskConnected) {
      try {
        const result = await decoySwap.mutateAsync();
        setToast({ ok: true, msg: `TX via MetaMask: ${result.hash.slice(0, 18)}... (OKB → ${result.toSymbol})` });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setToast({ ok: false, msg: msg.includes("User rejected") ? "Transaction rejected" : msg });
      }
    } else {
      const r = await act.mutateAsync({ mode: "execute" });
      setToast({ ok: r.ok, msg: r.ok ? `TX: ${r.data.txHash?.slice(0, 18) || "pending"}... on X Layer` : r.error || "Failed" });
    }
  }

  if (sL) return <div className="flex items-center justify-center py-16"><div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: "rgba(54,144,210,0.08)", borderTopColor: "rgba(255,255,255,0.4)" }} /></div>;

  return (
    <div ref={ref}>
      <h2 className="text-lg font-bold mb-5" style={{ color: "#ffffff" }}>Decoy Control</h2>

      {toast && <div className="da mb-4 g-item p-3 text-[11px] flex items-center justify-between" style={{ color: "#ffffff" }}>
        <span>{toast.msg}</span><button onClick={() => setToast(null)} className="ml-2 text-lg opacity-40 hover:opacity-80">&times;</button>
      </div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <div className="da g-inner p-5"><div className="relative z-10">
          <div className="flex items-center justify-between mb-5">
            <span className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: "rgba(255,255,255,0.65)" }}>Engine</span>
            <button onClick={() => up.mutate({ enabled: !on })} className="g-toggle"
              style={{ background: on ? "#3690d2" : "rgba(54,144,210,0.06)" }}>
              <div className="g-toggle-knob" style={{ transform: on ? "translateX(24px)" : "translateX(2px)" }} />
            </button>
          </div>
          <div className="text-center mb-5">
            <span className="text-[11px] font-semibold flex items-center justify-center gap-2" style={{ color: on ? "#ffffff" : "rgba(255,255,255,0.5)" }}>
              <span className="w-2 h-2 rounded-full" style={{ background: on ? "#3690d2" : "rgba(54,144,210,0.12)", animation: on ? "soft-pulse 2s infinite" : "none" }} />
              {on ? "Active" : "Paused"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="g-well p-3 text-center rounded-2xl">
              <div className="text-lg font-bold" style={{ color: "#ffffff" }}>{done}</div>
              <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.65)" }}>Swaps</div>
            </div>
            <div className="g-well p-3 text-center rounded-2xl">
              <div className="text-lg font-bold" style={{ color: "#ffffff" }}>${gas.toFixed(2)}</div>
              <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.65)" }}>Spent</div>
            </div>
          </div>
        </div></div>

        <div className="da g-inner p-5"><div className="relative z-10">
          <span className="text-[9px] uppercase tracking-wider font-semibold block mb-5" style={{ color: "rgba(255,255,255,0.65)" }}>Budget</span>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-[11px] mb-2">
                <span style={{ color: "rgba(255,255,255,0.65)" }}>Daily</span>
                <span className="font-bold" style={{ color: "#ffffff" }}>${bud.toFixed(2)}</span>
              </div>
              <input type="range" min="1" max="20" step="0.5" value={bud} onChange={(e) => up.mutate({ dailyBudget: parseFloat(e.target.value) })} className="g-range" />
            </div>
            <div>
              <div className="flex justify-between text-[11px] mb-2">
                <span style={{ color: "rgba(255,255,255,0.65)" }}>Max Swap</span>
                <span className="font-bold" style={{ color: "#ffffff" }}>${mx}</span>
              </div>
              <input type="range" min="2" max="50" step="1" value={mx} onChange={(e) => up.mutate({ maxSwapSize: parseInt(e.target.value) })} className="g-range" />
            </div>
            <div>
              <div className="flex justify-between text-[10px] mb-1.5">
                <span style={{ color: "rgba(255,255,255,0.65)" }}>Today</span>
                <span style={{ color: "rgba(255,255,255,0.65)" }}>${gas.toFixed(2)} / ${bud.toFixed(2)}</span>
              </div>
              <div className="h-1.5 rounded-full g-well overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, (gas / bud) * 100)}%`, background: "rgba(54,144,210,0.4)" }} />
              </div>
            </div>
          </div>
        </div></div>

        <div className="da g-inner p-5"><div className="relative z-10">
          <span className="text-[9px] uppercase tracking-wider font-semibold block mb-4" style={{ color: "rgba(255,255,255,0.65)" }}>Strategy</span>
          <div className="space-y-1.5 mb-4">
            {(["conservative", "moderate", "aggressive"] as const).map((f) => (
              <button key={f} onClick={() => up.mutate({ frequency: f })}
                className="w-full text-left px-3.5 py-2.5 rounded-2xl transition-all"
                style={{
                  background: fr === f ? "rgba(54,144,210,0.08)" : "transparent",
                  border: `1px solid rgba(255,255,255,${fr === f ? "0.15" : "0.04"})`,
                  color: fr === f ? "#ffffff" : "rgba(255,255,255,0.5)",
                }}>
                <div className="text-[11px] font-semibold capitalize">{f}</div>
                <div className="text-[8px] mt-0.5 opacity-50">{f === "conservative" ? "1-3/day" : f === "moderate" ? "4-8/day" : "10-20/day"}</div>
              </button>
            ))}
          </div>

          {/* MetaMask connection for testnet swaps */}
          <div className="mb-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="text-[9px] uppercase tracking-wider font-semibold mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>
              Swap Wallet (X Layer Testnet)
            </div>
            <ConnectWallet />
          </div>

          <div className="space-y-2">
            <button onClick={sim} disabled={busy} className="g-btn w-full py-2.5 text-[10px] flex items-center justify-center gap-2 disabled:opacity-50">
              {act.isPending && <div className="w-3 h-3 border-2 rounded-full animate-spin" style={{ borderColor: "rgba(54,144,210,0.08)", borderTopColor: "rgba(255,255,255,0.4)" }} />} Simulate
            </button>
            <button onClick={exe} disabled={busy}
              className="w-full py-2.5 text-[10px] font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
              style={{
                background: metamaskConnected ? "rgba(246,133,27,0.12)" : "rgba(255,255,255,0.12)",
                border: `1px solid ${metamaskConnected ? "rgba(246,133,27,0.25)" : "rgba(54,144,210,0.15)"}`,
                color: "#ffffff",
                backdropFilter: "blur(8px)",
              }}>
              {busy && <div className="w-3 h-3 border-2 rounded-full animate-spin" style={{ borderColor: "rgba(54,144,210,0.12)", borderTopColor: "#3690d2" }} />}
              {metamaskConnected ? "Execute via Wallet" : "Execute Swap"}
            </button>
          </div>
        </div></div>
      </div>

      <div className="da g-inner p-5"><div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold" style={{ color: "#ffffff" }}>History</span>
          <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.65)" }}>{swaps.length} swaps</span>
        </div>
        {hL ? <div className="flex justify-center py-4"><div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: "rgba(54,144,210,0.08)", borderTopColor: "rgba(255,255,255,0.4)" }} /></div>
        : swaps.length === 0 ? <p className="text-[10px] text-center py-4" style={{ color: "rgba(255,255,255,0.65)" }}>No swaps yet</p>
        : <div className="overflow-x-auto"><table className="w-full">
          <thead><tr>{["Time", "From", "To", "Amt", "Status", "TX"].map((x) => <th key={x} className="text-left text-[9px] font-semibold py-2 px-3" style={{ color: "rgba(255,255,255,0.65)", borderBottom: "1px solid rgba(20,29,44,0.04)" }}>{x}</th>)}</tr></thead>
          <tbody>{swaps.map((x: { id: string; timestamp: string; fromToken: string; toToken: string; amount: string; status: string; txHash?: string; chain?: string }) => {
            const isTestnet = x.chain === "X Layer Testnet";
            const explorerBase = isTestnet ? "https://www.okx.com/explorer/xlayer-test" : "https://www.okx.com/explorer/xlayer";
            return (
              <tr key={x.id} className="g-row" style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                <td className="py-2 px-3 text-[10px]" style={{ color: "rgba(255,255,255,0.65)" }}>{new Date(x.timestamp).toLocaleTimeString()}</td>
                <td className="py-2 px-3 text-[10px] font-semibold" style={{ color: "#ffffff" }}>{x.fromToken}</td>
                <td className="py-2 px-3 text-[10px]" style={{ color: "rgba(255,255,255,0.65)" }}>&rarr; {x.toToken}</td>
                <td className="py-2 px-3 text-[10px]" style={{ color: "rgba(255,255,255,0.65)" }}>{x.amount}</td>
                <td className="py-2 px-3 text-[9px] font-semibold capitalize" style={{ color: "rgba(255,255,255,0.65)" }}>{x.status}</td>
                <td className="py-2 px-3 text-[9px] font-mono" style={{ color: x.txHash ? "#3690d2" : "rgba(255,255,255,0.5)" }}>
                  {x.txHash ? <a href={`${explorerBase}/tx/${x.txHash}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{x.txHash.slice(0, 10)}...</a> : "—"}
                </td>
              </tr>
            );
          })}</tbody></table></div>}
      </div></div>
    </div>
  );
}
