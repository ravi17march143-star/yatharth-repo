<?php

namespace Tests\Feature;

use App\Jobs\AnalyzeSeoJob;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class SeoReportTest extends TestCase
{
    use RefreshDatabase;

    public function test_seo_report_dispatches_job(): void
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

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
            'X-Tenant-ID' => (string) $tenant->id,
        ])->postJson('/api/seo-reports', [
            'content' => 'Some content for SEO analysis.',
        ]);

        $response->assertCreated();

        Queue::assertPushed(AnalyzeSeoJob::class);
    }
}
