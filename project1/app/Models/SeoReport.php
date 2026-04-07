<?php

namespace App\Models;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SeoReport extends Model
{
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'blog_post_id',
        'score',
        'keywords',
        'analysis',
        'status',
        'error_message',
    ];

    protected $casts = [
        'keywords' => 'array',
        'analysis' => 'array',
    ];
}
