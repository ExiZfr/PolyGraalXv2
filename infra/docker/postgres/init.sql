-- PolyGraalX Initial Database Setup
-- This script runs when the PostgreSQL container is first created

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create schemas for organization
CREATE SCHEMA IF NOT EXISTS trading;
CREATE SCHEMA IF NOT EXISTS indexer;

-- Grant permissions
GRANT ALL ON SCHEMA trading TO polygraalx;
GRANT ALL ON SCHEMA indexer TO polygraalx;

-- Note: Actual tables are managed by Drizzle ORM migrations
-- This file only sets up the initial database structure
