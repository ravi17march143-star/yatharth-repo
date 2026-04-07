<?php

namespace App\Jobs;

use App\Models\MediaContent;
use App\Services\Publishing\BloggerPublisher;
use App\Services\Publishing\YouTubePublisher;
use App\Services\Tenancy\TenantContext;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class PublishMediaJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public array $backoff = [60, 180, 600];

    public function __construct(private readonly int $mediaId)
    {
    }

    public function handle(
        YouTubePublisher $youtube,
        BloggerPublisher $blogger,
        TenantContext $tenantContext
    ): void {
        $media = MediaContent::query()->withoutGlobalScopes()->find($this->mediaId);
        if (! $media) {
            return;
        }

        $tenantContext->setTenant($media->tenant);

        $provider = $media->provider ?: ($media->type === 'video' ? 'youtube' : 'blogger');

        $publisher = match ($provider) {
            'youtube' => $youtube,
            'blogger' => $blogger,
            default => throw new RuntimeException('Unsupported media publisher.'),
        };

        $result = $publisher->publishMedia($media);

        $media->external_id = $result['external_id'] ?? null;
        $media->status = 'published';
        $media->published_at = now();
        $media->save();

        Log::info('Media published', ['media_id' => $media->id]);
    }
}
