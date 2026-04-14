# CloakFi

> **On-chain privacy shield for crypto traders.** CloakFi masks your real trading strategy from wallet trackers, whales, and copy-trading bots by executing randomized decoy swaps on X Layer — pulling your public footprint away from your actual holdings.

Built for the **OKX Build X Hackathon — Season 2** (X Layer Arena).

---

## Why CloakFi

Every on-chain trade you make is public. Whale trackers, Smart Money dashboards, and copy-trading bots watch successful wallets and front-run, mirror, or exit-liquidity their trades within minutes. Privacy tools today focus on *hiding* transactions (mixers, zk-wallets). CloakFi does the opposite: it adds **plausible noise** — cheap, harmless swaps into tokens you don't actually hold — so anyone profiling your wallet draws the wrong conclusions about your real strategy.

Your actual portfolio stays untouched. Only the public *appearance* of it shifts.

---

## How It Works

```
Real holdings:     60% ETH · 25% USDC · 15% ARB
                            │
                            ▼
         ┌──────────────────────────────────┐
         │   CloakFi Decoy Engine (X Layer) │
         │   $2–$20 randomized swaps        │
         └──────────────────────────────────┘
                            │
                            ▼
Observed (Day 7): 35% ETH · 22% LINK · 18% WBTC · 12% USDC …
                            │
                            ▼
         Privacy Score:  43  →  67  →  87
         (cosine similarity of real vs observed)
```

### The Four Engines

