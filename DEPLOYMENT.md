# Production Deployment Guide

## Domain Configuration

The application is configured to run at: `https://trucochamp.mansaoferta.com.ar`

## Nginx Configuration

Create a reverse proxy configuration for Nginx:

```nginx
# /etc/nginx/sites-available/trucochamp

server {
    listen 80;
    server_name trucochamp.mansaoferta.com.ar;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name trucochamp.mansaoferta.com.ar;

    # SSL Configuration (use Certbot for Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/trucochamp.mansaoferta.com.ar/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/trucochamp.mansaoferta.com.ar/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Client (Frontend) - Serve static files
    location / {
        proxy_pass http://localhost:8085;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API (Backend)
    location /api {
        proxy_pass http://localhost:3011;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Socket.IO
    location /socket.io {
        proxy_pass http://localhost:3011;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## SSL Certificate Setup

```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d trucochamp.mansaoferta.com.ar

# Auto-renewal is configured by default
# Test renewal with:
sudo certbot renew --dry-run
```

## Deployment Steps

1. **Enable Nginx site:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/trucochamp /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

2. **Update DNS:**
   - Add an A record pointing `trucochamp.mansaoferta.com.ar` to your server IP

3. **Start Docker containers:**
   ```bash
   cd /path/to/la-vizcacha-app
   docker-compose pull
   docker-compose up -d
   ```

4. **Verify:**
   - Visit `https://trucochamp.mansaoferta.com.ar`
   - Check that API calls work correctly
   - Test Socket.IO connections (live matches)

## Environment Variables

The following environment variables are configured in `docker-compose.yml`:

- **Client:** `VITE_API_URL=https://trucochamp.mansaoferta.com.ar/api`
- **Server:** Configured to accept CORS from the production domain

## Monitoring

Check logs:
```bash
# Docker logs
docker-compose logs -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```
