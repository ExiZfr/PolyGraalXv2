import { pgTable, uuid, varchar, decimal, timestamp, integer, boolean, text, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ===================
// ENUMS
// ===================

export const orderSideEnum = pgEnum('order_side', ['LONG', 'SHORT']);
export const orderTypeEnum = pgEnum('order_type', ['MARKET', 'LIMIT']);
export const orderStatusEnum = pgEnum('order_status', ['PENDING', 'FILLED', 'CANCELLED', 'EXPIRED']);
export const positionStatusEnum = pgEnum('position_status', ['OPEN', 'CLOSED', 'LIQUIDATED']);

// ===================
// MARKETS TABLE
// ===================

export const markets = pgTable('markets', {
    id: uuid('id').primaryKey().defaultRandom(),
    marketId: varchar('market_id', { length: 66 }).notNull().unique(), // On-chain market ID
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    baseAsset: varchar('base_asset', { length: 50 }).notNull(), // e.g., "TRUMP_WIN"
    quoteAsset: varchar('quote_asset', { length: 50 }).notNull().default('USDC'),

    // vAMM Parameters
    kValue: decimal('k_value', { precision: 78, scale: 18 }).notNull(), // x * y = k
    baseReserve: decimal('base_reserve', { precision: 78, scale: 18 }).notNull(),
    quoteReserve: decimal('quote_reserve', { precision: 78, scale: 18 }).notNull(),

    // Trading Parameters
    maxLeverage: integer('max_leverage').notNull().default(100),
    maintenanceMargin: decimal('maintenance_margin', { precision: 5, scale: 4 }).notNull().default('0.0625'), // 6.25%
    takerFee: decimal('taker_fee', { precision: 5, scale: 4 }).notNull().default('0.001'), // 0.1%
    makerFee: decimal('maker_fee', { precision: 5, scale: 4 }).notNull().default('0.0005'), // 0.05%

    // Market Status
    isActive: boolean('is_active').notNull().default(true),
    expiryTimestamp: timestamp('expiry_timestamp'),
    settlementPrice: decimal('settlement_price', { precision: 78, scale: 18 }),

    // Metadata
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ===================
// POSITIONS TABLE
// ===================

export const positions = pgTable('positions', {
    id: uuid('id').primaryKey().defaultRandom(),
    positionId: varchar('position_id', { length: 66 }).notNull().unique(), // On-chain position ID
    marketId: uuid('market_id').notNull().references(() => markets.id),
    userAddress: varchar('user_address', { length: 42 }).notNull(),

    // Position Details
    side: orderSideEnum('side').notNull(),
    size: decimal('size', { precision: 78, scale: 18 }).notNull(), // Position size in base asset
    entryPrice: decimal('entry_price', { precision: 78, scale: 18 }).notNull(),
    margin: decimal('margin', { precision: 78, scale: 18 }).notNull(), // Collateral
    leverage: integer('leverage').notNull(),

    // PnL Tracking
    unrealizedPnl: decimal('unrealized_pnl', { precision: 78, scale: 18 }).default('0'),
    realizedPnl: decimal('realized_pnl', { precision: 78, scale: 18 }).default('0'),
    fundingPayment: decimal('funding_payment', { precision: 78, scale: 18 }).default('0'),

    // Status
    status: positionStatusEnum('status').notNull().default('OPEN'),
    liquidationPrice: decimal('liquidation_price', { precision: 78, scale: 18 }),

    // Timestamps
    openedAt: timestamp('opened_at').notNull().defaultNow(),
    closedAt: timestamp('closed_at'),
});

// ===================
// ORDERS TABLE
// ===================

export const orders = pgTable('orders', {
    id: uuid('id').primaryKey().defaultRandom(),
    orderId: varchar('order_id', { length: 66 }).notNull().unique(), // On-chain order ID
    marketId: uuid('market_id').notNull().references(() => markets.id),
    positionId: uuid('position_id').references(() => positions.id),
    userAddress: varchar('user_address', { length: 42 }).notNull(),

    // Order Details
    side: orderSideEnum('side').notNull(),
    type: orderTypeEnum('type').notNull(),
    size: decimal('size', { precision: 78, scale: 18 }).notNull(),
    price: decimal('price', { precision: 78, scale: 18 }), // Null for market orders
    leverage: integer('leverage').notNull(),

    // Execution
    filledSize: decimal('filled_size', { precision: 78, scale: 18 }).default('0'),
    avgFillPrice: decimal('avg_fill_price', { precision: 78, scale: 18 }),
    fee: decimal('fee', { precision: 78, scale: 18 }).default('0'),

    // Status
    status: orderStatusEnum('status').notNull().default('PENDING'),

    // Timestamps
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    expiresAt: timestamp('expires_at'),
});

// ===================
// TRADES TABLE
// ===================

export const trades = pgTable('trades', {
    id: uuid('id').primaryKey().defaultRandom(),
    txHash: varchar('tx_hash', { length: 66 }).notNull(),
    blockNumber: integer('block_number').notNull(),
    marketId: uuid('market_id').notNull().references(() => markets.id),
    orderId: uuid('order_id').references(() => orders.id),

    // Trade Details
    userAddress: varchar('user_address', { length: 42 }).notNull(),
    side: orderSideEnum('side').notNull(),
    size: decimal('size', { precision: 78, scale: 18 }).notNull(),
    price: decimal('price', { precision: 78, scale: 18 }).notNull(),
    fee: decimal('fee', { precision: 78, scale: 18 }).notNull(),

    // Timestamps
    executedAt: timestamp('executed_at').notNull().defaultNow(),
});

// ===================
// FUNDING RATES TABLE
// ===================

export const fundingRates = pgTable('funding_rates', {
    id: uuid('id').primaryKey().defaultRandom(),
    marketId: uuid('market_id').notNull().references(() => markets.id),
    rate: decimal('rate', { precision: 18, scale: 12 }).notNull(), // Funding rate (can be negative)
    timestamp: timestamp('timestamp').notNull().defaultNow(),
});

// ===================
// INDEXER STATE TABLE
// ===================

export const indexerState = pgTable('indexer_state', {
    id: integer('id').primaryKey().default(1),
    lastProcessedBlock: integer('last_processed_block').notNull().default(0),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ===================
// RELATIONS
// ===================

export const marketsRelations = relations(markets, ({ many }) => ({
    positions: many(positions),
    orders: many(orders),
    trades: many(trades),
    fundingRates: many(fundingRates),
}));

export const positionsRelations = relations(positions, ({ one, many }) => ({
    market: one(markets, { fields: [positions.marketId], references: [markets.id] }),
    orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
    market: one(markets, { fields: [orders.marketId], references: [markets.id] }),
    position: one(positions, { fields: [orders.positionId], references: [positions.id] }),
}));

export const tradesRelations = relations(trades, ({ one }) => ({
    market: one(markets, { fields: [trades.marketId], references: [markets.id] }),
    order: one(orders, { fields: [trades.orderId], references: [orders.id] }),
}));

export const fundingRatesRelations = relations(fundingRates, ({ one }) => ({
    market: one(markets, { fields: [fundingRates.marketId], references: [markets.id] }),
}));
