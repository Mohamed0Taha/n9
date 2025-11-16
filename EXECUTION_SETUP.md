# Workflow Execution Setup

## Required: Queue Worker

For workflow execution visualization to work in real-time, you need a queue worker running.

### Start Queue Worker

In a separate terminal, run:

```bash
php artisan queue:work
```

**OR** for development with auto-reload:

```bash
php artisan queue:listen
```

### Why is this needed?

- Workflows execute asynchronously using Laravel queues
- The queue worker processes the workflow execution in the background
- This allows real-time polling to show node-by-node execution progress
- Without it, jobs will queue but never execute

### Alternative: Sync Queue (Not Recommended)

If you can't run a queue worker, you can use sync queue (no real-time visualization):

In `.env`:
```
QUEUE_CONNECTION=sync
```

This will run jobs synchronously, but you won't see the progressive execution animation.

## Troubleshooting

### "Workflow executed successfully" but no visual feedback

1. Make sure queue worker is running: `php artisan queue:work`
2. Check browser console for polling errors
3. Verify database has `jobs` table: `php artisan queue:table && php artisan migrate`

### Execution is too slow

Adjust the execution delay in `app/Jobs/RunWorkflow.php` line 58:
```php
usleep(rand(2000000, 3000000)); // 2-3 seconds
```

Change to:
```php
usleep(rand(500000, 1000000)); // 0.5-1 second
```
