<?php

namespace App\Jobs;

use App\Models\SeoReport;
use App\Services\Ai\AiService;
use App\Services\Tenancy\TenantContext;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class AnalyzeSeoJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public array $backoff = [60, 180, 600];

    public function __construct(
        private readonly int $reportId,
        private readonly string $content
    ) {
    }

    public function handle(AiService $aiService, TenantContext $tenantContext): void
    {
        $report = SeoReport::query()->withoutGlobalScopes()->find($this->reportId);
        if (! $report) {
            return;
        }

        $tenantContext->setTenant($report->tenant);

        $prompt = "Analyze the following content for SEO. Return a score 0-100, " .
            "top keywords, and 3 improvement suggestions.\n\n" . $this->content;

        try {
            $result = $aiService->generateText(['prompt' => $prompt]);
            $text = $result['text'] ?? '';
            preg_match('/\b([0-9]{1,3})\b/', $text, $matches);
            $score = isset($matches[1]) ? min(100, (int) $matches[1]) : null;

            $report->score = $score;
            $report->analysis = [
                'summary' => $text,
                'usage' => $result['usage'] ?? [],
            ];
            $report->status = 'completed';
            $report->save();
        } catch (\Throwable $exception) {
            $report->status = 'failed';
            $report->error_message = $exception->getMessage();
            $report->save();

            Log::warning('SEO analysis failed', [
                'report_id' => $report->id,
                'error' => $exception->getMessage(),
            ]);
        }
    }
}
