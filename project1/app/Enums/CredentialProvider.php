<?php

namespace App\Enums;

enum CredentialProvider: string
{
    case OPENAI = 'openai';
    case GEMINI = 'gemini';
    case ANTHROPIC = 'anthropic';
    case YOUTUBE = 'youtube';
    case BLOGGER = 'blogger';
    case WORDPRESS = 'wordpress';
    case FACEBOOK = 'facebook';
    case INSTAGRAM = 'instagram';
    case TIKTOK = 'tiktok';
    case LINKEDIN = 'linkedin';
    case TWITTER = 'twitter';
    case GOOGLE_SEARCH_CONSOLE = 'google_search_console';
    case GOOGLE_ANALYTICS = 'google_analytics';

    /**
     * @return array<int, string>
     */
    public function requiredSecretFields(): array
    {
        return match ($this) {
            self::OPENAI => ['api_key'],
            self::GEMINI => ['api_key'],
            self::ANTHROPIC => ['api_key'],
            self::YOUTUBE => ['client_id', 'client_secret', 'refresh_token'],
            self::BLOGGER => ['client_id', 'client_secret', 'refresh_token'],
            self::WORDPRESS => ['url', 'username', 'app_password'],
            self::GOOGLE_SEARCH_CONSOLE => ['client_id', 'client_secret', 'refresh_token'],
            self::GOOGLE_ANALYTICS => ['client_id', 'client_secret', 'refresh_token'],
            self::FACEBOOK => ['access_token'],
            self::INSTAGRAM => ['access_token'],
            self::TIKTOK => ['access_token'],
            self::LINKEDIN => ['access_token'],
            self::TWITTER => ['access_token'],
        };
    }

    /**
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_map(static fn (self $provider) => $provider->value, self::cases());
    }
}
