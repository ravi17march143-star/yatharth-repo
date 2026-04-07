<?php

namespace Tests\Feature;

use App\Jobs\GenerateSocialCaptionJob;
use App\Jobs\PublishSocialPostJob;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class SocialPostTest extends TestCase
{
    use RefreshDatabase;

    public function test_social_post_flow(): void
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
        ])->postJson('/api/social-posts', [
            'platform' => 'facebook',
            'content' => 'hello',
        ]);

        $create->assertCreated();
        $postId = $create->json('data.id');

        $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
            'X-Tenant-ID' => (string) $tenant->id,
        ])->postJson("/api/social-posts/{$postId}/generate", [
            'content' => 'Some content',
        ])->assertOk();

        $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
            'X-Tenant-ID' => (string) $tenant->id,
        ])->postJson("/api/social-posts/{$postId}/publish")->assertOk();

        Queue::assertPushed(GenerateSocialCaptionJob::class);
        Queue::assertPushed(PublishSocialPostJob::class);
    }
}
