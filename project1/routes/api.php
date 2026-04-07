<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApiCredentialController;
use App\Http\Controllers\AiController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\SeoController;
use App\Http\Controllers\SocialController;
use App\Http\Controllers\WebhookController;
use App\Http\Controllers\WebhookLogController;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/credentials', [ApiCredentialController::class, 'index']);
    Route::post('/credentials', [ApiCredentialController::class, 'store']);
    Route::get('/credentials/{credentialId}', [ApiCredentialController::class, 'show']);
    Route::put('/credentials/{credentialId}', [ApiCredentialController::class, 'update']);
    Route::delete('/credentials/{credentialId}', [ApiCredentialController::class, 'destroy']);
    Route::post('/credentials/{credentialId}/validate', [ApiCredentialController::class, 'validateCredential']);

    Route::post('/ai/generate-text', [AiController::class, 'generateText']);

    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    Route::get('/blogs', [BlogController::class, 'index']);
    Route::post('/blogs', [BlogController::class, 'store']);
    Route::get('/blogs/{blog}', [BlogController::class, 'show']);
    Route::put('/blogs/{blog}', [BlogController::class, 'update']);
    Route::delete('/blogs/{blog}', [BlogController::class, 'destroy']);
    Route::post('/blogs/{blog}/generate', [BlogController::class, 'generate']);
    Route::post('/blogs/{blog}/publish', [BlogController::class, 'publish']);

    Route::get('/seo-reports', [SeoController::class, 'index']);
    Route::post('/seo-reports', [SeoController::class, 'store']);
    Route::get('/seo-reports/{seoReport}', [SeoController::class, 'show']);

    Route::get('/social-posts', [SocialController::class, 'index']);
    Route::post('/social-posts', [SocialController::class, 'store']);
    Route::get('/social-posts/{socialPost}', [SocialController::class, 'show']);
    Route::put('/social-posts/{socialPost}', [SocialController::class, 'update']);
    Route::delete('/social-posts/{socialPost}', [SocialController::class, 'destroy']);
    Route::post('/social-posts/{socialPost}/generate', [SocialController::class, 'generateCaption']);
    Route::post('/social-posts/{socialPost}/publish', [SocialController::class, 'publish']);

    Route::get('/media', [MediaController::class, 'index']);
    Route::post('/media', [MediaController::class, 'store']);
    Route::get('/media/{mediaContent}', [MediaController::class, 'show']);
    Route::delete('/media/{mediaContent}', [MediaController::class, 'destroy']);
    Route::post('/media/{mediaContent}/publish', [MediaController::class, 'publish']);

    Route::get('/webhooks', [WebhookLogController::class, 'index']);
    Route::get('/webhooks/{webhookLog}', [WebhookLogController::class, 'show']);
});

Route::post('/webhooks/incoming', [WebhookController::class, 'incoming']);
