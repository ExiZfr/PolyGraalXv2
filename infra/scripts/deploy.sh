#!/bin/bash
# ================================
# PolyGraalX Deployment Script
# ================================

set -e

echo "🚀 Deploying PolyGraalX..."

# Determine environment
ENV=${1:-production}
echo "📦 Environment: $ENV"

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Build and start containers
if [ "$ENV" = "production" ]; then
    echo "🏗️  Building production containers..."
    docker compose -f docker-compose.yml -f docker-compose.prod.yml build
    
    echo "🔄 Restarting services..."
    docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
else
    echo "🏗️  Building development containers..."
    docker compose build
    
    echo "🔄 Restarting services..."
    docker compose up -d
fi

# Run database migrations
echo "🗄️  Running database migrations..."
docker compose exec backend pnpm db:migrate

# Health check
echo "🏥 Checking health..."
sleep 10
curl -f http://localhost/api/health || echo "⚠️  Health check failed"

echo ""
echo "✅ Deployment Complete!"
echo ""
docker compose ps
