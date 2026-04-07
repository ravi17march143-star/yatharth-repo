<?php

namespace App\Jobs;

use App\Models\MediaContent;
use App\Services\Tenancy\TenantContext;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class GenerateMediaJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public array $backoff = [60, 180, 600];

    public function __construct(private readonly int $mediaId)
    {
    }

    public function handle(TenantContext $tenantContext): void
    {
        $media = MediaContent::query()->withoutGlobalScopes()->find($this->mediaId);
        if (! $media) {
            return;
        }

        $tenantContext->setTenant($media->tenant);

        $baseUrl = rtrim(config('services.fastapi.base_url'), '/');
        $endpoint = $media->type === 'video' ? '/generate/video' : '/generate/image';

        try {
            $response = Http::timeout(60)
                ->post($baseUrl . $endpoint, [
                    'prompt' => $media->prompt,
                    'provider' => $media->provider,
                ]);

            if (! $response->successful()) {
                throw new \RuntimeException($response->body());
            }

            $data = $response->json();
            $url = data_get($data, 'data.url');
            $binary = data_get($data, 'data.binary');

            if ($binary) {
                $path = 'media/' . $media->id . '_' . time() . '.bin';
                Storage::disk('local')->put($path, base64_decode($binary));
                $media->file_path = $path;
            } elseif ($url) {
                $media->metadata = array_merge($media->metadata ?? [], ['source_url' => $url]);
            } else {
                throw new \RuntimeException('Media generation did not return a file.');
            }

            $media->status = 'ready';
            $media->save();
        } catch (\Throwable $exception) {
            $media->status = 'failed';
            $media->metadata = array_merge($media->metadata ?? [], ['error' => $exception->getMessage()]);
            $media->save();

            Log::warning('Media generation failed', [
                'media_id' => $media->id,
                'error' => $exception->getMessage(),
            ]);
        }
    }
}
