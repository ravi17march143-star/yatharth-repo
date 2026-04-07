<?php

namespace App\Jobs;

use App\Models\WebhookLog;
use App\Services\Webhooks\WebhookSigner;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SendWebhookJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public array $backoff = [30, 120, 300];

    public function __construct(private readonly int $webhookLogId)
    {
    }

    public function handle(WebhookSigner $signer): void
    {
        $log = WebhookLog::query()->withoutGlobalScopes()->find($this->webhookLogId);
        if (! $log || ! $log->url) {
            return;
        }

        $payloadJson = json_encode($log->payload ?? [], JSON_THROW_ON_ERROR);
        $signature = $signer->sign($payloadJson, config('webhooks.secret'));

        $headers = array_merge($log->headers ?? [], [
            'X-Signature' => $signature,
            'Content-Type' => 'application/json',
        ]);

        try {
            $response = Http::timeout((int) config('webhooks.timeout', 10))
                ->withHeaders($headers)
                ->post($log->url, $log->payload ?? []);

            $log->status = $response->successful() ? 'delivered' : 'failed';
            $log->response_status = $response->status();
            $log->response_body = $response->body();
            $log->attempts = $log->attempts + 1;
            $log->last_error = $response->successful() ? null : $response->body();
            $log->save();
        } catch (\Throwable $exception) {
            $log->status = 'failed';
            $log->attempts = $log->attempts + 1;
            $log->last_error = $exception->getMessage();
            $log->next_retry_at = now()->addMinutes(5);
            $log->save();

            Log::warning('Webhook delivery failed', [
                'webhook_id' => $log->id,
                'error' => $exception->getMessage(),
            ]);

            throw $exception;
        }
    }
}
