# Heroku Mixed Content Error Fix 🔒

## Problem

After deploying to Heroku, the browser console showed **mixed content errors**:

```
Mixed Content: The page at 'https://pure-inlet-35276-c4fd929e7b3a.herokuapp.com/' 
was loaded over HTTPS, but requested an insecure stylesheet 
'http://pure-inlet-35276-c4fd929e7b3a.herokuapp.com/build/assets/app.css'. 
This request has been blocked; the content must be served over HTTPS.
```

### What This Means:
- Page loads over **HTTPS** (secure) ✅
- Assets (CSS/JS) requested over **HTTP** (insecure) ❌
- Browser blocks insecure requests for security
- Result: **No styles, no JavaScript, broken app** 💔

---

## Root Cause

Laravel was generating asset URLs with `http://` instead of `https://` because:

1. **Heroku uses proxies** - The app doesn't directly see HTTPS traffic
2. **Laravel didn't trust proxies** - Couldn't detect the original HTTPS request
3. **URLs generated as HTTP** - Asset URLs used the wrong scheme

### The Flow:
```
Browser (HTTPS) → Heroku Router (HTTPS) → Proxy (HTTP) → Your App (HTTP)
                                                            ↑
                                                    Laravel sees HTTP!
```

---

## Solution

### Two Changes Required:

#### 1. **Trust Heroku Proxies** (`bootstrap/app.php`)

Tell Laravel to trust all proxies so it can detect the original HTTPS request:

```php
->withMiddleware(function (Middleware $middleware): void {
    // Trust Heroku proxies for proper HTTPS detection
    $middleware->trustProxies(at: '*');
})
```

**Why?** This allows Laravel to read the `X-Forwarded-Proto` header from Heroku's proxy and understand the request was originally HTTPS.

#### 2. **Force HTTPS Scheme** (`app/Providers/AppServiceProvider.php`)

Force all generated URLs to use HTTPS in production:

```php
use Illuminate\Support\Facades\URL;

public function boot(): void
{
    // Force HTTPS in production (Heroku)
    if ($this->app->environment('production')) {
        URL::forceScheme('https');
    }
}
```

**Why?** This ensures all `url()`, `asset()`, and `route()` helpers generate HTTPS URLs.

---

## How It Works Now

### Before Fix:
```html
<!-- Generated URLs -->
<link href="http://your-app.herokuapp.com/build/assets/app.css" /> ❌
<script src="http://your-app.herokuapp.com/build/assets/app.js"></script> ❌
```

### After Fix:
```html
<!-- Generated URLs -->
<link href="https://your-app.herokuapp.com/build/assets/app.css" /> ✅
<script src="https://your-app.herokuapp.com/build/assets/app.js"></script> ✅
```

---

## Files Modified

### 1. `app/Providers/AppServiceProvider.php`
```php
<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Force HTTPS in production (Heroku)
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }
    }
}
```

### 2. `bootstrap/app.php`
```php
return Application::configure(basePath: dirname(__DIR__))
    // ... routing config ...
    ->withMiddleware(function (Middleware $middleware): void {
        // Trust Heroku proxies for proper HTTPS detection
        $middleware->trustProxies(at: '*');
    })
    // ... rest of config ...
```

---

## Verification

### Check Asset URLs:
```bash
# Before fix
curl https://your-app.herokuapp.com/ | grep -o 'http://.*\.js'
# Shows: http://your-app.herokuapp.com/build/assets/app.js ❌

# After fix
curl https://your-app.herokuapp.com/ | grep -o 'https://.*\.js'
# Shows: https://your-app.herokuapp.com/build/assets/app.js ✅
```

### Browser Console:
**Before:** Mixed content errors, no styles/scripts
**After:** Clean console, app loads perfectly ✅

---

## Why Both Changes Are Needed

### Only Trust Proxies:
```
Result: Laravel knows request was HTTPS
But: Still generates HTTP URLs by default ❌
```

### Only Force HTTPS:
```
Result: Generates HTTPS URLs
But: Laravel still thinks request was HTTP ❌
```

### Both Together:
```
Result: Laravel knows request was HTTPS ✅
And: Generates HTTPS URLs ✅
Perfect! 🎉
```

---

## Important Notes

### Trust Proxies in Production Only
While `trustProxies(at: '*')` is safe on Heroku (where all traffic goes through their proxies), you might want to be more specific in other environments:

