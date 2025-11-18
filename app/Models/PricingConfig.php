<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class PricingConfig extends Model
{
    protected $fillable = [
        'key',
        'name',
        'description',
        'credit_cost',
        'is_active',
    ];

    protected $casts = [
        'credit_cost' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    /**
     * Get credit cost for a specific action (with caching)
     */
    public static function getCost(string $key): float
    {
        return Cache::remember("pricing_cost_{$key}", 3600, function () use ($key) {
            $config = self::where('key', $key)->where('is_active', true)->first();
            return $config ? (float) $config->credit_cost : 0;
        });
    }

    /**
     * Clear pricing cache
     */
    public static function clearCache(): void
    {
        $keys = self::pluck('key');
        foreach ($keys as $key) {
            Cache::forget("pricing_cost_{$key}");
        }
    }

    /**
     * Update pricing and clear cache
     */
    public function updateCost(float $cost): bool
    {
        $result = $this->update(['credit_cost' => $cost]);
        self::clearCache();
        return $result;
    }
}
