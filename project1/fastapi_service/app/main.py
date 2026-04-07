from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import uuid

from .schemas import (
    StandardResponse,
    GenerateTextRequest,
    GenerateTextResponse,
    GenerateImageRequest,
    GenerateVideoRequest,
    GenerateBlogRequest,
    SeoAnalyzeRequest,
    SocialCaptionRequest,
)
from .services.providers import ProviderClient

app = FastAPI(title="AI Microservice", version="1.0.0")
client = ProviderClient()


@app.exception_handler(Exception)
async def handle_exception(_: Request, exc: Exception):
    request_id = str(uuid.uuid4())
    response = StandardResponse(success=False, data=None, error=str(exc), request_id=request_id)
    return JSONResponse(status_code=500, content=response.model_dump())


@app.post("/generate/text")
async def generate_text(payload: GenerateTextRequest):
    request_id = str(uuid.uuid4())
    result = await client.generate_text(
        prompt=payload.prompt,
        model=payload.model,
        temperature=payload.temperature,
        max_tokens=payload.max_tokens,
        provider=payload.provider,
    )
    response = StandardResponse(
        success=True,
        data=GenerateTextResponse(**result).model_dump(),
        error=None,
        request_id=request_id,
    )
    return JSONResponse(status_code=200, content=response.model_dump())


@app.post("/generate/blog")
async def generate_blog(payload: GenerateBlogRequest):
    prompt = f"Write a blog post about {payload.topic} in a {payload.tone} tone."
    request_id = str(uuid.uuid4())
    result = await client.generate_text(
        prompt=prompt,
        model=None,
        temperature=0.7,
        max_tokens=1500,
        provider=payload.provider,
    )
    response = StandardResponse(success=True, data=result, error=None, request_id=request_id)
    return JSONResponse(status_code=200, content=response.model_dump())


@app.post("/seo/analyze")
async def seo_analyze(payload: SeoAnalyzeRequest):
    prompt = (
        "Analyze the following content for SEO. Provide a score (0-100), "
        "top keywords, and 3 improvement suggestions:\n\n" + payload.content
    )
    request_id = str(uuid.uuid4())
    result = await client.generate_text(
        prompt=prompt,
        model=None,
        temperature=0.3,
        max_tokens=800,
        provider=None,
    )
    response = StandardResponse(success=True, data=result, error=None, request_id=request_id)
    return JSONResponse(status_code=200, content=response.model_dump())


@app.post("/social/caption")
async def social_caption(payload: SocialCaptionRequest):
    prompt = f"Write a {payload.platform} caption for:\n\n{payload.content}"
    request_id = str(uuid.uuid4())
    result = await client.generate_text(
        prompt=prompt,
        model=None,
        temperature=0.7,
        max_tokens=400,
        provider=None,
    )
    response = StandardResponse(success=True, data=result, error=None, request_id=request_id)
    return JSONResponse(status_code=200, content=response.model_dump())


@app.post("/generate/image")
async def generate_image(_: GenerateImageRequest):
    request_id = str(uuid.uuid4())
    response = StandardResponse(
        success=False,
        data=None,
        error="Image generation is not configured in this service.",
        request_id=request_id,
    )
    return JSONResponse(status_code=501, content=response.model_dump())


@app.post("/generate/video")
async def generate_video(_: GenerateVideoRequest):
    request_id = str(uuid.uuid4())
    response = StandardResponse(
        success=False,
        data=None,
        error="Video generation is not configured in this service.",
        request_id=request_id,
    )
    return JSONResponse(status_code=501, content=response.model_dump())


@app.get('/')
async def root():
    return {'status': 'ok', 'service': 'fastapi'}
