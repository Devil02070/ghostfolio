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
- **Blockchain** — viem, wagmi, Uniswap v4 SDK, X Layer (chainId 196)
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

## Hackathon Compliance

| Requirement | Status |
|---|---|
| Deploy on X Layer testnet (≥1 real TX) | ✅ [tx hash] |
| Use ≥1 OnchainOS & Uniswap skill | ✅ 24 skills integrated |
| Register Agentic Wallet via OKX portal | ✅ |
| Public GitHub repo + README | ✅ this file |
| Google Form submission | ✅ |
| Demo video (2–3 min) | 🎥 [Loom link] |
| Twitter post (`@XLayerOfficial` `#BuildX`) | 🐦 [tweet link] |

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

Built by [@ajay](https://github.com/Devil02070) for the OKX Build X Hackathon, Season 2.
Powered by OKX OnchainOS, Uniswap v4, and X Layer.
