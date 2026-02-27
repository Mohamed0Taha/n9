<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Organization extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'plan',
        'settings',
    ];

    protected $casts = [
        'settings' => 'array',
    ];

    public function workflows(): HasMany
    {
        return $this->hasMany(Workflow::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    protected static function booted(): void
    {
        static::creating(function (Organization $organization): void {
            if (empty($organization->slug)) {
                $baseSlug = Str::slug($organization->name ?: 'organization');
                $organization->slug = $baseSlug ?: ('org-' . Str::random(8));
            }
        });
    }
}
