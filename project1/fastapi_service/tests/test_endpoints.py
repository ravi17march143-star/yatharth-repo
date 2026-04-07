from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_generate_image_not_configured():
    response = client.post("/generate/image", json={"prompt": "A sunset over mountains"})
    assert response.status_code == 501
    body = response.json()
    assert body["success"] is False
    assert body["error"]


def test_generate_video_not_configured():
    response = client.post("/generate/video", json={"prompt": "A short product demo"})
    assert response.status_code == 501
    body = response.json()
    assert body["success"] is False
    assert body["error"]
