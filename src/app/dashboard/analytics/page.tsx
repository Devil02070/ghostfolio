"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useAnalytics } from "@/lib/hooks";
import CountUp from "@/components/reactbits/CountUp";

function Chart({ data, dk, h = 110 }: { data: Record<string, number | string>[]; dk: string; h?: number }) {
  if (data.length < 2) return <div className="flex items-center justify-center g-well rounded-2xl" style={{ height: h + 16 }}><span className="text-[10px]" style={{ color: "rgba(255,255,255,0.65)" }}>Waiting for data...</span></div>;
  const v = data.map((d) => Number(d[dk]) || 0), mx = Math.max(...v), mn = Math.min(...v), rg = mx - mn || 1;
  const pts = v.map((val, i) => `${(i / (v.length - 1)) * 100},${h - ((val - mn) / rg) * (h - 20) - 10}`).join(" ");
  return (
    <div className="g-well rounded-2xl p-3" style={{ height: h + 24 }}>
      <svg viewBox={`0 0 100 ${h}`} className="w-full h-full" preserveAspectRatio="none">
        <defs><linearGradient id={`cg-${dk}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgba(54,144,210,0.15)" /><stop offset="100%" stopColor="rgba(255,255,255,0)" /></linearGradient></defs>
        <polygon points={`0,${h} ${pts} 100,${h}`} fill={`url(#cg-${dk})`} />
        <polyline points={pts} fill="none" stroke="#3690d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 4px rgba(54,144,210,0.15))" }} />
        {v.map((val, i) => <circle key={i} cx={(i / (v.length - 1)) * 100} cy={h - ((val - mn) / rg) * (h - 20) - 10} r="2.5" fill="#3690d2" />)}
      </svg>
    </div>
  );
}

function Bars({ data, dk, h = 110 }: { data: Record<string, number | string>[]; dk: string; h?: number }) {
  if (data.length === 0) return <div className="flex items-center justify-center g-well rounded-2xl" style={{ height: h + 16 }}><span className="text-[10px]" style={{ color: "rgba(255,255,255,0.65)" }}>No data</span></div>;
  const v = data.map((d) => Number(d[dk]) || 0), mx = Math.max(...v) || 1, bw = Math.min(10, 100 / v.length - 3);
  return (
    <div className="g-well rounded-2xl p-3" style={{ height: h + 24 }}>
      <svg viewBox={`0 0 100 ${h}`} className="w-full h-full" preserveAspectRatio="none">
        {v.map((val, i) => { const bH = (val / mx) * (h - 12); return <rect key={i} x={(i / v.length) * 100 + 1.5} y={h - bH - 4} width={bw} height={bH} rx="4" fill={`rgba(255,255,255,${0.12 + (i / v.length) * 0.2})`} />; })}
      </svg>
    </div>
  );
}

export default function AnalyticsPage() {
  const ref = useRef<HTMLDivElement>(null);
  const { data, isLoading } = useAnalytics();
  useEffect(() => { if (isLoading) return; const ctx = gsap.context(() => { gsap.fromTo(".da", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power3.out" }); }, ref); return () => ctx.revert(); }, [isLoading]);

  if (isLoading) return <div className="flex items-center justify-center py-16"><div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: "rgba(255,255,255,0.08)", borderTopColor: "#3690d2" }} /></div>;

  const ph = data?.privacyHistory || [], dc = data?.dailyCosts || [];
  const tc = data?.totalDecoyCost || 0, ls = data?.latestPrivacyScore || 0, sg = data?.scoreGain || 0, cpp = data?.costPerPoint || 0, ts = data?.totalSwaps || 0, wc = data?.surveillance?.watcherCount || 0;

  return (
    <div ref={ref}>
      <h2 className="text-lg font-bold mb-5" style={{ color: "#ffffff" }}>Analytics</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { l: "Privacy", n: ls, su: sg > 0 ? `+${sg}` : "—" },
          { l: "Cost", n: tc, p: "$", su: `${ts} swaps` },
          { l: "Watchers", n: wc, su: data?.surveillance?.currentThreat || "—" },
          { l: "Efficiency", n: cpp, p: "$", su: "/point" },
        ].map((s, i) => (
          <div key={i} className="da g-stat-pill">
            <div className="relative z-10">
              <div className="text-[8px] uppercase tracking-wider mb-1" style={{ color: "rgba(255,255,255,0.65)" }}>{s.l}</div>
              <div className="text-xl font-bold" style={{ color: "#ffffff" }}><CountUp to={s.n} duration={2} delay={i * 0.1} prefix={s.p || ""} /></div>
              <div className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.65)" }}>{s.su}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        <div className="da g-inner p-5"><div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold" style={{ color: "#ffffff" }}>Privacy Score</span>
            {sg > 0 && <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.65)" }}>+{sg}</span>}
          </div>
          <Chart data={ph} dk="score" />
        </div></div>
        <div className="da g-inner p-5"><div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold" style={{ color: "#ffffff" }}>Daily Cost</span>
            <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.65)" }}>${tc.toFixed(2)} total</span>
          </div>
          <Bars data={dc} dk="cost" />
        </div></div>
      </div>

      {(ph.length > 0 || ts > 0) && (
        <div className="da g-inner p-5"><div className="relative z-10 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <svg className="w-4 h-4" style={{ color: "rgba(255,255,255,0.65)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <h3 className="text-[11px] font-bold mb-1" style={{ color: "#ffffff" }}>Insight</h3>
            <p className="text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
              {ts === 0 ? "Deploy your first decoy to start building privacy." : <>{ts} swaps for ${tc.toFixed(2)}.{sg > 0 && <> Score +{sg} at ${cpp.toFixed(2)}/pt.</>}</>}
            </p>
          </div>
        </div></div>
      )}
    </div>
  );
}
