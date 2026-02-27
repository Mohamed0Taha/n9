<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'organization_id',
        'name',
        'email',
        'password',
        'google_id',
        'avatar',
        'credit_balance',
        'is_admin',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'credit_balance' => 'decimal:2',
            'is_admin' => 'boolean',
        ];
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function workflows(): HasMany
    {
        return $this->hasMany(Workflow::class);
    }

    public function creditTransactions(): HasMany
    {
        return $this->hasMany(CreditTransaction::class);
    }

    /**
     * Check if user has enough credits for an action
     */
    public function hasCredits(string $action): bool
    {
        $cost = PricingConfig::getCost($action);
        return $this->credit_balance >= $cost;
    }

    /**
     * Spend credits for an action
     */
    public function spendCredits(string $action, ?int $referenceId = null, ?array $metadata = null): bool
    {
        $cost = PricingConfig::getCost($action);
        
        if ($this->credit_balance < $cost) {
            return false;
        }

        $pricing = PricingConfig::where('key', $action)->first();
        
        CreditTransaction::createTransaction(
            $this,
            'spend',
            -$cost,
            "Spent credits: {$pricing->name}",
            $action,
            $referenceId,
            $metadata
        );

        return true;
    }

    /**
     * Add credits to user account
     */
    public function addCredits(float $amount, string $description, string $type = 'purchase'): void
    {
        CreditTransaction::createTransaction(
            $this,
            $type,
            $amount,
            $description
        );
    }

    /**
     * Deduct credits from user account
     */
    public function deductCredits(float $amount, string $description, string $action = 'deduction'): bool
    {
        if ($this->credit_balance < $amount) {
            return false;
        }

        CreditTransaction::createTransaction(
            $this,
            'spend',
            -$amount,
            $description,
            $action
        );

        return true;
    }

    /**
     * Get credit cost for an action
     */
    public function getCreditCost(string $action): float
    {
        return PricingConfig::getCost($action);
    }
}
