#!/bin/bash
# ================================
# PolyGraalX VPS Setup Script
# Run this on a fresh Ubuntu 24.04 VPS
# ================================

set -e

echo "🚀 Starting PolyGraalX VPS Setup..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential tools
echo "🔧 Installing essential tools..."
sudo apt install -y curl git wget unzip htop

# Install Docker
echo "🐳 Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker $USER
    echo "⚠️  Please log out and log back in for Docker permissions to take effect"
fi

# Install Docker Compose plugin
echo "🐳 Installing Docker Compose..."
sudo apt install -y docker-compose-plugin

# Install Node.js via NVM
echo "📦 Installing Node.js..."
if ! command -v node &> /dev/null; then
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm install 20
    nvm use 20
    nvm alias default 20
fi

# Install pnpm
echo "📦 Installing pnpm..."
npm install -g pnpm

# Install Foundry
echo "🔨 Installing Foundry..."
if ! command -v forge &> /dev/null; then
    curl -L https://foundry.paradigm.xyz | bash
    export PATH="$PATH:$HOME/.foundry/bin"
    foundryup
fi

# Setup firewall
echo "🔥 Configuring firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Create swap (if not exists)
echo "💾 Setting up swap..."
if [ ! -f /swapfile ]; then
    sudo fallocate -l 4G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
fi

echo ""
echo "✅ VPS Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Log out and log back in (for Docker permissions)"
echo "2. Clone the repository: git clone <repo-url>"
echo "3. cd polygraalx && cp .env.example .env"
echo "4. Edit .env with your configuration"
echo "5. Run: docker compose up -d"
echo ""
