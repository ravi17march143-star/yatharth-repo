import httpx
from . import helpers
from ..config import settings


class ProviderClient:
    def __init__(self) -> None:
        self.timeout = settings.request_timeout

    async def generate_text(self, prompt: str, model: str | None, temperature: float, max_tokens: int, provider: str | None) -> dict:
        provider_name = provider or settings.provider
        if provider_name == "openai":
            return await self._openai_text(prompt, model or settings.openai_model, temperature, max_tokens)
        if provider_name == "gemini":
            return await self._gemini_text(prompt, model or settings.gemini_model, temperature, max_tokens)
        if provider_name == "anthropic":
            return await self._anthropic_text(prompt, model or settings.anthropic_model, temperature, max_tokens)
        raise ValueError(f"Unsupported provider: {provider_name}")

    async def _openai_text(self, prompt: str, model: str, temperature: float, max_tokens: int) -> dict:
        if not settings.openai_api_key:
            raise ValueError("OPENAI_API_KEY is not configured.")
        url = f"{settings.openai_base_url.rstrip('/')}/responses"
        payload = {
            "model": model,
            "input": prompt,
            "temperature": temperature,
            "max_output_tokens": max_tokens,
        }
        headers = {"Authorization": f"Bearer {settings.openai_api_key}"}
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(url, json=payload, headers=headers)
        response.raise_for_status()
        data = response.json()
        text = helpers.extract_openai_text(data)
        return {
            "text": text,
            "provider": "openai",
            "model": model,
            "usage": {
                "input_tokens": data.get("usage", {}).get("input_tokens"),
                "output_tokens": data.get("usage", {}).get("output_tokens"),
            },
        }

    async def _gemini_text(self, prompt: str, model: str, temperature: float, max_tokens: int) -> dict:
        if not settings.gemini_api_key:
            raise ValueError("GEMINI_API_KEY is not configured.")
        url = f"{settings.gemini_base_url.rstrip('/')}/models/{model}:generateContent"
        payload = {
            "contents": [
                {"role": "user", "parts": [{"text": prompt}]},
            ],
            "generationConfig": {
                "temperature": temperature,
                "maxOutputTokens": max_tokens,
            },
        }
        params = {"key": settings.gemini_api_key}
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(url, json=payload, params=params)
        response.raise_for_status()
        data = response.json()
        text = helpers.extract_gemini_text(data)
        return {
            "text": text,
            "provider": "gemini",
            "model": model,
            "usage": {
                "input_tokens": data.get("usageMetadata", {}).get("promptTokenCount"),
                "output_tokens": data.get("usageMetadata", {}).get("candidatesTokenCount"),
            },
        }

    async def _anthropic_text(self, prompt: str, model: str, temperature: float, max_tokens: int) -> dict:
        if not settings.anthropic_api_key:
            raise ValueError("ANTHROPIC_API_KEY is not configured.")
        url = f"{settings.anthropic_base_url.rstrip('/')}/messages"
        payload = {
            "model": model,
            "max_tokens": max_tokens,
            "temperature": temperature,
            "messages": [
                {"role": "user", "content": prompt},
            ],
        }
        headers = {
            "x-api-key": settings.anthropic_api_key,
            "anthropic-version": settings.anthropic_version,
        }
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(url, json=payload, headers=headers)
        response.raise_for_status()
        data = response.json()
        text = helpers.extract_anthropic_text(data)
        return {
            "text": text,
            "provider": "anthropic",
            "model": model,
            "usage": {
                "input_tokens": data.get("usage", {}).get("input_tokens"),
                "output_tokens": data.get("usage", {}).get("output_tokens"),
            },
        }