```php
->withMiddleware(function (Middleware $middleware): void {
    if (app()->environment('production')) {
        // Heroku - trust all proxies
        $middleware->trustProxies(at: '*');
    } else {
        // Local - don't trust proxies
        $middleware->trustProxies(at: []);
    }
})
```

### Force HTTPS Only in Production
The `forceScheme` is already wrapped in an environment check, so local development still uses HTTP:

```php
if ($this->app->environment('production')) {
    URL::forceScheme('https'); // Only in production!
}
```

---

## Common Issues

### Still Getting Mixed Content?

1. **Clear browser cache**
   ```bash
   # Hard refresh:
   Ctrl+Shift+R (Windows/Linux)
   Cmd+Shift+R (Mac)
   ```

2. **Clear Laravel cache on Heroku**
   ```bash
   heroku run "php artisan config:clear"
   heroku run "php artisan route:clear"
   heroku run "php artisan view:clear"
   heroku restart
   ```

3. **Check environment**
   ```bash
   heroku config:get APP_ENV
   # Should be: production
   ```

### Assets Still Not Loading?

1. **Check Vite manifest exists**
   ```bash
   heroku run "ls -la public/build/"
   # Should show: manifest.json and assets/
   ```

2. **Rebuild assets**
   ```bash
   npm run build
   git add public/build
   git commit -m "Rebuild assets"
   git push heroku main
   ```

---

## Security Considerations

### Why Trust All Proxies on Heroku?

**Safe on Heroku because:**
- All traffic goes through Heroku's trusted proxies
- You don't have direct access from untrusted sources
- Heroku's infrastructure is secure

**Not recommended if:**
- You allow direct connections from internet
- You have untrusted proxies in front
- You're not behind Heroku's router

### Alternative (More Secure):
```php
->withMiddleware(function (Middleware $middleware): void {
    // Trust specific Heroku proxy headers
    $middleware->trustProxies(
        at: '*',
        headers: Request::HEADER_X_FORWARDED_FOR |
                Request::HEADER_X_FORWARDED_HOST |
                Request::HEADER_X_FORWARDED_PORT |
                Request::HEADER_X_FORWARDED_PROTO
    );
})
```

---

## Testing

### 1. Test Asset Loading
```bash
# Check CSS loads
curl -I https://your-app.herokuapp.com/build/assets/app.css
# Should return: 200 OK

# Check JS loads
curl -I https://your-app.herokuapp.com/build/assets/app.js
# Should return: 200 OK
```

### 2. Test URL Generation
```bash
heroku run "php artisan tinker --execute=\"echo url('/');\""
# Should show: https://your-app.herokuapp.com/
```

### 3. Browser Test
1. Open app in browser
2. Open Developer Tools (F12)
3. Check Console tab
4. Should have **no mixed content errors** ✅

---

## Deployment Checklist

For any Laravel app on Heroku:

- [ ] Set `APP_ENV=production`
- [ ] Set `APP_DEBUG=false`
- [ ] Trust proxies in `bootstrap/app.php`
- [ ] Force HTTPS in `AppServiceProvider`
- [ ] Build assets (`npm run build`)
- [ ] Commit `public/build/` directory
- [ ] Deploy to Heroku
- [ ] Test in browser with DevTools open
- [ ] Verify no mixed content warnings

---

## Performance Impact

**None!** These changes only affect URL generation:
- No additional HTTP requests
- No performance overhead
- Same asset loading speed
- Better security (HTTPS only) 🔒

---

## Related Issues

### Axios Making HTTP Requests?
```javascript
// Set base URL to use current protocol
axios.defaults.baseURL = window.location.origin;
```

### Images Not Loading?
```blade
<!-- Instead of: -->
<img src="http://example.com/image.jpg" /> ❌

<!-- Use: -->
<img src="https://example.com/image.jpg" /> ✅
<!-- Or use asset() helper: -->
<img src="{{ asset('images/logo.png') }}" /> ✅
```

---

## Additional Resources

- [Heroku HTTPS](https://devcenter.heroku.com/articles/http-routing#routing)
- [Laravel URL Generation](https://laravel.com/docs/urls)
- [Mixed Content MDN](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content)

---

## Status

✅ **FIXED!** Your app now serves all content over HTTPS:
- No mixed content warnings
- All assets load properly
- Secure HTTPS connection
- Professional deployment! 🎉

---

**Commit:**
```bash
git commit -m "fix: Force HTTPS scheme and trust proxies for Heroku to fix mixed content errors"
```

**Deployed to:** https://pure-inlet-35276-c4fd929e7b3a.herokuapp.com/
