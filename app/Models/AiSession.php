<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'workflow_id',
        'user_id',
        'prompt',
        'response',
        'token_cost',
    ];

    protected $casts = [
        'response' => 'array',
        'token_cost' => 'decimal:3',
    ];

    public function workflow(): BelongsTo
    {
        return $this->belongsTo(Workflow::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
