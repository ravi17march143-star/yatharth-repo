<?php

namespace App\Jobs;

use App\Models\BlogPost;
use App\Services\Publishing\BloggerPublisher;
use App\Services\Publishing\WordPressPublisher;
use App\Services\Tenancy\TenantContext;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class PublishBlogPostJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public array $backoff = [60, 180, 600];

    public function __construct(
        private readonly int $blogPostId,
        private readonly string $provider
    ) {
    }

    public function handle(
        BloggerPublisher $blogger,
        WordPressPublisher $wordpress,
        TenantContext $tenantContext
    ): void {
        $post = BlogPost::query()->withoutGlobalScopes()->find($this->blogPostId);
        if (! $post) {
            return;
        }

        $tenantContext->setTenant($post->tenant);

        $publisher = match ($this->provider) {
            'blogger' => $blogger,
            'wordpress' => $wordpress,
            default => throw new RuntimeException('Unsupported blog publisher.'),
        };

        $result = $publisher->publishBlog($post);

        $post->provider = $this->provider;
        $post->external_id = $result['external_id'] ?? null;
        $post->status = 'published';
        $post->published_at = now();
        $post->save();

        Log::info('Blog post published', ['post_id' => $post->id, 'provider' => $this->provider]);
    }
}
