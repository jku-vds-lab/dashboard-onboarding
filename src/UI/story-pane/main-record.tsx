import React from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { saveInfoVideo } from "../../componentGraph/helperFunctions";

interface Props{
  setShowMediaOptions: any
}

export default function RecordView(props:Props) {
  const { status, startRecording, stopRecording, mediaBlobUrl, error } =
    useReactMediaRecorder({
      video: true,
      audio: true,
      screen: true,
    });

  const handleSave = async () => {
    props.setShowMediaOptions(false);
    try {
      if (mediaBlobUrl) {
        const blobResponse = await fetch(mediaBlobUrl);
        const blob = await blobResponse.blob();
        const file = new File([blob], "video.mp4", { type: blob.type });
        const formData = new FormData();
        formData.append("video", file);

        const response = await fetch("http://127.0.0.1:8000/upload-video", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        console.log("Video uploaded successfully!", data);

        assignVideoToNode();
      }
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

  const assignVideoToNode = () => {
    try {
      const nodeId = document
        ?.getElementById("saveRecording")
        ?.getAttribute("nodeId");
      const currentIdParts = nodeId?.split(" ");
      let category = "general";
      if (currentIdParts!.length > 2) {
        category = currentIdParts![1];
      }

      saveInfoVideo(
        " http://127.0.0.1:8000/upload-video/video.mp4",
        currentIdParts![0],
        [category],
        1
      );
    } catch (error) {
      console.log("Error in assigning video to node", error);
    }
  };

  return (
    <div>
      <div id="recording">
        <button
          id="startRecording"
          className="btn btn-secondary btn-xs justify-content-center align-items-center"
          onClick={startRecording}
        >
          Start Recording
        </button>
        <button
          id="stopRecording"
          className="btn btn-secondary btn-xs justify-content-center align-items-center"
          onClick={stopRecording}
        >
          Stop Recording
        </button>
      </div>
      {mediaBlobUrl && (
        <button
          id="saveRecording"
          className="btn btn-secondary btn-xs justify-content-center align-items-center"
          onClick={handleSave}
        >
          Save
        </button>
      )}
      {/* <video src={mediaBlobUrl} controls autoPlay loop /> */}
    </div>
  );
}

// https://pro2future-my.sharepoint.com/:v:/g/personal/vaishali_dhanoa_pro2future_at/EePprVnwemtKsqcSQDbjG5wBm9-To0CJwUs1ybCfR3URJQ?e=DwO76U
