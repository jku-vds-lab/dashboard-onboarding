import { useEffect, useState } from "react";
import { saveInfoVideo } from "../../onboarding/ts/helperFunctions";

const handleVideoUpload = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("video", file);
    const response = await fetch("http://127.0.0.1:8000/upload-video", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log("Video uploaded successfully!", data);
  } catch (error) {
    console.error("Error uploading video:", error);
  }
};
export default function UploadVideo() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);

    const nodeId = document?.getElementById("Upload-Video")?.getAttribute("nodeId");
    const currentIdParts = nodeId?.split(" ");
    let category = "general";
    if(currentIdParts!.length>2){
      category = currentIdParts![1];
    }
    saveInfoVideo(selectedFile!.name, currentIdParts![0], [category], 1);
  };

  useEffect(() => {
    if (selectedFile) {
      handleVideoUpload(selectedFile);
    }
  }, [selectedFile]);

  return (
    <div className="upload">
      <input
        type="file"
        id="Upload-Video"
        className="custom-file-input"
        accept="video/*"
        onChange={handleFileChange}
      />
    </div>
  );
}
