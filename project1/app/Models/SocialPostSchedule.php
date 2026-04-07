<?php

namespace App\Models;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SocialPostSchedule extends Model
{
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'social_post_id',
        'scheduled_for',
        'status',
        'attempts',
        'last_error',
    ];

    protected $casts = [
        'scheduled_for' => 'datetime',
    ];
}
