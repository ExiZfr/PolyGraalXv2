# PolyGraalX

> **Perpetual Futures DEX for Prediction Markets** — Trade the future of real-world events on Polygon.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Polygon](https://img.shields.io/badge/Polygon-8247E5?logo=polygon&logoColor=white)](https://polygon.technology/)

## Overview

PolyGraalX is a decentralized perpetual futures exchange that allows traders to speculate on prediction market outcomes. Built on Polygon for low fees and fast transactions, it uses a virtual AMM (vAMM) model similar to Binance Futures.

### Key Features

- 🎯 **Prediction Market Perps** — Trade outcomes of real-world events
- 📈 **Up to 100x Leverage** — Amplify your positions
- 💧 **Deep Liquidity** — vAMM ensures minimal slippage
- 💰 **Low Fees** — 0.1% taker, 0.05% maker
- 🔐 **Non-Custodial** — Trade directly from your wallet
- 🌍 **24/7 Trading** — Markets never close

## Tech Stack

| Component | Technology |
|-----------|------------|
| **Contracts** | Solidity + Foundry |
| **Backend** | Node.js + TypeScript + Fastify + Viem |
| **Frontend** | Next.js 14 + Tailwind + RainbowKit |
| **Database** | PostgreSQL + Redis |
| **Orchestration** | Docker Compose + Nginx |

## Project Structure

```
polygraalx/
├── apps/
│   ├── backend/          # API & Blockchain Indexer
│   └── frontend/         # Next.js Trading Interface
├── packages/
│   ├── contracts/        # Solidity Smart Contracts
│   ├── shared/           # Shared Types & Utilities
│   └── config/           # Shared Config (TSConfig, ESLint)
├── infra/
│   ├── docker/           # Docker configs (Nginx, Postgres)
│   └── scripts/          # Deployment scripts
└── docker-compose.yml    # Main orchestration file
```

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose
- Foundry (for contracts)

### Development

```bash
# Clone and install
git clone https://github.com/your-org/polygraalx.git
cd polygraalx
pnpm install

# Copy environment file
cp .env.example .env
# Edit .env with your values

# Start all services
docker compose up -d

# Or run dev mode with hot reload
docker compose -f docker-compose.yml -f docker-compose.override.yml up -d
```

### Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **API Docs**: http://localhost:4000/api/health
- **Adminer (DB)**: http://localhost:8080
- **Redis Commander**: http://localhost:8081

## Environment Variables

See [.env.example](.env.example) for all required variables.

Key variables:
- `DATABASE_URL` — PostgreSQL connection string
- `REDIS_URL` — Redis connection string  
- `RPC_URL` — Polygon RPC endpoint
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` — WalletConnect project ID

## Deployment

### VPS Deployment (Production)

```bash
# SSH into VPS
ssh user@your-vps-ip

# Clone and setup
git clone https://github.com/your-org/polygraalx.git
cd polygraalx
cp .env.example .env
# Configure .env for production

# Start with production config
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Documentation

- [MANIFEST.md](MANIFEST.md) — Complete file-by-file documentation
- [Architecture](docs/architecture.md) — System design overview
- [API Reference](docs/api.md) — API endpoint documentation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

## License

MIT License — see [LICENSE](LICENSE) for details.

---

**Built with ❤️ for the prediction market community**
