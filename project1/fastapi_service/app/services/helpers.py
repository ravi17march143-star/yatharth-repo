from typing import Any


def extract_openai_text(data: dict[str, Any]) -> str:
    output_text = data.get("output_text")
    if isinstance(output_text, str) and output_text:
        return output_text
    for item in data.get("output", []) or []:
        for content in item.get("content", []) or []:
            text = content.get("text")
            if isinstance(text, str) and text:
                return text
    fallback = data.get("choices", [{}])[0].get("message", {}).get("content")
    return fallback or ""


def extract_gemini_text(data: dict[str, Any]) -> str:
    return (
        data.get("candidates", [{}])[0]
        .get("content", {})
        .get("parts", [{}])[0]
        .get("text", "")
    )


def extract_anthropic_text(data: dict[str, Any]) -> str:
    return data.get("content", [{}])[0].get("text", "")