| Engine | Responsibility | Powered by |
|---|---|---|
| **Portfolio Engine** | Fetches real holdings, DeFi positions, tx history | OKX Agentic Wallet + Wallet Portfolio skill |
| **Surveillance Engine** | Detects whales / KOLs / bots watching your wallet | OKX DEX Signal (smart-money tracker) |
| **Decoy Engine** | Picks safe tokens, simulates, executes $2–$20 swaps | OKX DEX Swap + Uniswap v4 on X Layer |
| **Footprint Analyzer** | Compares real vs observed portfolio, scores privacy | Custom cosine similarity + Wallet Portfolio |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Next.js 16 App Router  ·  React 19  ·  Tailwind v4     │
│                                                         │
│  /           Landing (GSAP + Lenis + glassmorphism)     │
│  /login      Email + OTP  (OKX Agentic Wallet)          │
│  /dashboard  Portfolio vs footprint + privacy gauge     │
│    /surveillance   Threat level + detected watchers     │
│    /decoys         Toggle, budget, strategy, history    │
│    /analytics      Score chart, spend, ROI              │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│  API Layer (Next.js route handlers)                     │
│  /api/auth/*      onchainos wallet login/verify/status  │
│  /api/wallet/*    balance · history · addresses         │
│  /api/portfolio   real holdings + DeFi                  │
│  /api/surveillance  threat + watchers                   │
│  /api/decoy/*     execute · history · settings          │
│  /api/footprint   public view + privacy score           │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│  onchainos CLI  (child_process.execFile)                │
│  ↳ OKX OnchainOS skills  (14)                           │
│  ↳ Uniswap v4 AI skills   (10)                          │
│  ↳ X Layer testnet (chainId 195)                        │
└─────────────────────────────────────────────────────────┘
```

---

## Tech Stack

- **Framework** — Next.js 16 (App Router) + React 19 + TypeScript
- **Styling** — Tailwind CSS v4, CSS variables for dual theme, glassmorphism
- **Animation** — GSAP + ScrollTrigger, Lenis smooth scroll, Framer Motion, OGL (WebGL)
- **State / Data** — TanStack Query (30s stale, 60s refetch)
- **Blockchain** — viem, wagmi, Uniswap v4 SDK, X Layer testnet (chainId 195)
- **OKX** — Agentic Wallet (TEE-signed, email+OTP), OnchainOS CLI v2.2.8
- **API** — Next.js route handlers (Hono wrapper planned)

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20.9.0
- **onchainos CLI** — auto-installed via `postinstall` to `~/.local/bin/onchainos`
- An **OKX Agentic Wallet** registered at [web3.okx.com/xlayer/build-x-hackathon](https://web3.okx.com/xlayer/build-x-hackathon)

### Install & Run

```bash
git clone https://github.com/<your-handle>/cloakfi.git
cd cloakfi
npm install         # also installs onchainos CLI
npm run dev         # → http://localhost:3000
```

### Environment

No secrets are required to run the UI. Wallet signing happens inside OKX's TEE (Trusted Execution Environment) — the CLI holds keys, the app never sees them.

For production builds:

```bash
npm run build
npm run start
```

---

## Project Structure

```
ghostfolio/
├── src/
│   ├── app/
│   │   ├── page.tsx              ← landing
│   │   ├── login/                ← email + OTP
│   │   ├── dashboard/
│   │   │   ├── page.tsx          ← home
│   │   │   ├── surveillance/
│   │   │   ├── decoys/
│   │   │   └── analytics/
│   │   └── api/
│   │       ├── auth/             ← login, verify, status, logout
│   │       ├── wallet/           ← balance, history, addresses
│   │       ├── portfolio/        ← real holdings + DeFi
│   │       ├── surveillance/     ← watchers + threat
│   │       ├── decoy/            ← execute, history, settings
│   │       ├── footprint/        ← public view + score
│   │       └── analytics/        ← aggregated metrics
│   ├── components/
│   │   ├── ThemeProvider.tsx     ← light/dark persisted
│   │   ├── SmoothScroll.tsx      ← Lenis + ScrollTrigger
│   │   ├── Vectors.tsx           ← SVG gradient orbs
│   │   └── dashboard/
│   │       ├── Sidebar.tsx
│   │       └── AuthGuard.tsx
│   └── lib/
│       ├── onchainos.ts          ← CLI wrapper (execFile)
│       ├── auth-context.tsx      ← AuthProvider
│       ├── query-provider.tsx    ← TanStack Query
│       ├── hooks.ts              ← useWalletBalance, etc.
│       └── mock-data.ts          ← dev fallback
├── scripts/
│   └── install-onchainos.mjs     ← postinstall bootstrap
├── AGENTS.md                     ← contributor notes for Claude
└── package.json
```

---

## Skills Used

### OKX OnchainOS (14)
`okx-agentic-wallet` · `okx-wallet-portfolio` · `okx-dex-swap` · `okx-dex-market` · `okx-dex-signal` · `okx-dex-token` · `okx-dex-trenches` · `okx-dex-ws` · `okx-defi-invest` · `okx-defi-portfolio` · `okx-onchain-gateway` · `okx-security` · `okx-audit-log` · `okx-x402-payment`

### Uniswap v4 AI (10)
`swap-planner` · `swap-integration` · `liquidity-planner` · `v4-sdk-integration` · `v4-hook-generator` · `v4-security-foundations` · `viem-integration` · `pay-with-any-token` · `deployer` · `configurator`

---

## Deployment

**Network:** X Layer testnet (chainId 195) · **Explorer:** [web3.okx.com/explorer/x-layer-testnet](https://web3.okx.com/explorer/x-layer-testnet)

### Identities

| Role | Address | Notes |
|---|---|---|
| **Agentic Wallet (EVM / X Layer)** | `0x18d1553f05a2307d7d9178d8482180bb0a2fcd5e` | OKX Agentic Wallet, TEE-signed via email + OTP. Sole onchain identity for the project. Account ID `0fdb3202-f5e3-4d7b-9dce-c60ed60476a8`. |
| Agentic Wallet (Solana) | `9h4B9rfmUN7bELHXV9HDgReVVhfT8GR72oebCAuTr9th` | Same account, SVM chain |
| User Browser Wallet (wagmi) | `0x9D8Ef16Cc3787dE213e68c7Cc30406E515981f78` | MetaMask / OKX Wallet extension. Signs the decoy txs directly for testnet demo (the onchainos CLI's `swap execute` path is mainnet-only). |

The Agentic Wallet reads portfolio, history, and smart-money signals; the browser wallet signs testnet decoys. No other agents deployed.

### Sample Decoy Transactions (X Layer testnet)

| Swap | Tx Hash |
|---|---|
| OKB → LINK | [`0x46aa…f3c5`](https://web3.okx.com/explorer/x-layer-testnet/tx/0x46aad3226d9b9664f4b719aaddf9b428a918098ad50835e2422d5e6d7898f3c5) |
| OKB → AAVE | [`0x35b9…5467d`](https://web3.okx.com/explorer/x-layer-testnet/tx/0x35b981c122cee8932466b3768f9998c302910889d4ef953dfae3856855d5467d) |
| OKB → UNI | [`0xd350…033b`](https://web3.okx.com/explorer/x-layer-testnet/tx/0xd3501477853ae4c5fd2be3b96ee1db9b7e74b333c68ebc1eb1d357c72ae6033b) |
| OKB → USDC | [`0x7e3a…9166`](https://web3.okx.com/explorer/x-layer-testnet/tx/0x7e3a140975b5126320b3bca32ffb7efda5d875d0d3c1fab29a3be592208d9166) |

---

## Positioning in the X Layer Ecosystem

X Layer's core pitch is cheap, fast DeFi with OKX-grade liquidity. But DeFi on any public L2 is **transparent by default** — which means every profitable trader on X Layer is a target for copy-trading bots, MEV searchers, and whale trackers the moment their strategy starts working.

CloakFi sits one layer above the existing X Layer stack:

- **DEX (OKX DEX, Uniswap)** — where real trades happen
- **Wallet (OKX Agentic Wallet)** — who's trading
- **Surveillance (OKX Smart Money / Signals)** — who's watching
- **CloakFi ← privacy layer** — what observers *think* you're doing

We don't replace any piece of the stack — we plug into it. The Surveillance Engine consumes OKX's own smart-money feed; the Decoy Engine routes through OKX DEX aggregator and Uniswap; the wallet identity is an OKX Agentic Wallet. CloakFi's value grows with X Layer's adoption: more active traders → more surveillance → more demand for plausible-deniability tools.

Target users on day one: yield farmers, memecoin rotators, and LPs with 5-figure+ positions who don't want their moves copied within the hour.

---

## Team

| Name | Role | GitHub |
|---|---|---|
| Ajay | Full-stack dev, product, hackathon lead | [@Devil02070](https://github.com/Devil02070) |

Single-builder submission. No co-contributors, no additional agents beyond the user-owned OKX Agentic Wallet.

---

## Hackathon Compliance

| Requirement | Status |
|---|---|
| Built on X Layer | ✅ 4 decoy txs on X Layer testnet (see Deployment) |
| Agentic Wallet as onchain identity | ✅ `0x18d1…cd5e` (OKX, TEE) |
| Use ≥1 OnchainOS / Uniswap skill | ✅ 24 skills installed, 6 actively called |
| Public GitHub repo + README | ✅ this file (intro, architecture, deployment, skills, mechanics, team, positioning) |
| Google Form submission | ⏳ due April 15, 23:59 UTC |
| Demo video (1–3 min, bonus) | 🎥 [Loom / YouTube link — TBA] |
| X/Twitter post `#XLayerHackathon` `@XLayerOfficial` (bonus) | ✅ [post](https://x.com/devil_move/status/2043923019022966890) |

**Deadline:** April 15, 2026 · 23:59 UTC

---

## Screenshots

> Landing page — glassmorphism hero with parallax orbs
> Dashboard — real portfolio vs public footprint side-by-side, privacy gauge
> Surveillance — detected watchers with similarity scores
> Decoys — budget sliders, strategy selector, swap history
> Analytics — privacy score trend, spend breakdown, ROI

*(Add screenshots in `public/screenshots/` and link here.)*

---

## Roadmap

- [ ] Live Decoy Engine scheduler (randomized cron on X Layer)
- [ ] Multi-wallet surveillance (detect watchers across addresses)
- [ ] Strategy presets (yield-farmer, memecoin, long-term HODL)
- [ ] Telegram / Discord alerts when new watchers attach
- [ ] zk-proof of decoy authenticity (optional — for counter-analysis)

---

## License

MIT

## Credits

Built by [@ajay](https://github.com/Devil02070) for the OKX Build X Hackathon, Season 2 (`#XLayerHackathon`).
Powered by OKX OnchainOS, Uniswap v4, and X Layer.
