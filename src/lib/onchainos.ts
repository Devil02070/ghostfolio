import { execFile } from "child_process";
import { existsSync } from "fs";
import path from "path";

const ONCHAINOS_BIN =
  process.platform === "win32"
    ? path.join(process.env.USERPROFILE || process.env.HOME || "", ".local", "bin", "onchainos.exe")
    : path.join(process.env.HOME || "", ".local", "bin", "onchainos");

const CLI_AVAILABLE = existsSync(ONCHAINOS_BIN);

export interface OnchainResult<T = unknown> {
  ok: boolean;
  data: T;
  error?: string;
}

export async function runOnchainos(args: string[]): Promise<OnchainResult> {
  if (!CLI_AVAILABLE) {
    return { ok: false, data: null, error: "onchainos CLI not installed" };
  }
  return new Promise((resolve) => {
    execFile(ONCHAINOS_BIN, args, { timeout: 45000, maxBuffer: 2 * 1024 * 1024 }, (error, stdout, stderr) => {
      const output = stdout || stderr || "";
      try {
        const parsed = JSON.parse(output);
        resolve(parsed);
      } catch {
        if (error) {
          resolve({ ok: false, data: null, error: output || error.message });
        } else {
          resolve({ ok: true, data: output });
        }
      }
    });
  });
}

// ── Wallet ──

export const walletStatus = () => runOnchainos(["wallet", "status"]);
export const walletLogin = (email: string, locale = "en-US") => runOnchainos(["wallet", "login", email, "--locale", locale]);
export const walletVerify = (otp: string) => runOnchainos(["wallet", "verify", otp]);
export const walletLogout = () => runOnchainos(["wallet", "logout"]);
export const walletAddresses = () => runOnchainos(["wallet", "addresses"]);

export function walletBalance(chain?: string) {
  const args = ["wallet", "balance"];
  if (chain) args.push("--chain", chain);
  return runOnchainos(args);
}

export function walletHistory(chain?: string, limit = "20") {
  const args = ["wallet", "history", "--limit", limit];
  if (chain) args.push("--chain", chain);
  return runOnchainos(args);
}

// ── Swap ──

export function swapQuote(params: { from: string; to: string; readableAmount: string; chain: string }) {
  return runOnchainos([
    "swap", "quote",
    "--from", params.from,
    "--to", params.to,
    "--readable-amount", params.readableAmount,
    "--chain", params.chain,
  ]);
}

export function swapExecute(params: { from: string; to: string; readableAmount: string; chain: string; wallet: string; slippage?: string }) {
  const args = [
    "swap", "execute",
    "--from", params.from,
    "--to", params.to,
    "--readable-amount", params.readableAmount,
    "--chain", params.chain,
    "--wallet", params.wallet,
  ];
  if (params.slippage) args.push("--slippage", params.slippage);
  return runOnchainos(args);
}

// ── Market ──

export function tokenPrice(tokenAddress: string, chain: string) {
  return runOnchainos(["market", "price", "--chain", chain, "--token", tokenAddress]);
}

export function portfolioOverview(address: string, chain: string) {
  return runOnchainos(["market", "portfolio-overview", "--chain", chain, "--address", address]);
}

// ── Signal ──

export function signalList(chain: string) {
  return runOnchainos(["signal", "list", "--chain", chain]);
}

// ── Token ──

export function tokenSearch(query: string, chain: string) {
  return runOnchainos(["token", "search", "--chain", chain, "--query", query]);
}

export function tokenInfo(address: string, chain: string) {
  return runOnchainos(["token", "info", "--chain", chain, "--token", address]);
}

export function tokenAdvancedInfo(address: string, chain: string) {
  return runOnchainos(["token", "advanced-info", "--chain", chain, "--token", address]);
}

export function hotTokens(chain: string) {
  return runOnchainos(["token", "hot-tokens", "--chain", chain]);
}

// ── Security ──

export function securityTokenScan(chain?: string) {
  const args = ["security", "token-scan"];
  if (chain) args.push("--chain", chain);
  return runOnchainos(args);
}

// ── Gateway ──

export function gasPrice(chain: string) {
  return runOnchainos(["gateway", "gas", "--chain", chain]);
}
