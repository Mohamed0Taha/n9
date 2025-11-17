# Heroku 500 Error Fix - View Path Issue 🔧

## Problem

After deploying to Heroku, the app showed a **500 Server Error** with the message:
```
View [app] not found.
```

## Root Cause

The issue was caused by **view caching during the build process** with incorrect paths:

### What Happened:
1. During Heroku build, Composer runs `php artisan optimize` in the **build directory** (`/tmp/build_xxx/`)
2. This caches view paths pointing to the build directory
3. When the app runs, it's in a different directory (`/app/`)
4. Laravel looks for views in the cached path (`/tmp/build_xxx/resources/views`) which doesn't exist at runtime
5. Result: **"View [app] not found"** error

### Evidence:
```bash
# Cached view path during build:
/tmp/build_080a6ee0/resources/views  ❌

# Actual runtime path:
/app/resources/views  ✅
```

---

## Solution

### Changes Made:

#### 1. **Updated `composer.json`**
Removed `php artisan optimize` from `post-install-cmd`:

```json
"post-install-cmd": [
    "@php artisan clear-compiled"
    // REMOVED: "@php artisan optimize"
],
```

**Why?** This prevents caching with build-time paths.

#### 2. **Updated `Procfile`**
Added cache commands to run **at runtime** when web dyno starts:

```
web: php artisan config:cache && php artisan route:cache && php artisan view:cache && vendor/bin/heroku-php-apache2 public/
```

**Why?** This caches with correct runtime paths (`/app/resources/views`).

---

## How It Works Now

### Build Process (Heroku):
1. ✅ Install Composer dependencies
2. ✅ Clear compiled files
3. ✅ Build frontend assets (Vite)
4. ❌ **NO caching** (prevents wrong paths)

### Runtime Process (Web Dyno):
1. ✅ Cache config files
2. ✅ Cache routes
3. ✅ Cache views (with correct `/app` paths)
4. ✅ Start Apache web server

---

## Verification

### Before Fix:
```bash
$ heroku logs
ERROR: View [app] not found.
Path: /tmp/build_xxx/resources/views/app.blade.php
```

### After Fix:
```bash
$ curl -I https://pure-inlet-35276-c4fd929e7b3a.herokuapp.com/
HTTP/1.1 200 OK
✅ App loads successfully!
```

---

## Key Learnings

### ❌ Don't Do This on Heroku:
```json
"post-install-cmd": [
    "@php artisan optimize"  // Caches with build paths!
]
```

### ✅ Do This Instead:
```
# Procfile
web: php artisan config:cache && php artisan route:cache && php artisan view:cache && vendor/bin/heroku-php-apache2 public/
```

---

## Commands Used to Debug

### Check view paths:
```bash
heroku run "php artisan tinker --execute=\"print_r(config('view.paths'))\""
```

### Check if view file exists:
```bash
heroku run "ls -la resources/views/"
```

### Clear all caches:
```bash
heroku run "php artisan optimize:clear"
```

### Test view loading:
```bash
heroku run "php artisan tinker --execute=\"echo view('app')\""
```

### Check recent errors:
```bash
heroku logs --num 100 | grep -i "error\|exception"
```

---

## Performance Impact

### Caching at Runtime:
- **Startup time**: +2-3 seconds (one-time cost)
- **Request speed**: ✅ Fast (cached)
- **Memory usage**: ✅ Optimized
- **Worth it**: ✅ Absolutely!

The 2-3 second startup delay happens only when:
- Dyno first starts
- App restarts
- Dyno restarts (every 24 hours)

All requests after startup are **fast** because views/routes/config are cached.

---

## Similar Issues & Solutions

### If You Get Similar Errors:

#### "Config not found"
```bash
# Add to Procfile:
web: php artisan config:cache && ...
```

#### "Route not found"
```bash
# Add to Procfile:
web: php artisan route:cache && ...
```

#### "Class not found"
```bash
# Check autoload is optimized:
composer install --optimize-autoloader --no-dev
```

---

## Testing the Fix

### 1. Check App Status
```bash
curl -I https://your-app.herokuapp.com/
# Should return: HTTP/1.1 200 OK
```

### 2. View Logs
```bash
heroku logs --tail
# Should show successful cache operations
```

### 3. Test View Loading
```bash
heroku run "php artisan tinker --execute=\"view('app')\""
# Should render HTML without errors
```

---

## Deployment Checklist

When deploying Laravel to Heroku:

- [ ] ✅ Remove `optimize` from `post-install-cmd`
- [ ] ✅ Add cache commands to `Procfile`
- [ ] ✅ Set `APP_ENV=production`
- [ ] ✅ Set `APP_DEBUG=false`
- [ ] ✅ Configure `DATABASE_URL` support
- [ ] ✅ Use database queue driver
- [ ] ✅ Start worker dyno for queue processing
- [ ] ✅ Test view loading
- [ ] ✅ Check logs for errors

---

## Files Modified

1. **`composer.json`** - Removed `optimize` from post-install
2. **`Procfile`** - Added runtime caching commands

---

## Commit History

```bash
# Fix commit:
git commit -m "fix: Cache views at runtime instead of build time to fix view paths on Heroku"

# Deploy:
git push heroku main
```

---

## Status

✅ **FIXED!** App now loads successfully at:
**https://pure-inlet-35276-c4fd929e7b3a.herokuapp.com/**

---

## Additional Notes

### Why This Happens on Heroku

Heroku uses a **two-stage deployment**:
1. **Build stage**: Code is compiled in `/tmp/build_xxx/`
2. **Runtime stage**: Code runs from `/app/`

If you cache during build, paths are wrong at runtime!

### Why Not Cache During Build?

**Pros of Build-Time Caching:**
- Faster dyno startup
- One-time operation

**Cons of Build-Time Caching:**
- ❌ Wrong paths cached
- ❌ App won't load
- ❌ 500 errors

**Winner:** Runtime caching! ✅

---

## Related Documentation

- [Heroku PHP Buildpack](https://devcenter.heroku.com/articles/php-support)
- [Laravel Optimization](https://laravel.com/docs/deployment#optimization)
- [Heroku Deployment](https://devcenter.heroku.com/articles/getting-started-with-php)

---

**Issue resolved!** Your n9 workflow automation platform is now live and working on Heroku! 🎉
