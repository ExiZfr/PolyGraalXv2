#!/bin/bash
# ==========================================
# PolyGraalX Robust SSL Initialization Script
# ==========================================

set -e

# Configuration
domains=(polygraalx.com www.polygraalx.com)
email="admin@polygraalx.com"
staging=0 # Set to 1 for testing

# Paths
prod_conf="infra/docker/nginx/conf.d/prod.conf"
prod_conf_bak="${prod_conf}.bak"

# 1. Cleanup trap to restore config on failure
cleanup() {
    if [ -f "$prod_conf_bak" ]; then
        echo "⚠️  Script exited inside modification block. Restoring production config..."
        mv -f "$prod_conf_bak" "$prod_conf"
    fi
}
trap cleanup EXIT

echo "🚀 Starting SSL Setup..."

# 2. Check if we're in the right directory
if [ ! -f "$prod_conf" ]; then
    echo "❌ Error: Cannot find $prod_conf. Make sure you run this from the project root (e.g., ~/PolyGraalXv2)."
    exit 1
fi

# 3. Download TLS parameters if missing (keeps the DHPARAMS part of the old script)
data_path="./infra/docker/certbot"
if [ ! -e "$data_path/conf/options-ssl-nginx.conf" ] || [ ! -e "$data_path/conf/ssl-dhparams.pem" ]; then
  echo "📥 Downloading recommended TLS parameters..."
  mkdir -p "$data_path/conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "$data_path/conf/options-ssl-nginx.conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "$data_path/conf/ssl-dhparams.pem"
fi

# 4. Prepare Bootstrap Config
echo "📦 Backing up production config..."
cp "$prod_conf" "$prod_conf_bak"

echo "📝 Writing bootstrap HTTP-only config..."
cat > "$prod_conf" <<EOF
server {
    listen 80;
    server_name ${domains[*]};
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 200 'Bootstrap Mode - Getting SSL Certs... Please wait.';
        add_header Content-Type text/plain;
    }
}
EOF

# 5. Restart Nginx with Bootstrap Config
echo "🔄 Restarting Nginx in bootstrap mode..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml down nginx
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d nginx

# Wait for Nginx to be ready
echo "⏳ Waiting for Nginx to start..."
sleep 5

# 6. Request Certificates
echo "🔐 Requesting Let's Encrypt certificates..."
domain_args=""
for domain in "${domains[@]}"; do
  domain_args="$domain_args -d $domain"
done

case "$email" in
  "") email_arg="--register-unsafely-without-email" ;;
  *) email_arg="-m $email" ;;
esac

if [ "$staging" != "0" ]; then staging_arg="--staging"; fi

docker compose -f docker-compose.yml -f docker-compose.prod.yml run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    $staging_arg \
    $email_arg \
    $domain_args \
    --rsa-key-size 4096 \
    --agree-tos \
    --force-renewal --non-interactive" certbot

# 7. Restore Production Config
echo "♻️  Restoring production Nginx config..."
mv -f "$prod_conf_bak" "$prod_conf"
# Trap is now redundant for restore but harmless

# 8. Reload Nginx to pick up new Certs
echo "✅ Restarting Nginx with full SSL..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --force-recreate nginx

echo ""
echo "🎉 SSL Configuration Complete!"
echo "Check https://polygraalx.com"
