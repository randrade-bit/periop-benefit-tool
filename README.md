# Perioperative Benefit Tool

LiveData OR benefit analysis calculator — illustrative ROI projections for sales conversations. Active version. Supersedes [`benefit_analysis_tool`](https://github.com/randrade-bit/benefit_analysis_tool) (archived).

## What it does

Estimates operational and financial impact of LiveData's OR platform across:

- **First Case On-Time Start (FCOTS)** — recovered start-of-day minutes from on-time first cases
- **Turnover Time (TOT)** — minutes saved between cases via passive coordination tools
- **Block & Prime Time Utilization** — improvement toward published benchmarks
- **Cancellation Reduction** — addressable share of OR cancellations recovered
- **Administrative Efficiency** — reporting hours redirected from manual tasks

Outputs a per-year benefit total, multi-year contract value, and ROI vs. platform cost.

## Running locally

```bash
npm install
npm run dev
```

Then open the URL printed by Vite (usually http://localhost:5173).

## Deployment

This repository auto-deploys to Vercel on every push to `main`. Production URL: _(add once Vercel deploy is live)_.

## Stack

Vite + React 18 + Tailwind + Recharts.

## Sources

Calculations are anchored to peer-reviewed research and industry benchmarks. Key references are linked inline within the tool's footnotes (FCOTS QI literature, Lovasik et al. 2025 on TOT, Xue et al. 2013 on cancellations, Todd Brown Ch.27 on block/prime time benchmarks).
