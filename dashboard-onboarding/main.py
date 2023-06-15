from typing import Union
from fastapi import FastAPI, UploadFile
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

@app.get("/youtube/{video}")
def get_youtube_video(video:str):
    api_key = "AIzaSyAW55cclUDiBPa2frd8KdAeqhffj4doPPs"  # Replace with your actual YouTube API key
    url = f"https://www.googleapis.com/youtube/v3/videos?id={video}&key={api_key}&part=snippet"

    response = requests.get(url)

    if response.status_code == 200:
        video_data = response.json()
        # Process the video data and return a response
        return video_data
    else:
        return {"error": "Failed to retrieve video data"}

@app.post("/upload-video")
async def upload_video(video: UploadFile):
    # Save the video file locally
    file_path = f"{video.filename}"
    with open(file_path, "wb") as f:
        f.write(await video.read())

    # Upload the video to YouTube
    youtube_api_key = "AIzaSyAW55cclUDiBPa2frd8KdAeqhffj4doPPs"  # Replace with your actual YouTube API key
    upload_url = "https://www.googleapis.com/upload/youtube/v3/videos?part=snippet" #"https://www.googleapis.com/upload/youtube/v3/videos"

    headers = {
        "Authorization": f"Bearer ya29.a0AWY7Cknb6Mnmcy3yCf8U5HtxDVOq1fqKdFThx9aeSC6c0tYfl538jzWCxbrXEzwAcMSvsm9NgkVM667CZC7u1S2eB1BAUG6GhI_MVjTxieYnuKXMyRE9kZdB77XJv6QALBUSQrLHT-9NJaohr9C0-oRNLmc6aCgYKASkSARMSFQG1tDrp4d8dvQ64CYVp16MkYBFF3w0163",
        "Content-Type": "application/json",
    }

    data = {
        "snippet": {
            "title": "My Uploaded Video",
            "description": "Description of my video",
        },
        "status": {
            "privacyStatus": "private"
        }
    }

    response = requests.post(upload_url, headers=headers, json=data, files={"video": open(file_path, "rb")})

    # Handle the YouTube API response
    if response.status_code == 200:
        video_data = response.json()
        # Process the response data as needed
        return video_data
    else:
        return {"error": "Failed to upload video to YouTube"}
