"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import Logo from "@/components/Logo";

type Step = "email" | "otp" | "success";

export default function LoginPage() {
  const router = useRouter();
  const { loggedIn, login, verify, loading } = useAuth();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && loggedIn) router.push("/dashboard");
  }, [loggedIn, loading, router]);

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setError(""); setSubmitting(true);
    const result = await login(email.trim());
    setSubmitting(false);
    if (result.ok) setStep("otp");
    else setError(result.error || "Failed to send verification code");
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!otp.trim()) return;
    setError(""); setSubmitting(true);
    const result = await verify(otp.trim());
    setSubmitting(false);
    if (result.ok) { setStep("success"); setTimeout(() => router.push("/dashboard"), 1200); }
    else setError(result.error || "Invalid verification code");
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: "#0a0e1a" }}>
        <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: "rgba(255,255,255,0.08)", borderTopColor: "#3690d2" }} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden">
      {/* Background — same as dashboard */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-bottom bg-no-repeat scale-105"
          style={{ backgroundImage: "url('https://images.ctfassets.net/gy95mqeyjg28/6I3I5uvbA2JMkc6DvaTsPi/462e97fe09fff5b6f13ab4ff4023cda0/MCL60_Stealth_Mode_Side-Wide.jpg')", filter: "brightness(0.85) saturate(1.15)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(10,15,30,0.15), rgba(20,29,44,0.1))" }} />
      </div>

      {/* Glass login card */}
      <div className="relative z-10 w-full max-w-[420px] mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <Logo size={44} className="group-hover:scale-105 transition-transform" />
            <span className="text-xl font-bold text-white">CloakFi</span>
          </Link>
        </div>

        <div style={{
          background: "rgba(20, 29, 44, 0.25)",
          backdropFilter: "blur(40px) saturate(1.3)",
          WebkitBackdropFilter: "blur(40px) saturate(1.3)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "24px",
          boxShadow: "0 16px 48px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
          padding: "2rem",
        }}>
          {step === "email" && (
            <>
              <div className="text-center mb-6">
                <h1 className="text-lg font-semibold text-white">Connect Wallet</h1>
                <p className="text-xs mt-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Sign in with your OKX Agentic Wallet email
                </p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider block mb-2 font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoFocus
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all text-white placeholder:text-white/20"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#3690d2")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>

                {error && (
                  <div className="text-xs p-3 rounded-xl" style={{ background: "rgba(232,118,106,0.1)", color: "#e8766a" }}>
                    {error}
                  </div>
                )}

                <button type="submit" disabled={submitting}
                  className="w-full py-3 text-sm font-semibold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 transition-all hover:shadow-lg"
                  style={{ background: "#3690d2", color: "#fff", boxShadow: "0 4px 16px rgba(54,144,210,0.3)" }}>
                  {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Send Verification Code"}
                </button>
              </form>
            </>
          )}

          {step === "otp" && (
            <>
              <div className="text-center mb-6">
                <h1 className="text-lg font-semibold text-white">Enter Code</h1>
                <p className="text-xs mt-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Verification code sent to <span style={{ color: "#3690d2" }}>{email}</span>
                </p>
              </div>

              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider block mb-2 font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
                    6-Digit Code
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000"
                    required
                    autoFocus
                    maxLength={6}
                    className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all text-center text-xl font-mono tracking-[0.5em] text-white placeholder:text-white/15"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#3690d2")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>

                {error && (
                  <div className="text-xs p-3 rounded-xl" style={{ background: "rgba(232,118,106,0.1)", color: "#e8766a" }}>
                    {error}
                  </div>
                )}

                <button type="submit" disabled={submitting || otp.length < 6}
                  className="w-full py-3 text-sm font-semibold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 transition-all hover:shadow-lg"
                  style={{ background: "#3690d2", color: "#fff", boxShadow: "0 4px 16px rgba(54,144,210,0.3)" }}>
                  {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Verify & Connect"}
                </button>

                <button type="button" onClick={() => { setStep("email"); setOtp(""); setError(""); }}
                  className="w-full text-xs text-center py-2 transition-colors hover:text-white/60"
                  style={{ color: "rgba(255,255,255,0.35)" }}>
                  Use a different email
                </button>
              </form>
            </>
          )}

          {step === "success" && (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ background: "rgba(91,196,160,0.12)", border: "1px solid rgba(91,196,160,0.2)" }}>
                <svg className="w-8 h-8" style={{ color: "#5bc4a0" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-white mb-1">Connected</h2>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Redirecting to dashboard...</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] mt-6" style={{ color: "rgba(255,255,255,0.25)" }}>
          Secured by OKX TEE &middot; Private key never leaves the enclave
        </p>
      </div>
    </div>
  );
}
