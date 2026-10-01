#!/usr/bin/env bash
# ==============================================================================
# ResumeAI - Automated AWS EC2 Deployment Script
# Supports: Ubuntu 22.04 LTS & Amazon Linux 2023 / RHEL
# ==============================================================================

set -euo pipefail

echo "=========================================================="
echo "🚀 Starting ResumeAI Deployment on AWS EC2..."
echo "=========================================================="

# 1. Detect OS and install Docker
if ! command -v docker &> /dev/null; then
    echo "📦 Installing Docker Engine..."
    if command -v apt-get &> /dev/null; then
        sudo apt-get update -y
        sudo apt-get install -y ca-certificates curl gnupg lsb-release
        sudo mkdir -p /etc/apt/keyrings
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
        echo \
          "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
          $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
        sudo apt-get update -y
        sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    elif command -v dnf &> /dev/null; then
        sudo dnf update -y
        sudo dnf install -y docker
        sudo systemctl enable --now docker
        # Install docker compose plugin on Amazon Linux
        DOCKER_CONFIG=${DOCKER_CONFIG:-/usr/local/lib/docker}
        sudo mkdir -p "$DOCKER_CONFIG/cli-plugins"
        sudo curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-$(uname -m) -o "$DOCKER_CONFIG/cli-plugins/docker-compose"
        sudo chmod +x "$DOCKER_CONFIG/cli-plugins/docker-compose"
    fi

    sudo usermod -aG docker "$USER" || true
    sudo systemctl enable docker
    sudo systemctl start docker
    echo "✅ Docker installed."
fi

# Determine if sudo is needed for docker in this immediate subshell
DOCKER_CMD="docker"
if ! docker info &> /dev/null; then
    DOCKER_CMD="sudo docker"
fi

# 2. Build & Launch Containers
echo "🏗️ Building Docker containers with multi-stage caching..."
$DOCKER_CMD compose build --pull

echo "▶️ Launching application containers in background..."
$DOCKER_CMD compose up -d --remove-orphans

# 3. Verify Health & Retrieve Public IP (supports both IMDSv2 and fallback)
echo "🩺 Verifying container health..."
sleep 5

TOKEN=$(curl -s -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 60" 2>/dev/null || true)
PUBLIC_IP=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" "http://169.254.169.254/latest/meta-data/public-ipv4" 2>/dev/null || curl -s --connect-timeout 2 http://checkip.amazonaws.com 2>/dev/null || echo "localhost")

if $DOCKER_CMD compose ps | grep -q "Up"; then
    echo "=========================================================="
    echo "🎉 SUCCESS: ResumeAI containers are running on AWS EC2!"
    echo "Web Application: http://${PUBLIC_IP}:3000"
    echo "=========================================================="
else
    echo "⚠️ Warning: Containers may still be starting or failed. Check logs:"
    $DOCKER_CMD compose logs --tail=50
fi
