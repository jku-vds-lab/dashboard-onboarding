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
      <p>{status}</p>
      <div>
        {status === "idle" && (
          <button onClick={startRecording}>Start Recording</button>
        )}
        {status === "recording" && (
          <button onClick={stopRecording}>Stop Recording</button>
        )}
        {error && <div>{error}</div>}
      </div>
      {mediaBlobUrl && (
        <button onClick={handleDownload}>Download Recording</button>
      )}
      <video src={mediaBlobUrl} controls autoPlay loop />
    </div>
  );
}

// https://pro2future-my.sharepoint.com/:v:/g/personal/vaishali_dhanoa_pro2future_at/EePprVnwemtKsqcSQDbjG5wBm9-To0CJwUs1ybCfR3URJQ?e=DwO76U
