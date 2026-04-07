<?php

namespace App\Models;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WebhookLog extends Model
{
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'direction',
        'event',
        'url',
        'status',
        'payload',
        'headers',
        'response_status',
        'response_body',
        'attempts',
        'last_error',
        'next_retry_at',
    ];

    protected $casts = [
        'payload' => 'array',
        'headers' => 'array',
        'next_retry_at' => 'datetime',
    ];
}
