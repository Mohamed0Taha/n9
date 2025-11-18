<?php

namespace App\Console\Commands;

use App\Jobs\RunWorkflow;
use App\Models\Workflow;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class RunScheduledWorkflows extends Command
{
    protected $signature = 'workflows:run-scheduled';
    protected $description = 'Check and run scheduled workflows';

    public function handle()
    {
        $this->info('🕐 Checking for scheduled workflows...');
        
        $now = Carbon::now('UTC');
        
        // Get all workflows that are:
        // 1. Scheduled
        // 2. Active status
        // 3. Due to run (next_scheduled_run is null or in the past)
        $dueWorkflows = Workflow::where('is_scheduled', true)
            ->where('status', 'active')
            ->where(function ($query) use ($now) {
                $query->whereNull('next_scheduled_run')
                    ->orWhere('next_scheduled_run', '<=', $now);
            })
            ->get();
        
        $this->info("📊 Found {$dueWorkflows->count()} workflows due to run");
        
        foreach ($dueWorkflows as $workflow) {
            try {
                $this->info("🚀 Triggering workflow: {$workflow->name} (ID: {$workflow->id})");
                
                // Dispatch the workflow execution job
                RunWorkflow::dispatch($workflow);
                
                // Calculate next run time based on interval
                $nextRun = $this->calculateNextRun($workflow->schedule_interval, $workflow->schedule_timezone);
                
                // Update workflow timestamps
                $workflow->update([
                    'last_scheduled_run' => $now,
                    'next_scheduled_run' => $nextRun,
                ]);
                
                $this->info("✅ Scheduled next run for: {$nextRun}");
                
                Log::info("Scheduled workflow executed", [
                    'workflow_id' => $workflow->id,
                    'workflow_name' => $workflow->name,
                    'interval' => $workflow->schedule_interval,
                    'next_run' => $nextRun,
                ]);
                
            } catch (\Exception $e) {
                $this->error("❌ Failed to run workflow {$workflow->id}: {$e->getMessage()}");
                Log::error("Scheduled workflow execution failed", [
                    'workflow_id' => $workflow->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }
        
        $this->info('✅ Scheduled workflow check complete');
        return 0;
    }
    
    private function calculateNextRun(string $interval, string $timezone): Carbon
    {
        $now = Carbon::now($timezone);
        
        return match($interval) {
            'Every 10 Minutes' => $now->addMinutes(10),
            'Every 15 Minutes' => $now->addMinutes(15),
            'Every 30 Minutes' => $now->addMinutes(30),
            'Every Hour' => $now->addHour(),
            'Every 2 Hours' => $now->addHours(2),
            'Every 6 Hours' => $now->addHours(6),
            'Every 12 Hours' => $now->addHours(12),
            'Daily' => $now->addDay(),
            'Weekly' => $now->addWeek(),
            'Monthly' => $now->addMonth(),
            default => $now->addHour(), // Default to 1 hour
        };
    }
}
