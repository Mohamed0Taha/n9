# Development Scripts

Quick start scripts for running the local development environment.

## 🚀 Quick Start

### Start All Services
```bash
./dev.sh
```

This single command starts:
- ✅ Laravel development server (http://localhost:8000)
- ✅ Vite dev server with HMR (http://localhost:5173)
- ✅ Queue worker for background jobs

### Stop All Services
```bash
./dev-stop.sh
```

Or press `CTRL+C` while `dev.sh` is running.

## 📝 What Each Script Does

### `dev.sh` - Start Development Environment
- Starts all three services in the background
- Shows colored status output
- Tracks process IDs in `.dev-pids` file
- Displays live logs from all services
- Automatically cleans up on exit
- Handles `CTRL+C` gracefully

**Features:**
- ✨ Color-coded output
- 🔍 Health checks for each service
- 📋 Log files in `storage/logs/`
- 🛡️ Automatic cleanup on exit
- ⚡ Fast startup (no manual terminal switching)

### `dev-stop.sh` - Stop All Services
- Stops all development servers
- Kills any orphaned processes
- Cleans up PID tracking file
- Safe to run multiple times

## 📂 Log Files

Logs are saved to `storage/logs/`:
- `laravel-serve.log` - Laravel server output
- `vite.log` - Vite dev server output
- `queue-worker.log` - Queue worker output

View logs in real-time:
```bash
tail -f storage/logs/laravel-serve.log
tail -f storage/logs/vite.log
tail -f storage/logs/queue-worker.log
```

## 🔧 Troubleshooting

### Port Already in Use
If port 8000 or 5173 is already in use:
```bash
# Find and kill process using port
lsof -ti:8000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

Or run `./dev-stop.sh` first to clean up.

### Services Not Starting
1. Check if `.env` file exists
2. Ensure database is running
3. Check log files for errors:
   ```bash
   cat storage/logs/laravel-serve.log
   cat storage/logs/vite.log
   cat storage/logs/queue-worker.log
   ```

### Permissions Error
Make scripts executable:
```bash
chmod +x dev.sh dev-stop.sh
```

## 🎯 Usage Examples

### Basic Development
```bash
# Start everything
./dev.sh

# Work on your code
# Hot reload happens automatically

# Stop when done
CTRL+C
```

### Quick Restart
```bash
./dev-stop.sh && ./dev.sh
```

### Check What's Running
```bash
# View process IDs
cat .dev-pids

# Check if processes are running
ps aux | grep -E "artisan serve|vite|queue:work"
```

## 📊 Process Management

The script manages three processes:

| Service | Default Port | Command | Log File |
|---------|--------------|---------|----------|
| Laravel | 8000 | `php artisan serve` | `laravel-serve.log` |
| Vite | 5173 | `npm run dev` | `vite.log` |
| Queue Worker | N/A | `php artisan queue:work` | `queue-worker.log` |

## 🔄 Alternative: Individual Commands

If you prefer running services individually:

**Terminal 1:**
```bash
php artisan serve
```

**Terminal 2:**
```bash
npm run dev
```

**Terminal 3:**
```bash
php artisan queue:work
```

## 🐛 Debug Mode

To see more detailed output, view logs directly:
```bash
# Start services
./dev.sh

# In another terminal, view logs
tail -f storage/logs/*.log
```

## 🚨 Emergency Stop

If `CTRL+C` or `./dev-stop.sh` don't work:
```bash
# Nuclear option - kill all PHP and Node processes
pkill -9 php
pkill -9 node

# Then clean up
rm -f .dev-pids
```

## ✅ Checklist Before Starting

- [ ] `.env` file exists
- [ ] Database is running (MySQL/PostgreSQL)
- [ ] Redis is running (if using queues)
- [ ] `composer install` completed
- [ ] `npm install` completed
- [ ] `php artisan key:generate` run
- [ ] Ports 8000 and 5173 are free

## 🎉 Benefits

**Before (3 terminals):**
```bash
# Terminal 1
php artisan serve

# Terminal 2  
npm run dev

# Terminal 3
php artisan queue:work
```

**After (1 command):**
```bash
./dev.sh
```

**Time Saved:** ~30 seconds every restart ⚡

## 📚 Related Commands

```bash
# Clear cache
php artisan cache:clear

# Run migrations
php artisan migrate

# Seed database
php artisan db:seed

# Clear compiled views
php artisan view:clear

# Restart queue worker (if already running)
php artisan queue:restart
```

## 🔐 Production Note

⚠️ **These scripts are for LOCAL DEVELOPMENT ONLY**

Do not use in production. For production:
- Use proper process managers (Supervisor, PM2)
- Configure web servers (Nginx, Apache)
- Use queue workers as systemd services
- Enable proper logging and monitoring
