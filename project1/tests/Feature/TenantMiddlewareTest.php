<?php

namespace Tests\Feature;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class TenantMiddlewareTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Route::middleware('api')->get('/_tenant-test', function () {
            $tenant1 = Tenant::first();
            $tenant2 = Tenant::where('slug', 'tenant-2')->first();

            $user1 = User::create([
                'name' => 'Tenant One User',
                'email' => 'tenant1@example.com',
                'password' => 'secret',
            ]);

            User::create([
                'tenant_id' => $tenant2->id,
                'name' => 'Tenant Two User',
                'email' => 'tenant2@example.com',
                'password' => 'secret',
            ]);

            return response()->json([
                'tenant_id' => $user1->tenant_id,
                'visible_users' => User::count(),
            ]);
        });
    }

    public function test_requires_tenant_header_by_default(): void
    {
        $response = $this->getJson('/api/_tenant-test');

        $response->assertStatus(400);
    }

    public function test_resolves_tenant_and_scopes_queries(): void
    {
        $tenant1 = Tenant::create([
            'name' => 'Tenant One',
            'slug' => 'tenant-1',
            'is_active' => true,
        ]);

        Tenant::create([
            'name' => 'Tenant Two',
            'slug' => 'tenant-2',
            'is_active' => true,
        ]);

        $response = $this->withHeaders([
            'X-Tenant-ID' => (string) $tenant1->id,
        ])->getJson('/api/_tenant-test');

        $response->assertOk();
        $response->assertJson([
            'tenant_id' => $tenant1->id,
            'visible_users' => 1,
        ]);
    }
}
