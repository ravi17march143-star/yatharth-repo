<?php

namespace Tests\Feature;

use App\Models\ApiCredential;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class AiServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_generate_text_uses_provider_and_logs_usage(): void
    {
        $tenant = Tenant::create([
            'name' => 'Acme',
            'slug' => 'acme',
            'is_active' => true,
        ]);

        $user = User::create([
            'tenant_id' => $tenant->id,
            'name' => 'Owner',
            'email' => 'owner@example.com',
            'password' => 'secret',
        ]);

        $token = $user->createToken('test')->plainTextToken;

        ApiCredential::create([
            'tenant_id' => $tenant->id,
            'provider' => 'openai',
            'label' => 'primary',
            'secret_data' => [
                'api_key' => 'sk-test',
            ],
            'is_active' => true,
        ]);

        Http::fake([
            'api.openai.com/*' => Http::response([
                'output_text' => 'Hello from OpenAI',
                'usage' => [
                    'input_tokens' => 5,
                    'output_tokens' => 7,
                ],
            ], 200),
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
            'X-Tenant-ID' => (string) $tenant->id,
        ])->postJson('/api/ai/generate-text', [
            'prompt' => 'Say hello',
        ]);

        $response->assertOk();
        $response->assertJsonPath('data.text', 'Hello from OpenAI');

        $this->assertDatabaseHas('ai_usage_logs', [
            'tenant_id' => $tenant->id,
            'provider' => 'openai',
            'status' => 'success',
        ]);
    }
}
