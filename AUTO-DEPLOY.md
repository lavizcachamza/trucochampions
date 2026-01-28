# Auto-Deployment Setup Guide

This guide explains how to set up automatic deployment for the Truco Champions application.

## Overview

When you push changes to the `main` branch, GitHub Actions will automatically:
1. Connect to your production server via SSH
2. Pull the latest code
3. Pull the latest Docker images
4. Restart the containers with zero downtime

## Prerequisites

- A production server (VPS, cloud instance, etc.)
- SSH access to the server
- Docker and Docker Compose installed on the server

## Setup Steps

### 1. Prepare Your Production Server

Run this command on your production server:

```bash
curl -fsSL https://raw.githubusercontent.com/lavizcachamza/trucochampions/main/scripts/setup-server.sh | bash
```

Or manually:

```bash
# Clone the repository
cd /home/$USER
git clone https://github.com/lavizcachamza/trucochampions.git trucochampions
cd trucochampions

# Create server/.env file
nano server/.env
```

Add your credentials:
```env
PORT=3001
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_key_here
ADMIN_PASSWORD=your_secure_password
```

### 2. Generate SSH Key for GitHub Actions

On your **production server**, create a dedicated SSH key:

```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions_key -N ""
```

Add the public key to authorized_keys:

```bash
cat ~/.ssh/github_actions_key.pub >> ~/.ssh/authorized_keys
```

Copy the **private key** (you'll need this for GitHub):

```bash
cat ~/.ssh/github_actions_key
```

### 3. Configure GitHub Secrets

Go to your GitHub repository:
`https://github.com/lavizcachamza/trucochampions/settings/secrets/actions`

Add these secrets:

| Secret Name | Value | Example |
|------------|-------|---------|
| `DEPLOY_HOST` | Your server IP address | `123.45.67.89` |
| `DEPLOY_USER` | SSH username | `ubuntu` or `root` |
| `DEPLOY_SSH_KEY` | Private SSH key from step 2 | Paste entire key |
| `DEPLOY_PORT` | SSH port (optional) | `22` (default) |

### 4. Test the Deployment

Push a change to the `main` branch:

```bash
git add .
git commit -m "Test auto-deployment"
git push origin main
```

Watch the deployment in GitHub Actions:
`https://github.com/lavizcachamza/trucochampions/actions`

### 5. Manual Deployment Trigger

You can also trigger deployment manually from GitHub Actions:
1. Go to Actions tab
2. Select "Deploy to Production"
3. Click "Run workflow"

## Deployment Process

The workflow performs these steps:

1. **Connect** to server via SSH
2. **Pull** latest code from GitHub
3. **Pull** latest Docker images from GHCR
4. **Restart** containers using `docker-compose.prod.yml`
5. **Clean up** old Docker images
6. **Verify** containers are running

## Monitoring

Check deployment status:

```bash
# On production server
cd ~/trucochampions
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs -f
```

## Rollback

If something goes wrong:

```bash
cd ~/trucochampions
git log --oneline  # Find previous commit
git checkout <previous-commit-hash>
docker-compose -f docker-compose.prod.yml up -d --force-recreate
```

## Troubleshooting

### Deployment fails with "Permission denied"
- Check that the SSH key is correctly added to GitHub Secrets
- Verify the public key is in `~/.ssh/authorized_keys` on the server

### Containers don't start
- Check logs: `docker-compose -f docker-compose.prod.yml logs`
- Verify `server/.env` has correct credentials
- Ensure ports 3011 and 8085 are not in use

### Changes not reflecting
- Clear browser cache
- Check that GitHub Actions workflow completed successfully
- Verify correct docker-compose file is being used (prod vs dev)

## Security Notes

- Never commit `.env` files to Git
- Keep SSH keys secure and never share them
- Use strong passwords for `ADMIN_PASSWORD`
- Regularly update Docker images for security patches
