<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Tenant Resolution
    |--------------------------------------------------------------------------
    |
    | Tenants are resolved from request headers by default.
    | - X-Tenant-ID: numeric tenant id
    | - X-Tenant-Slug: tenant slug (string)
    */
    'header_id' => env('TENANCY_HEADER_ID', 'X-Tenant-ID'),
    'header_slug' => env('TENANCY_HEADER_SLUG', 'X-Tenant-Slug'),

    /*
    |--------------------------------------------------------------------------
    | Require Tenant
    |--------------------------------------------------------------------------
    |
    | When true, API requests must include a tenant identifier.
    */
    'require_tenant' => env('TENANCY_REQUIRE_TENANT', true),

    /*
    |--------------------------------------------------------------------------
    | Exempt Paths
    |--------------------------------------------------------------------------
    |
    | API paths that should bypass tenant enforcement.
    */
    'exempt_paths' => [
        'api/webhooks/incoming',
        'api/auth/register',
        'api/auth/login',
    ],
];
