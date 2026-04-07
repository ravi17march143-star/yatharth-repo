<?php

namespace App\Jobs;

use App\Models\SocialPost;
use App\Services\Publishing\SocialPublisher;
use App\Services\Tenancy\TenantContext;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class PublishSocialPostJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public array $backoff = [60, 180, 600];

    public function __construct(private readonly int $socialPostId)
    {
    }

    public function handle(SocialPublisher $publisher, TenantContext $tenantContext): void
    {
        $post = SocialPost::query()->withoutGlobalScopes()->find($this->socialPostId);
        if (! $post) {
            return;
        }

        $tenantContext->setTenant($post->tenant);

        $result = $publisher->publishSocial($post);

        $post->status = 'published';
        $post->external_id = $result['external_id'] ?? null;
        $post->published_at = now();
        $post->save();

        Log::info('Social post published', ['post_id' => $post->id]);
    }
}
