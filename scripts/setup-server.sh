#!/bin/bash

# Auto-Deployment Setup Script for Production Server
# Run this script on your production server to set up auto-deployment

set -e

echo "🚀 Setting up auto-deployment for Truco Champions..."

# Variables
APP_DIR="/home/$USER/trucochampions"
REPO_URL="https://github.com/lavizcachamza/trucochampions.git"

# 1. Install Docker and Docker Compose if not installed
if ! command -v docker &> /dev/null; then
    echo "📦 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo "✅ Docker installed"
else
    echo "✅ Docker already installed"
fi

if ! command -v docker-compose &> /dev/null; then
    echo "📦 Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "✅ Docker Compose installed"
else
    echo "✅ Docker Compose already installed"
fi

# 2. Clone repository if not exists
if [ ! -d "$APP_DIR" ]; then
    echo "📥 Cloning repository..."
    git clone $REPO_URL $APP_DIR
    cd $APP_DIR
else
    echo "📂 Repository already exists"
    cd $APP_DIR
    git pull origin main
fi

# 3. Create .env file for server if not exists
if [ ! -f "$APP_DIR/server/.env" ]; then
    echo "📝 Creating server .env file..."
    cat > $APP_DIR/server/.env << EOF
PORT=3001
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_KEY=your_supabase_key_here
ADMIN_PASSWORD=your_admin_password_here
EOF
    echo "⚠️  IMPORTANT: Edit server/.env with your actual credentials!"
fi

# 4. Pull Docker images
echo "🐳 Pulling Docker images..."
docker-compose -f docker-compose.prod.yml pull

# 5. Start containers
echo "🚀 Starting containers..."
docker-compose -f docker-compose.prod.yml up -d

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit $APP_DIR/server/.env with your Supabase credentials"
echo "2. Configure Nginx (see DEPLOYMENT.md)"
echo "3. Set up SSL with: sudo certbot --nginx -d trucochamp.mansaoferta.com.ar"
echo "4. Add GitHub Secrets for auto-deployment:"
echo "   - DEPLOY_HOST: Your server IP"
echo "   - DEPLOY_USER: $USER"
echo "   - DEPLOY_SSH_KEY: Your private SSH key"
echo ""
echo "🔗 Application will be available at: http://$(curl -s ifconfig.me):8085"
