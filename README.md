# SoA vs AoS Benchmark

Minimal benchmark for comparing **Structure of Arrays (SoA)** and **Array of Structures (AoS)** in JavaScript.

## What it measures

For each selected collection size, the benchmark runs:
- `SET` (write values)
- `GET` (read values)
- `MOVE` (update x/y/z)
- `X ONLY` (update x only)

## Run

- Open `index.html` in a browser for the interactive version.
- Run `node test_dense.js` for the CLI version.

## Results on my machine

Measured with `node test_dense.js` on this computer, `100` iterations per test.

### Small (1,000)

| Test | SoA (ms) | AoS (ms) | Winner |
|---|---:|---:|---|
| SET | 0.003967 | 0.002969 | AoS 1.34x faster |
| GET | 0.003815 | 0.002996 | AoS 1.27x faster |
| MOVE | 0.006241 | 0.004005 | AoS 1.56x faster |
| X ONLY | 0.003001 | 0.003457 | SoA 1.15x faster |

### Medium (100,000)

| Test | SoA (ms) | AoS (ms) | Winner |
|---|---:|---:|---|
| SET | 0.069801 | 0.083343 | SoA 1.19x faster |
| GET | 0.181008 | 0.093315 | AoS 1.94x faster |
| MOVE | 0.188253 | 0.186347 | AoS 1.01x faster |
| X ONLY | 0.060974 | 0.145390 | SoA 2.38x faster |

### Large (10,000,000)

| Test | SoA (ms) | AoS (ms) | Winner |
|---|---:|---:|---|
| SET | 6.860520 | 21.772911 | SoA 3.17x faster |
| GET | 17.627128 | 13.902253 | AoS 1.27x faster |
| MOVE | 19.346612 | 38.775622 | SoA 2.00x faster |
| X ONLY | 5.214210 | 36.475630 | SoA 7.00x faster |

## Hardware and runtime environment

- OS: `Linux 7.0.10-arch1-1 x86_64 GNU/Linux` (Arch Linux)
- CPU: `AMD Ryzen 7 7700 8-Core Processor` (8 cores / 16 threads)
- Cache: `L1d 256 KiB`, `L1i 256 KiB`, `L2 8 MiB`, `L3 32 MiB`
- RAM at benchmark time: `30 GiB total`, `10 GiB used`, `11 GiB free`, `20 GiB available`
- Node.js: `v26.2.0`
- npm: `11.14.1`

## Live demo

- [GitHub Pages](https://yazmeyaa.github.io/javascript_soa_aos_performance_test/)

## Learning resources

- [AoS and SoA — Algorithmica](https://en.algorithmica.org/hpc/cpu-cache/aos-soa/)
