import React from "react";
import { useReactMediaRecorder } from "react-media-recorder";

export default function RecordView() {
  const { status, startRecording, stopRecording, mediaBlobUrl, error } =
    useReactMediaRecorder({
      video: true,
      audio: true,
      screen: true,
    });

  const handleDownload = () => {
    // Create a temporary <a> element
    const downloadLink = document.createElement("a");
    downloadLink.href = mediaBlobUrl ?? "";
    downloadLink.download = "screen-recording.mp4"; // Specify the file name and extension

    // Trigger the download
    document.body.appendChild(downloadLink);
    downloadLink.click();

    // Cleanup
    document.body.removeChild(downloadLink);
  };

  return (
    <div>
      <div id="recording">
        <button id="startRecording" className="btn btn-secondary btn-xs d-flex justify-content-center align-items-center" onClick={startRecording}>Start Recording</button>
        <button id="stopRecording" className="btn btn-secondary btn-xs d-flex justify-content-center align-items-center" onClick={stopRecording}>Stop Recording</button>
      </div>
      {mediaBlobUrl && (
        <button className="btn btn-secondary btn-xs d-flex justify-content-center align-items-center" onClick={handleDownload}>Download Recording</button>
      )}
      {/* <video src={mediaBlobUrl} controls autoPlay loop /> */}
    </div>
  );
}

// https://pro2future-my.sharepoint.com/:v:/g/personal/vaishali_dhanoa_pro2future_at/EePprVnwemtKsqcSQDbjG5wBm9-To0CJwUs1ybCfR3URJQ?e=DwO76U
