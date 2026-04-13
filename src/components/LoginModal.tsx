"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { xlayerTestnet } from "@/lib/wagmi-config";
import Logo from "./Logo";

/* ── Context ── */
const LoginModalCtx = createContext<{ open: () => void }>({ open: () => {} });
export const useLoginModal = () => useContext(LoginModalCtx);

/* ── Provider ── */
export function LoginModalProvider({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  const open = useCallback(() => setShow(true), []);
  const close = useCallback(() => setShow(false), []);

  return (
    <LoginModalCtx.Provider value={{ open }}>
      {children}
      {show && <LoginModalUI onClose={close} />}
    </LoginModalCtx.Provider>
  );
}

/* ── Modal UI ── */
type Step = "choose" | "email" | "otp" | "success";

function LoginModalUI({ onClose }: { onClose: () => void }) {
  const { login, verify } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<Step>("choose");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // MetaMask / wagmi
  const { isConnected, address, chain } = useAccount();
  const { connect, connectors, isPending: connectPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setError(""); setSubmitting(true);
    const r = await login(email.trim());
    setSubmitting(false);
    if (r.ok) setStep("otp");
    else setError(r.error || "Failed to send code");
  }

  async function handleOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!otp.trim()) return;
    setError(""); setSubmitting(true);
    const r = await verify(otp.trim());
    setSubmitting(false);
    if (r.ok) {
      setStep("success");
      setTimeout(() => { onClose(); router.push("/dashboard"); }, 1200);
    } else {
      setError(r.error || "Invalid code");
    }
  }

  function handleMetaMask() {
    const metamask = connectors.find((c) => c.name === "MetaMask") || connectors[0];
    if (!metamask) return;
    connect({ connector: metamask }, {
      onSuccess: () => {
        setStep("success");
        setTimeout(() => { onClose(); router.push("/dashboard"); }, 1200);
      },
      onError: (err) => {
        setError(err.message || "Failed to connect MetaMask");
      },
    });
  }

  function handleInjected() {
    const injected = connectors.find((c) => c.name === "Injected" || c.name === "Browser Wallet") || connectors[0];
    if (!injected) return;
    connect({ connector: injected }, {
      onSuccess: () => {
        setStep("success");
        setTimeout(() => { onClose(); router.push("/dashboard"); }, 1200);
      },
      onError: (err) => {
        setError(err.message || "Failed to connect wallet");
      },
    });
  }

  const Spinner = () => <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 cursor-pointer" onClick={step === "success" ? undefined : onClose}
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-[400px] mx-4">
        <div className="text-center mb-6">
          <div className="inline-block"><Logo size={44} /></div>
          <h2 className="text-xl font-bold text-white mt-3">CloakFi</h2>
        </div>

        <div style={{
          background: "rgba(20, 29, 44, 0.4)",
          backdropFilter: "blur(40px) saturate(1.3)",
          WebkitBackdropFilter: "blur(40px) saturate(1.3)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "24px",
          boxShadow: "0 24px 64px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
          padding: "2rem",
        }}>

          {/* ── Step: Choose Wallet ── */}
          {step === "choose" && (
            <>
              <div className="text-center mb-6">
                <h3 className="text-base font-semibold text-white">Connect Wallet</h3>
                <p className="text-xs mt-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>Choose how you want to connect</p>
              </div>

              {error && <div className="text-xs p-3 rounded-xl mb-4" style={{ background: "rgba(232,118,106,0.1)", color: "#e8766a" }}>{error}</div>}

              <div className="space-y-3">
                {/* MetaMask */}
                <button onClick={handleMetaMask} disabled={connectPending}
                  className="w-full flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #f6851b, #e2761b)" }}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path d="M21.3 2L13 8.2l1.5-3.6L21.3 2z" fill="#fff" />
                      <path d="M2.7 2L11 8.3 9.5 4.6 2.7 2z" fill="#fff" opacity="0.8" />
                      <path d="M18.5 17.3l-2 3 4.3 1.2 1.2-4.2h-3.5z" fill="#fff" />
                      <path d="M2 17.3l1.2 4.2L7.5 20.3l-2-3H2z" fill="#fff" opacity="0.8" />
                    </svg>
                  </div>
                  <div className="text-left flex-1">
                    <div className="text-sm font-semibold text-white">MetaMask</div>
                    <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.45)" }}>Browser extension wallet</div>
                  </div>
                  {connectPending && <Spinner />}
                  <svg className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(255,255,255,0.3)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* OKX Wallet / Injected */}
                <button onClick={handleInjected} disabled={connectPending}
                  className="w-full flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #000, #1a1a2e)", border: "1px solid rgba(255,255,255,0.15)" }}>
                    <span className="text-white text-xs font-bold">OKX</span>
                  </div>
                  <div className="text-left flex-1">
                    <div className="text-sm font-semibold text-white">OKX Wallet</div>
                    <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.45)" }}>Browser extension</div>
                  </div>
                  <svg className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(255,255,255,0.3)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 py-1">
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
                  <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>or</span>
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
                </div>

                {/* Agentic Wallet (Email) */}
                <button onClick={() => { setError(""); setStep("email"); }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-[1.01] cursor-pointer"
                  style={{ background: "rgba(54,144,210,0.08)", border: "1px solid rgba(54,144,210,0.15)" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #3690d2, #5bc4a0)" }}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div className="text-left flex-1">
                    <div className="text-sm font-semibold text-white">OKX Agentic Wallet</div>
                    <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.45)" }}>Email + OTP &middot; TEE Secured</div>
                  </div>
                  <svg className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(255,255,255,0.3)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </>
          )}

          {/* ── Step: Email (Agentic Wallet) ── */}
          {step === "email" && (
            <>
              <div className="text-center mb-6">
                <h3 className="text-base font-semibold text-white">Agentic Wallet</h3>
                <p className="text-xs mt-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>Sign in with your OKX Agentic Wallet</p>
              </div>
              <form onSubmit={handleEmail} className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider block mb-2 font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" required autoFocus
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all text-white placeholder:text-white/20"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                    onFocus={(e) => (e.target.style.borderColor = "#3690d2")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
                </div>
                {error && <div className="text-xs p-3 rounded-xl" style={{ background: "rgba(232,118,106,0.1)", color: "#e8766a" }}>{error}</div>}
                <button type="submit" disabled={submitting}
                  className="w-full py-3 text-sm font-semibold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
                  style={{ background: "#3690d2", color: "#fff", boxShadow: "0 4px 16px rgba(54,144,210,0.3)" }}>
                  {submitting ? <Spinner /> : "Send Verification Code"}
                </button>
                <button type="button" onClick={() => { setStep("choose"); setError(""); }}
                  className="w-full text-xs text-center py-2 transition-colors cursor-pointer" style={{ color: "rgba(255,255,255,0.35)" }}>
                  &larr; Back to wallet options
                </button>
              </form>
            </>
          )}

          {/* ── Step: OTP ── */}
          {step === "otp" && (
            <>
              <div className="text-center mb-6">
                <h3 className="text-base font-semibold text-white">Enter Code</h3>
                <p className="text-xs mt-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Code sent to <span style={{ color: "#3690d2" }}>{email}</span>
                </p>
              </div>
              <form onSubmit={handleOtp} className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider block mb-2 font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>6-Digit Code</label>
                  <input type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000" required autoFocus maxLength={6}
                    className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all text-center text-xl font-mono tracking-[0.5em] text-white placeholder:text-white/15"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                    onFocus={(e) => (e.target.style.borderColor = "#3690d2")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
                </div>
                {error && <div className="text-xs p-3 rounded-xl" style={{ background: "rgba(232,118,106,0.1)", color: "#e8766a" }}>{error}</div>}
                <button type="submit" disabled={submitting || otp.length < 6}
                  className="w-full py-3 text-sm font-semibold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
                  style={{ background: "#3690d2", color: "#fff", boxShadow: "0 4px 16px rgba(54,144,210,0.3)" }}>
                  {submitting ? <Spinner /> : "Verify & Connect"}
                </button>
                <button type="button" onClick={() => { setStep("email"); setOtp(""); setError(""); }}
                  className="w-full text-xs text-center py-2 transition-colors cursor-pointer" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Use a different email
                </button>
              </form>
            </>
          )}

          {/* ── Step: Success ── */}
          {step === "success" && (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ background: "rgba(91,196,160,0.12)", border: "1px solid rgba(91,196,160,0.2)" }}>
                <svg className="w-8 h-8" style={{ color: "#5bc4a0" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Connected</h3>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Redirecting to dashboard...</p>
            </div>
          )}
        </div>

        <p className="text-center text-[10px] mt-5" style={{ color: "rgba(255,255,255,0.2)" }}>
          Secured by OKX TEE &middot; Private key never leaves the enclave
        </p>
      </div>
    </div>
  );
}
