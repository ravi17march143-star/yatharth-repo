from pydantic import BaseModel, Field
from typing import Any, Optional


class StandardResponse(BaseModel):
    success: bool
    data: Optional[Any] = None
    error: Optional[str] = None
    request_id: str


class GenerateTextRequest(BaseModel):
    prompt: str = Field(..., min_length=1)
    model: Optional[str] = None
    temperature: float = Field(0.7, ge=0.0, le=2.0)
    max_tokens: int = Field(1024, ge=1, le=8192)
    provider: Optional[str] = None


class GenerateTextResponse(BaseModel):
    text: str
    provider: str
    model: str
    usage: dict[str, Any] = Field(default_factory=dict)


class GenerateImageRequest(BaseModel):
    prompt: str = Field(..., min_length=1)
    provider: Optional[str] = None


class GenerateVideoRequest(BaseModel):
    prompt: str = Field(..., min_length=1)
    provider: Optional[str] = None


class GenerateBlogRequest(BaseModel):
    topic: str = Field(..., min_length=1)
    tone: Optional[str] = "professional"
    provider: Optional[str] = None


class SeoAnalyzeRequest(BaseModel):
    content: str = Field(..., min_length=1)


class SocialCaptionRequest(BaseModel):
    content: str = Field(..., min_length=1)
    platform: str = Field(..., min_length=1)
