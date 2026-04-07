<?php

namespace Tests\Feature;

use App\Services\Webhooks\WebhookSigner;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WebhookTest extends TestCase
{
    use RefreshDatabase;

    public function test_incoming_webhook_signature(): void
    {
        $payload = ['event' => 'test'];
        $raw = json_encode($payload, JSON_THROW_ON_ERROR);
        $signature = app(WebhookSigner::class)->sign($raw, config('webhooks.secret'));

        $response = $this->withHeaders([
            'X-Signature' => $signature,
            'X-Event' => 'test',
            'Content-Type' => 'application/json',
        ])->post('/api/webhooks/incoming', $payload);

        $response->assertOk();
        $response->assertJsonPath('message', 'Webhook received.');
    }
}
