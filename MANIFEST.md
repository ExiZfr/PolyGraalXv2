# MANIFEST.md — PolyGraalX File Documentation

> Complete documentation of every file in the PolyGraalX monorepo.

---

## Root Configuration

| File | Purpose |
|------|---------|
| `package.json` | Root workspace package with global scripts for building, linting, and Docker orchestration |
| `pnpm-workspace.yaml` | Defines the monorepo workspace structure, linking apps/* and packages/* directories |
| `turbo.json` | Turborepo configuration for build caching, task dependencies, and parallel execution |
| `.env.example` | Environment variable template with all required configuration (DB, Redis, RPC, API keys) |
| `.gitignore` | Git ignore rules for node_modules, build outputs, Foundry artifacts, and secrets |
| `.npmrc` | PNPM configuration enabling shamefully-hoist for dependency compatibility |
| `docker-compose.yml` | Main Docker orchestration file that starts all services (postgres, redis, backend, frontend, nginx) |
| `docker-compose.override.yml` | Development overrides with hot reloading, source mounts, and admin UIs (Adminer, Redis Commander) |
| `docker-compose.prod.yml` | Production overrides with resource limits, restart policies, and optimized builds |
| `README.md` | Project documentation with overview, tech stack, and quick start instructions |

---

## Apps

### Backend (`apps/backend/`)

| File | Purpose |
|------|---------|
| `package.json` | Backend dependencies (Fastify, Drizzle, Viem, ioredis) and scripts |
| `tsconfig.json` | TypeScript config extending the shared base with path aliases |
| `drizzle.config.ts` | Drizzle ORM configuration pointing to schema and migrations folder |
| `Dockerfile` | Multi-stage Docker build targeting development or production |

#### Config (`apps/backend/src/config/`)

| File | Purpose |
|------|---------|
| `env.ts` | Zod schema validation for environment variables, fails fast on invalid config |
| `database.ts` | PostgreSQL connection pool with Drizzle ORM integration |
| `redis.ts` | Redis client setup with pub/sub for real-time updates, key prefixes and channel definitions |

#### Database (`apps/backend/src/db/`)

| File | Purpose |
|------|---------|
| `schema.ts` | Drizzle ORM schema defining tables: markets, positions, orders, trades, fundingRates, indexerState |
| `client.ts` | Database client singleton and schema exports |

#### API (`apps/backend/src/api/`)

| File | Purpose |
|------|---------|
| `server.ts` | Fastify server setup with CORS, helmet, rate limiting, and WebSocket plugins |
| `routes/index.ts` | Route aggregator registering all API endpoints under /api prefix |
| `routes/health.ts` | Health check endpoints for Docker and load balancer monitoring |
| `routes/markets.ts` | Market REST endpoints: list all, get by ID, orderbook, recent trades |
| `routes/positions.ts` | Position REST endpoints: list all, open positions, position details |
| `routes/orders.ts` | Order REST endpoints: create order, list orders, cancel order |
| `routes/account.ts` | Account REST endpoints: summary stats, trade history |
| `middleware/auth.ts` | JWT/Signature verification using Viem to authenticate wallet signatures |
| `middleware/errorHandler.ts` | Global error handler for consistent API error responses |
| `middleware/rateLimiter.ts` | Redis-based sliding window rate limiter for distributed limiting |

#### Indexer (`apps/backend/src/indexer/`)

| File | Purpose |
|------|---------|
| `index.ts` | Blockchain indexer that polls for new blocks, processes logs, and updates PostgreSQL |
| `eventHandlers/TradeExecuted.ts` | Handles TradeExecuted events, inserts trade records, updates order status |
| `eventHandlers/PositionOpened.ts` | Handles PositionOpened events, creates new position records |
| `eventHandlers/PositionClosed.ts` | Handles PositionClosed events, updates position status to CLOSED |
| `eventHandlers/LiquidationEvent.ts` | Handles Liquidation events, marks positions as LIQUIDATED |
| `eventHandlers/MarketCreated.ts` | Handles MarketCreated events, inserts new market records |

#### WebSocket (`apps/backend/src/websocket/`)

| File | Purpose |
|------|---------|
| `index.ts` | WebSocket server handling subscriptions and broadcasting Redis pub/sub messages to clients |

#### Entry Point

| File | Purpose |
|------|---------|
| `index.ts` | Main application entry point that starts API server, indexer, and handles graceful shutdown |

---

### Frontend (`apps/frontend/`)

| File | Purpose |
|------|---------|
| `package.json` | Frontend dependencies (Next.js 14, RainbowKit, Wagmi, TradingView charts) |
| `tsconfig.json` | TypeScript config extending shared Next.js config with path aliases |
| `next.config.js` | Next.js configuration with SEO headers, image optimization, standalone output for Docker |
| `tailwind.config.ts` | Tailwind CSS configuration with trading colors (long/short), dark theme, custom animations |
| `postcss.config.js` | PostCSS configuration for Tailwind processing |
| `Dockerfile` | Multi-stage Docker build for development and production with standalone output |

#### Styles (`apps/frontend/src/styles/`)

| File | Purpose |
|------|---------|
| `globals.css` | Global CSS with Tailwind imports, trading theme, glassmorphism effects, custom scrollbars |

#### App Router (`apps/frontend/src/app/`)

| File | Purpose |
|------|---------|
| `layout.tsx` | Root layout with comprehensive SEO metadata (Open Graph, Twitter cards, structured data, meta tags) |
| `page.tsx` | Landing page with hero section, stats, features, and CTAs using semantic HTML for SEO |

#### Providers (`apps/frontend/src/providers/`)

| File | Purpose |
|------|---------|
| `index.tsx` | Root providers wrapping Wagmi, RainbowKit, React Query, and Theme providers |
| `ThemeProvider.tsx` | Theme context provider for dark/light mode support |

#### Components (`apps/frontend/src/components/`)

| File | Purpose |
|------|---------|
| `layout/Header.tsx` | Site header with navigation, logo, and RainbowKit wallet connection button |
| `layout/Footer.tsx` | Site footer with SEO-friendly navigation links, legal links, and social media |

#### Lib (`apps/frontend/src/lib/`)

| File | Purpose |
|------|---------|
| `wagmi.ts` | Wagmi + RainbowKit configuration for Polygon chain with contract addresses |
| `api.ts` | API client wrapper for backend communication with type-safe methods |

---

## Packages

### Shared (`packages/shared/`)

| File | Purpose |
|------|---------|
| `package.json` | Shared package manifest with exports for types, constants, and utils |
| `tsconfig.json` | TypeScript config extending base configuration |
| `index.ts` | Main exports aggregating all shared modules |

#### Types (`packages/shared/types/`)

| File | Purpose |
|------|---------|
| `index.ts` | Type exports aggregator |
| `market.ts` | Market, MarketPrice, Orderbook, OrderbookLevel type definitions |
| `position.ts` | Position, PositionSide, PositionStatus type definitions |
| `order.ts` | Order, OrderType, OrderStatus, CreateOrderRequest type definitions |
| `events.ts` | WebSocket event types: TradeEvent, OrderbookUpdateEvent, PriceUpdateEvent, etc. |

#### Constants (`packages/shared/constants/`)

| File | Purpose |
|------|---------|
| `index.ts` | Constants exports aggregator |
| `addresses.ts` | Contract addresses per chain ID (Polygon Mainnet, Amoy Testnet) |

#### Utils (`packages/shared/utils/`)

| File | Purpose |
|------|---------|
| `index.ts` | Utils exports aggregator |
| `format.ts` | Formatting utilities: formatUSD, formatCompact, formatPrice, formatPercent, formatAddress |
| `calculations.ts` | Trading calculations: PnL, liquidation price, margin, vAMM pricing, slippage |

---

### Config (`packages/config/`)

| File | Purpose |
|------|---------|
| `package.json` | Config package manifest with exports for tsconfig and eslint |
| `tsconfig/base.json` | Base TypeScript configuration with strict settings shared across all packages |
| `tsconfig/node.json` | Node.js-specific TypeScript config for backend |
| `tsconfig/nextjs.json` | Next.js-specific TypeScript config for frontend |

---

### Contracts (`packages/contracts/`)

| File | Purpose |
|------|---------|
| `package.json` | Contracts package manifest with Foundry build/test scripts |
| `foundry.toml` | Foundry configuration: Solidity version, optimizer settings, RPC endpoints |
| `remappings.txt` | Solidity import remappings for OpenZeppelin and forge-std |

---

## Infrastructure

### Docker (`infra/docker/`)

| File | Purpose |
|------|---------|
| `nginx/nginx.conf` | Main Nginx configuration with performance optimizations, security headers, rate limiting |
| `nginx/conf.d/default.conf` | Development virtual host config with API proxy and WebSocket support |
| `postgres/init.sql` | PostgreSQL initialization script creating extensions and schemas |

### Scripts (`infra/scripts/`)

| File | Purpose |
|------|---------|
| `setup-vps.sh` | VPS initialization script installing Docker, Node.js, pnpm, Foundry, and configuring firewall |
| `deploy.sh` | Deployment script for pulling, building, migrating, and restarting services |

### SSL (`infra/ssl/`)

| File | Purpose |
|------|---------|
| `.gitkeep` | Placeholder for SSL certificates (generated by Let's Encrypt in production) |

---

## GitHub

| File | Purpose |
|------|---------|
| `.github/workflows/ci.yml` | GitHub Actions CI pipeline for linting, testing, and building (to be created) |
