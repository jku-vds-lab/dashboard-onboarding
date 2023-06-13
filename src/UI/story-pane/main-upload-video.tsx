import { useEffect, useState } from "react";

const handleVideoUpload = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(
      "https://www.googleapis.com/upload/youtube/v3/videos?part=snippet",
      {
        method: "POST",
        headers: {
          Authorization:
            "Bearer ya29.a0AWY7Cknb6Mnmcy3yCf8U5HtxDVOq1fqKdFThx9aeSC6c0tYfl538jzWCxbrXEzwAcMSvsm9NgkVM667CZC7u1S2eB1BAUG6GhI_MVjTxieYnuKXMyRE9kZdB77XJv6QALBUSQrLHT-9NJaohr9C0-oRNLmc6aCgYKASkSARMSFQG1tDrp4d8dvQ64CYVp16MkYBFF3w0163",
        },
        body: formData,
      }
    );

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
  };

  useEffect(() => {
    if (selectedFile) {
      handleVideoUpload(selectedFile);
    }
  }, [selectedFile]);

  return (
    <div>
      <input type="file" accept="video/*" onChange={handleFileChange} />
    </div>
  );
}
