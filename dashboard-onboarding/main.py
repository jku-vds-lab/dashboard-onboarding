from typing import Union
from fastapi import FastAPI, Body, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
import openai
from pydantic import BaseModel
from typing import Annotated
app = FastAPI()

class ModelValues(BaseModel):
    prompt: str
    tokens: int


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

@app.post("/chat-completion")
async def chat_completion(model_values: ModelValues = Body(...)):
    os.environ['OPENAI_API_KEY'] = '' #key goes here
    openai.api_key = os.environ.get('OPENAI_API_KEY')
    openai.Model.list()
    response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "system", "content": model_values.prompt}
                ],
                temperature = 0.7,
                max_tokens = model_values.tokens,
                top_p = 1,
                frequency_penalty = 0,
                presence_penalty = 0,
                )
    return response