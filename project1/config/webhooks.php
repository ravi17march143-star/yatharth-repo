<?php

return [
    'secret' => env('WEBHOOK_SECRET', 'change-me'),
    'timeout' => env('WEBHOOK_TIMEOUT', 10),
    'max_retries' => env('WEBHOOK_MAX_RETRIES', 3),
];
