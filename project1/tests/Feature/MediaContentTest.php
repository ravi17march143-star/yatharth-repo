<?php

namespace Tests\Feature;

use App\Jobs\GenerateMediaJob;
use App\Jobs\PublishMediaJob;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class MediaContentTest extends TestCase
{
    use RefreshDatabase;

    public function test_media_flow(): void
    {
        Queue::fake();

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

        $create = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
            'X-Tenant-ID' => (string) $tenant->id,
        ])->postJson('/api/media', [
            'type' => 'image',
            'prompt' => 'A futuristic city',
        ]);

        $create->assertCreated();
        $mediaId = $create->json('data.id');

        $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
            'X-Tenant-ID' => (string) $tenant->id,
        ])->postJson("/api/media/{$mediaId}/publish")->assertOk();

        Queue::assertPushed(GenerateMediaJob::class);
        Queue::assertPushed(PublishMediaJob::class);
    }
}
