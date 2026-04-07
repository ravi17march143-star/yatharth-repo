<?php

namespace Tests\Feature;

use App\Models\ApiCredential;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiCredentialTest extends TestCase
{
    use RefreshDatabase;

    private Tenant $tenant;
    private User $user;
    private array $headers;

    protected function setUp(): void
    {
        parent::setUp();

        $this->tenant = Tenant::create([
            'name' => 'Acme',
            'slug' => 'acme',
            'is_active' => true,
        ]);

        $this->user = User::create([
            'tenant_id' => $this->tenant->id,
            'name' => 'Owner',
            'email' => 'owner@example.com',
            'password' => 'secret',
        ]);

        $token = $this->user->createToken('test')->plainTextToken;

        $this->headers = [
            'Authorization' => 'Bearer ' . $token,
            'X-Tenant-ID' => (string) $this->tenant->id,
        ];
    }

    public function test_can_create_and_list_credentials(): void
    {
        $payload = [
            'provider' => 'openai',
            'label' => 'primary',
            'key_id' => 'key-1',
            'secret_data' => [
                'api_key' => 'sk-test',
            ],
            'is_active' => true,
        ];

        $create = $this->withHeaders($this->headers)->postJson('/api/credentials', $payload);
        $create->assertCreated();
        $create->assertJsonPath('data.provider', 'openai');
        $create->assertJsonMissing(['secret_data' => ['api_key' => 'sk-test']]);

        $list = $this->withHeaders($this->headers)->getJson('/api/credentials');
        $list->assertOk();
        $list->assertJsonPath('meta.total', 1);
    }

    public function test_validate_endpoint_sets_timestamp(): void
    {
        $credential = ApiCredential::create([
            'tenant_id' => $this->tenant->id,
            'provider' => 'openai',
            'label' => 'primary',
            'secret_data' => [
                'api_key' => 'sk-test',
            ],
            'is_active' => true,
        ]);

        $response = $this->withHeaders($this->headers)
            ->postJson('/api/credentials/' . $credential->id . '/validate');

        $response->assertOk();
        $response->assertJsonPath('data.validated_at', fn ($value) => ! empty($value));
    }
}
