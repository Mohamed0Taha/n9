# Deploying n9 to Heroku 🚀

Complete guide to deploy your n9 workflow automation platform to Heroku.

---

## 🎯 Prerequisites

- ✅ Heroku CLI installed
- ✅ Heroku account
- ✅ Git repository initialized

---

## 📦 What's Configured

### Procfile
```
web: vendor/bin/heroku-php-apache2 public/
worker: php artisan queue:work --timeout=300 --tries=3 --sleep=3 --verbose
```

### app.json
- Auto-provisions PostgreSQL database
- Sets up web and worker dynos
- Configures environment variables
- Runs migrations on deploy

### composer.json
- Post-install optimization scripts
- Compile script for asset building

### package.json
- heroku-postbuild script for Vite
- Build dependencies moved to dependencies

---

## 🚀 Deployment Steps

### 1. Login to Heroku
```bash
heroku login
```

### 2. Create New Heroku App
```bash
# Create app with a name
heroku create your-app-name

# Or let Heroku generate a name
heroku create
```

### 3. Add PostgreSQL Database
```bash
heroku addons:create heroku-postgresql:mini
```

### 4. Set Environment Variables
```bash
# Laravel key (will be generated)
heroku config:set APP_KEY=$(php artisan key:generate --show)

# Environment
heroku config:set APP_ENV=production
heroku config:set APP_DEBUG=false
heroku config:set LOG_CHANNEL=errorlog

# Database (auto-configured by PostgreSQL addon)
# Queue
heroku config:set QUEUE_CONNECTION=database

# Session & Cache
heroku config:set SESSION_DRIVER=database
heroku config:set CACHE_DRIVER=database

# Optional: Add your API keys
heroku config:set OPENAI_API_KEY=your-key-here
heroku config:set SLACK_WEBHOOK_URL=your-webhook-here
```

### 5. Set Buildpacks
```bash
heroku buildpacks:add --index 1 heroku/nodejs
heroku buildpacks:add --index 2 heroku/php
```

### 6. Push to Heroku
```bash
git add .
git commit -m "Configure for Heroku deployment"
git push heroku main
```

### 7. Run Migrations
```bash
heroku run php artisan migrate --force
```

### 8. **CRITICAL: Start Worker Dyno**
```bash
# Scale worker to 1 instance (THIS IS REQUIRED!)
heroku ps:scale worker=1

# Verify it's running
heroku ps
```

---

## ⚙️ Configuration Details

### Web Dyno (Always Running)
- Runs Apache web server
- Serves your application
- Handles HTTP requests

### Worker Dyno (REQUIRED!)
- Runs queue:work with 300-second timeout
- Processes workflow executions
- **Without this, workflows won't execute!**

---

## 🔍 Verify Deployment

### Check App Status
```bash
heroku ps
```

Expected output:
```
=== web (Basic): vendor/bin/heroku-php-apache2 public/ (1)
web.1: up 2024/11/17 20:30:00 +0100 (~ 1m ago)

=== worker (Basic): php artisan queue:work --timeout=300 --tries=3 --sleep=3 --verbose (1)
worker.1: up 2024/11/17 20:30:00 +0100 (~ 1m ago)
```

### View Logs
```bash
# All logs
heroku logs --tail

# Worker logs only
heroku logs --tail --dyno worker

# Web logs only
heroku logs --tail --dyno web
```

### Open App
```bash
heroku open
```

---

## 🎮 Using Your Deployed App

### Access URL
```
https://your-app-name.herokuapp.com
```

### Create Workflows
1. Visit your Heroku URL
2. Add nodes to canvas
3. Configure nodes
4. Click "Execute"
5. Worker dyno processes the workflow ✅

---

## ⚠️ Important Notes

### Worker Dyno is REQUIRED
```bash
# Always keep worker running
heroku ps:scale worker=1

# Check worker status
heroku ps | grep worker
```

Without the worker dyno, **workflows will NOT execute!**

### No Cron Jobs Needed
- ❌ You mentioned using Heroku Scheduler (10-minute cron)
- ✅ **Worker dyno runs continuously** (much better!)
- The worker dyno processes jobs immediately, not every 10 minutes

### Database Sessions
- Using database for sessions (not file-based)
- Using database for cache (Heroku filesystem is ephemeral)
- Using database for queue (persistent storage)

### Logs
- Laravel logs to `errorlog` (Heroku-compatible)
- View with `heroku logs --tail`

---

## 💰 Cost Estimates

