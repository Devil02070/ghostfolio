"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useSurveillance } from "@/lib/hooks";
import { useQueryClient } from "@tanstack/react-query";

export default function SurveillancePage() {
  const ref = useRef<HTMLDivElement>(null);
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const { data, isLoading } = useSurveillance();

  async function scan() { setBusy(true); await fetch("/api/surveillance?refresh=true"); qc.invalidateQueries({ queryKey: ["surveillance"] }); setBusy(false); }

  useEffect(() => { if (isLoading) return; const ctx = gsap.context(() => { gsap.fromTo(".da", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power3.out" }); }, ref); return () => ctx.revert(); }, [isLoading]);

  const w = data?.watchers || [], tl = data?.timeline || [], threat = data?.threatLevel || "unknown";
  const exp = data?.exposureScore || 0, hiSim = w.filter((x: { similarity: number }) => x.similarity > 70).length;
  const Spin = () => <div className="flex items-center justify-center py-16"><div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: "rgba(54,144,210,0.08)", borderTopColor: "rgba(255,255,255,0.4)" }} /></div>;

  return (
    <div ref={ref}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold" style={{ color: "#ffffff" }}>Surveillance</h2>
          <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.65)" }}>{data?.lastScanned ? `Scanned ${new Date(data.lastScanned).toLocaleTimeString()}` : "Scanning..."}</p>
        </div>
        <button onClick={scan} disabled={busy} className="g-btn text-[10px] flex items-center gap-2 disabled:opacity-50">
          {busy ? <div className="w-3 h-3 border-2 rounded-full animate-spin" style={{ borderColor: "rgba(54,144,210,0.08)", borderTopColor: "rgba(255,255,255,0.4)" }} /> :
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>}
          Scan
        </button>
      </div>
      {isLoading ? <Spin /> : (<>
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div className="da g-stat-pill">
            <div className="relative z-10">
              <div className="text-[9px] uppercase tracking-wider mb-1" style={{ color: "rgba(255,255,255,0.65)" }}>Threat</div>
              <div className="text-2xl font-bold capitalize" style={{ color: "#ffffff" }}>{threat}</div>
              <div className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.65)" }}>{w.length} watchers</div>
            </div>
          </div>
          <div className="da g-stat-pill">
            <div className="relative z-10">
              <div className="text-[9px] uppercase tracking-wider mb-1" style={{ color: "rgba(255,255,255,0.65)" }}>Copiers</div>
              <div className="text-2xl font-bold" style={{ color: "#ffffff" }}>{hiSim}</div>
              <div className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.65)" }}>{hiSim > 0 ? "Active" : "None"}</div>
            </div>
          </div>
          <div className="da g-stat-pill">
            <div className="relative z-10">
              <div className="text-[9px] uppercase tracking-wider mb-1" style={{ color: "rgba(255,255,255,0.65)" }}>Exposure</div>
              <div className="text-2xl font-bold" style={{ color: "#ffffff" }}>{exp}%</div>
              <div className="mt-2 h-1.5 rounded-full g-well overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${exp}%`, background: "#3690d2" }} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="da g-inner p-5 lg:col-span-3"><div className="relative z-10">
            <h3 className="text-xs font-semibold mb-4" style={{ color: "#ffffff" }}>Watchers ({w.length})</h3>
            {w.length === 0 ? <p className="text-[10px] text-center py-6" style={{ color: "rgba(255,255,255,0.65)" }}>None detected</p> : (
              <div className="space-y-2">{w.map((x: { address: string; label: string; type: string; similarity: number }, i: number) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-2xl g-item">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[8px] font-bold uppercase"
                    style={{ background: "rgba(54,144,210,0.12)", border: "1px solid rgba(54,144,210,0.08)", color: "rgba(255,255,255,0.65)" }}>
                    {x.type.slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-semibold truncate" style={{ color: "#ffffff" }}>{x.label}</div>
                    <div className="text-[9px]" style={{ color: "rgba(255,255,255,0.65)" }}>{x.address.slice(0, 12)}...</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] font-bold" style={{ color: "#ffffff" }}>{x.similarity}%</div>
                    <div className="w-14 h-1 rounded-full mt-1 g-well overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${x.similarity}%`, background: `rgba(255,255,255,${x.similarity > 70 ? 0.6 : 0.3})` }} />
                    </div>
                  </div>
                </div>
              ))}</div>
            )}
          </div></div>

          <div className="da g-inner p-5 lg:col-span-2"><div className="relative z-10">
            <h3 className="text-xs font-semibold mb-4" style={{ color: "#ffffff" }}>Activity</h3>
            {tl.length === 0 ? <p className="text-[10px] text-center py-6" style={{ color: "rgba(255,255,255,0.65)" }}>No activity</p> : (
              <div>{tl.map((e: { time: string; event: string }, i: number) => (
                <div key={i} className="flex gap-3 pb-4 last:pb-0 relative">
                  {i < tl.length - 1 && <div className="absolute left-[5px] top-4 bottom-0 w-px" style={{ background: "rgba(54,144,210,0.12)" }} />}
                  <div className="w-3 h-3 rounded-full flex-shrink-0 mt-1" style={{ background: "rgba(54,144,210,0.12)", border: "1px solid rgba(54,144,210,0.18)" }} />
                  <div>
                    <div className="text-[9px]" style={{ color: "rgba(255,255,255,0.65)" }}>{new Date(e.time).toLocaleTimeString()}</div>
                    <div className="text-[10px] leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>{e.event}</div>
                  </div>
                </div>
              ))}</div>
            )}
          </div></div>
        </div>
      </>)}
    </div>
  );
}
