<?php

namespace Tests\Feature;

use App\Jobs\GenerateBlogContentJob;
use App\Jobs\PublishBlogPostJob;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class BlogFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_blog_generate_and_publish_queue_jobs(): void
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
        ])->postJson('/api/blogs', [
            'title' => 'Test Blog',
        ]);

        $create->assertCreated();
        $blogId = $create->json('data.id');

        $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
            'X-Tenant-ID' => (string) $tenant->id,
        ])->postJson("/api/blogs/{$blogId}/generate", [
            'topic' => 'AI in 2026',
            'tone' => 'professional',
        ])->assertOk();

        $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
            'X-Tenant-ID' => (string) $tenant->id,
        ])->postJson("/api/blogs/{$blogId}/publish", [
            'provider' => 'blogger',
        ])->assertOk();

        Queue::assertPushed(GenerateBlogContentJob::class);
        Queue::assertPushed(PublishBlogPostJob::class);
    }
}
