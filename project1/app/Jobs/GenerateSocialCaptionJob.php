<?php

namespace App\Jobs;

use App\Models\SocialPost;
use App\Services\Ai\AiService;
use App\Services\Tenancy\TenantContext;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class GenerateSocialCaptionJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public array $backoff = [30, 120, 300];

    public function __construct(
        private readonly int $socialPostId,
        private readonly string $content
    ) {
    }

    public function handle(AiService $aiService, TenantContext $tenantContext): void
    {
        $post = SocialPost::query()->withoutGlobalScopes()->find($this->socialPostId);
        if (! $post) {
            return;
        }

        $tenantContext->setTenant($post->tenant);

        $prompt = "Write a {$post->platform} caption for:\n\n{$this->content}";
        $result = $aiService->generateText(['prompt' => $prompt]);

        $post->content = $result['text'] ?? $post->content;
        $post->status = 'draft';
        $post->metadata = array_merge($post->metadata ?? [], [
            'ai_provider' => $result['provider'] ?? null,
            'usage' => $result['usage'] ?? [],
        ]);
        $post->save();

        Log::info('Social caption generated', ['post_id' => $post->id]);
    }
}
