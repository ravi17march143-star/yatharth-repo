from pydantic import BaseModel
import os


class Settings(BaseModel):
    app_name: str = "AI Microservice"
    provider: str = os.getenv("AI_PROVIDER", "openai")

    openai_base_url: str = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
    openai_api_key: str | None = os.getenv("OPENAI_API_KEY")
    openai_model: str = os.getenv("OPENAI_DEFAULT_MODEL", "gpt-4.1")

    gemini_base_url: str = os.getenv("GEMINI_BASE_URL", "https://generativelanguage.googleapis.com/v1beta")
    gemini_api_key: str | None = os.getenv("GEMINI_API_KEY")
    gemini_model: str = os.getenv("GEMINI_DEFAULT_MODEL", "gemini-2.5-flash")

    anthropic_base_url: str = os.getenv("ANTHROPIC_BASE_URL", "https://api.anthropic.com/v1")
    anthropic_api_key: str | None = os.getenv("ANTHROPIC_API_KEY")
    anthropic_model: str = os.getenv("ANTHROPIC_DEFAULT_MODEL", "claude-3-5-sonnet-20241022")
    anthropic_version: str = os.getenv("ANTHROPIC_VERSION", "2023-06-01")

    request_timeout: int = int(os.getenv("AI_TIMEOUT", "60"))


settings = Settings()
