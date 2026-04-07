<?php

namespace App\Models;

use App\Enums\CredentialProvider;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApiCredential extends Model
{
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'provider',
        'label',
        'key_id',
        'secret_data',
        'is_active',
        'validated_at',
        'last_error',
        'metadata',
    ];

    protected $hidden = [
        'secret_data',
    ];

    protected $casts = [
        'provider' => CredentialProvider::class,
        'secret_data' => 'encrypted:array',
        'metadata' => 'array',
        'is_active' => 'boolean',
        'validated_at' => 'datetime',
    ];
}
