# Deployment Guide

## Prerequisites
- Git
- Node.js 16+
- MySQL 8.0+
- A domain name
- SSL certificate

## Deployment Platforms

### Option 1: Heroku

#### Backend Deployment

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   cd server
   heroku create cameroon-tourism-api
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

#### Frontend Deployment (Vercel)

1. **Create Vercel Account** (https://vercel.com)

2. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

3. **Deploy**
   ```bash
   cd client
   vercel
   ```

### Option 2: DigitalOcean

#### Backend Deployment

1. **Create Ubuntu Droplet**
   - Choose Ubuntu 20.04 LTS
   - Size: $6/month

2. **SSH into Droplet**
   ```bash
   ssh root@your_droplet_ip
   ```

3. **Install Dependencies**
   ```bash
   apt update && apt upgrade -y
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   apt install -y nodejs mysql-server nginx
   npm install -g pm2
   ```

4. **Clone and Setup**
   ```bash
   cd /var/www
   git clone https://github.com/ASONG-DENIS15/Cameroon.git
   cd Cameroon/server
   npm install
   pm2 start server.js --name "cameroon-api"
   pm2 save
   pm2 startup
   ```

5. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/default
   ```

6. **Add SSL**
   ```bash
   apt install -y certbot python3-certbot-nginx
   certbot --nginx -d api.cameroon-tourism.com
   ```

### Option 3: AWS

1. **Create EC2 Instance**
   - AMI: Ubuntu 20.04 LTS
   - Instance Type: t2.micro

2. **Create RDS Instance**
   - Engine: MySQL 8.0
   - DB instance class: db.t2.micro

3. **Deploy Application**
   - Follow DigitalOcean steps

## Environment Setup

### Production Backend Variables
```env
NODE_ENV=production
PORT=5000
DB_HOST=<your-db-host>
DB_USER=<your-db-user>
DB_PASSWORD=<strong-password>
JWT_SECRET=<strong-random-secret>
JWT_REFRESH_SECRET=<another-strong-secret>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<your-email>
SMTP_PASS=<app-password>
FRONTEND_URL=https://cameroon-tourism.com
```

### Database Backup
```bash
mysql -u root -p cameroon_tourism > backup.sql
mysql -u root -p cameroon_tourism < backup.sql
```

## SSL Configuration

```bash
sudo certbot certonly --standalone -d your-domain.com
sudo certbot auto-renewal setup
```

## Performance Optimization

1. Enable gzip compression
2. Use CDN for static assets
3. Implement database connection pooling
4. Cache API responses
5. Use PM2 cluster mode

## Monitoring

```bash
pm2 monit
pm2 logs cameroon-api
pm2 web
```

## Rollback

```bash
git revert HEAD
git push origin main
pm2 restart cameroon-api
```
