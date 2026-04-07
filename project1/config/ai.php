<?php

return [
    'providers' => [
        'openai' => [
            'base_url' => env('OPENAI_BASE_URL', 'https://api.openai.com/v1'),
            'model' => env('OPENAI_DEFAULT_MODEL', 'gpt-4.1'),
            'timeout' => env('OPENAI_TIMEOUT', 60),
            'max_retries' => env('OPENAI_MAX_RETRIES', 2),
        ],
        'gemini' => [
            'base_url' => env('GEMINI_BASE_URL', 'https://generativelanguage.googleapis.com/v1beta'),
            'model' => env('GEMINI_DEFAULT_MODEL', 'gemini-2.5-flash'),
            'timeout' => env('GEMINI_TIMEOUT', 60),
            'max_retries' => env('GEMINI_MAX_RETRIES', 2),
        ],
        'anthropic' => [
            'base_url' => env('ANTHROPIC_BASE_URL', 'https://api.anthropic.com/v1'),
            'model' => env('ANTHROPIC_DEFAULT_MODEL', 'claude-3-5-sonnet-20241022'),
            'version' => env('ANTHROPIC_VERSION', '2023-06-01'),
            'timeout' => env('ANTHROPIC_TIMEOUT', 60),
            'max_retries' => env('ANTHROPIC_MAX_RETRIES', 2),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Provider Priority
    |--------------------------------------------------------------------------
    |
    | Defines the order in which providers are attempted when a request
    | does not specify a provider explicitly.
    */
    'priority' => [
        'openai',
        'gemini',
        'anthropic',
    ],
];
