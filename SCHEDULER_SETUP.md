# Scheduler Setup for Heroku

## Overview
The workflow scheduler checks for scheduled workflows every minute and triggers them automatically based on their configured interval.

## Setup Steps

### 1. Run Database Migration
After deploying, run the migration to add schedule fields to the workflows table:

```bash
heroku run php artisan migrate --app=pure-inlet-35276
```

### 2. Install Heroku Scheduler Add-on
The Heroku Scheduler is a free add-on that runs commands periodically:

```bash
heroku addons:create scheduler:standard --app=pure-inlet-35276
```

### 3. Configure the Scheduler
Open the Heroku Scheduler dashboard:

```bash
heroku addons:open scheduler --app=pure-inlet-35276
```

Then add a new job:
- **Command:** `php artisan schedule:run`
- **Frequency:** Every 10 minutes (or Every hour - choose based on your needs)
- **Dyno Size:** Standard-1X

**Note:** Heroku Scheduler's minimum frequency is every 10 minutes, which is perfect for checking scheduled workflows.

### 4. Verify Scheduler is Working
Check the logs to see if the scheduler is running:

```bash
heroku logs --tail --app=pure-inlet-35276
```

You should see logs like:
```
🕐 Checking for scheduled workflows...
📊 Found X workflows due to run
🚀 Triggering workflow: My Workflow (ID: 1)
✅ Scheduled next run for: 2024-11-18 10:00:00
```

## How It Works

1. **Schedule Node Configuration:**
   - User adds a Schedule node to their workflow
   - Configures interval (10 min, 1 hour, daily, etc.)
   - Saves the workflow with status "active"

2. **Automatic Detection:**
   - When workflow is saved, the system extracts schedule config from the Schedule node
   - Sets `is_scheduled=true` and saves interval/timezone

3. **Scheduler Execution:**
   - Heroku Scheduler runs `php artisan schedule:run` every 10 minutes
   - Laravel's schedule runs `workflows:run-scheduled` command every minute
   - Command checks for workflows where `next_scheduled_run` <= now
   - Triggers those workflows and calculates next run time

4. **Workflow Execution:**
   - Scheduled workflow executes just like manual execution
   - All nodes run sequentially with visual feedback
   - Next run time is updated automatically

## Schedule Intervals

- **Every 10 Minutes**: Runs every 10 minutes
- **Every 15 Minutes**: Runs every 15 minutes
- **Every 30 Minutes**: Runs every 30 minutes
- **Every Hour**: Runs every hour
- **Every 2 Hours**: Runs every 2 hours
- **Every 6 Hours**: Runs every 6 hours
- **Every 12 Hours**: Runs twice daily
- **Daily**: Runs once per day
- **Weekly**: Runs once per week
- **Monthly**: Runs once per month

## Timezone Support

Schedules respect the configured timezone:
- UTC (default)
- America/New_York
- America/Los_Angeles
- Europe/London
- Europe/Paris
- Asia/Tokyo
- And more...

## Troubleshooting

### Schedules Not Running
1. Check if Heroku Scheduler add-on is active
2. Verify migration was run successfully
3. Check workflow status is "active"
4. Ensure Schedule node has "enabled" checked
5. Check logs for errors

### Check Scheduled Workflows
Run this command to see scheduled workflows:

```bash
heroku run php artisan tinker --app=pure-inlet-35276
```

Then in tinker:
```php
App\Models\Workflow::where('is_scheduled', true)->get(['id', 'name', 'schedule_interval', 'next_scheduled_run']);
```

### Manually Trigger Scheduler
Test the scheduler manually:

```bash
heroku run php artisan workflows:run-scheduled --app=pure-inlet-35276
```

## Cost Considerations

- **Heroku Scheduler:** Free for Standard dynos
- **Worker Dyno:** Required for queue jobs (existing setup)
- **Database:** No additional cost for schedule fields

## Limitations

- Minimum interval: 10 minutes (Heroku Scheduler limitation)
- Schedules run in UTC, then converted to configured timezone
- Maximum precision: ~1 minute (due to scheduler check frequency)
