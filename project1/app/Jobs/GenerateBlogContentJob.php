<?php

namespace App\Jobs;

use App\Models\BlogPost;
use App\Services\Ai\AiService;
use App\Services\Tenancy\TenantContext;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class GenerateBlogContentJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public array $backoff = [30, 120, 300];

    public function __construct(
        private readonly int $blogPostId,
        private readonly string $topic,
        private readonly string $tone
    ) {
    }

    public function handle(AiService $aiService, TenantContext $tenantContext): void
    {
        $post = BlogPost::query()->withoutGlobalScopes()->find($this->blogPostId);
        if (! $post) {
            return;
        }

        $tenantContext->setTenant($post->tenant);

        $prompt = "Write a blog post about {$this->topic} in a {$this->tone} tone. " .
            "Return a clear title on the first line, then the content.";

        $result = $aiService->generateText([
            'prompt' => $prompt,
        ]);

        $text = trim($result['text'] ?? '');
        $lines = preg_split('/\R/', $text, 2);
        $title = $lines[0] ?? $post->title ?? $this->topic;
        $content = $lines[1] ?? $text;

        $post->title = $title;
        $post->content = $content;
        $post->status = 'draft';
        $post->ai_metadata = [
            'provider' => $result['provider'] ?? null,
            'usage' => $result['usage'] ?? [],
        ];
        $post->save();

        Log::info('Blog content generated', ['post_id' => $post->id]);
    }
}
