<?php

namespace App\Models;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlogPost extends Model
{
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'user_id',
        'title',
        'slug',
        'content',
        'status',
        'scheduled_at',
        'published_at',
        'meta_description',
        'tags',
        'provider',
        'external_id',
        'seo_score',
        'ai_metadata',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'published_at' => 'datetime',
        'tags' => 'array',
        'ai_metadata' => 'array',
        'seo_score' => 'decimal:2',
    ];
}