### Hobby Tier (Recommended for Testing)
```
Web Dyno:      $7/month
Worker Dyno:   $7/month
PostgreSQL:    $5/month (mini)
---------------------------------
Total:         ~$19/month
```

### Basic Tier (Production)
```
Web Dyno:      $25/month (custom domains, SSL)
Worker Dyno:   $25/month
PostgreSQL:    $9/month (basic)
---------------------------------
Total:         ~$59/month
```

### Free Tier (Limited Hours)
- Heroku removed free tier in November 2022
- But you can use eco dynos ($5/month each)

---

## 🔧 Troubleshooting

### Workflows Not Executing?
```bash
# Check worker status
heroku ps

# If worker is not running:
heroku ps:scale worker=1

# Check worker logs
heroku logs --tail --dyno worker
```

### Build Errors?
```bash
# View build logs
heroku logs --tail

# Clear build cache
heroku plugins:install heroku-builds
heroku builds:cache:purge
```

### Database Issues?
```bash
# Check database connection
heroku pg:info

# Access database console
heroku pg:psql
```

### Application Errors?
```bash
# Enable debug mode temporarily
heroku config:set APP_DEBUG=true

# View logs
heroku logs --tail

# Disable debug when done
heroku config:set APP_DEBUG=false
```

---

## 🔄 Updating Your App

### Deploy Changes
```bash
git add .
git commit -m "Your update message"
git push heroku main
```

### Run Migrations
```bash
heroku run php artisan migrate --force
```

### Clear Cache
```bash
heroku run php artisan cache:clear
heroku run php artisan config:clear
heroku run php artisan route:clear
heroku run php artisan view:clear
```

### Restart App
```bash
heroku restart
```

---

## 📊 Monitoring

### Real-time Logs
```bash
heroku logs --tail
```

### Metrics
```bash
# View dyno metrics
heroku ps:metrics

# View PostgreSQL metrics
heroku pg:info
```

### Add Monitoring (Optional)
```bash
# Heroku's built-in metrics
heroku labs:enable runtime-dyno-metadata

# Or add external monitoring
heroku addons:create newrelic:wayne
```

---

## 🎯 Post-Deployment Checklist

- [x] Worker dyno is running (`heroku ps:scale worker=1`)
- [ ] App loads successfully (`heroku open`)
- [ ] Database is connected (`heroku pg:info`)
- [ ] Can create workflows
- [ ] Can execute workflows (check worker logs)
- [ ] Environment variables set correctly
- [ ] SSL certificate active (automatic on Heroku)
- [ ] Custom domain configured (optional)

---

## 🚀 Advanced Configuration

### Custom Domain
```bash
heroku domains:add www.yourdomain.com
heroku domains:add yourdomain.com

# Get DNS targets
heroku domains
```

### SSL Certificate
- Automatic SSL is free on Heroku!
- Custom SSL for custom domains: $20/month

### Scaling
```bash
# Scale web dynos
heroku ps:scale web=2

# Scale worker dynos
heroku ps:scale worker=2

# Scale down
heroku ps:scale web=1 worker=1
```

### Backup Database
```bash
# Create backup
heroku pg:backups:capture

# Download backup
heroku pg:backups:download

# Schedule automatic backups
heroku pg:backups:schedule --at '02:00 America/Los_Angeles'
```

---

## 📞 Support

### Heroku Status
- https://status.heroku.com

### Documentation
- https://devcenter.heroku.com/categories/php-support

### Get Help
```bash
heroku help
heroku help ps
heroku help pg
```

---

## ✅ Summary

1. **Create app**: `heroku create`
2. **Add database**: `heroku addons:create heroku-postgresql:mini`
3. **Set config**: `heroku config:set ...`
4. **Push code**: `git push heroku main`
5. **Run migrations**: `heroku run php artisan migrate --force`
6. **Start worker**: `heroku ps:scale worker=1` ← **CRITICAL!**
7. **Open app**: `heroku open`

**Your n9 workflow automation platform is now live on Heroku!** 🎉

---

## 🎯 Key Differences from Local Development

| Aspect | Local | Heroku |
|--------|-------|--------|
| **Database** | MySQL/SQLite | PostgreSQL |
| **Queue Worker** | `./START_QUEUE_WORKER.sh` | Worker dyno (automatic) |
| **File Storage** | Local disk | Ephemeral (use S3 for persistence) |
| **Sessions** | File-based | Database |
| **Cache** | File-based | Database |
| **Logs** | `storage/logs/` | `heroku logs` |

---

**No cron jobs needed - the worker dyno runs continuously and processes jobs instantly!** ⚡
