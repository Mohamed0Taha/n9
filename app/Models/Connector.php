<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Connector extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'name',
        'category',
        'schema',
        'supports_ai_tooling',
    ];

    protected $casts = [
        'schema' => 'array',
        'supports_ai_tooling' => 'boolean',
    ];
}
