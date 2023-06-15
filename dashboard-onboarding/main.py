from typing import Union
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000/dashboard-onboarding",
    "http://localhost:3000" # React dev
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Custom-Header"]
)

@app.get("/")
def read_root():
    response = requests.get("http://localhost:3000/dashboard-onboarding")

    return response.text

@app.post("/upload-video")
async def upload_video(video: UploadFile = File(...)):
    # Save the video file locally
    file_path = f"uploads/{video.filename}"
    with open(file_path, "wb") as f:
        f.write(await video.read())
    return {"file_path": file_path}

