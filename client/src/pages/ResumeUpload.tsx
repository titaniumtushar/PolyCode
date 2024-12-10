import React, { useState } from "react";
import axios from "axios";
import {Link} from "react-router-dom";

interface PreviewProps {
  previewUrl: string | null;
  resumeFile: File | null;
  previewStyle?: React.CSSProperties;
}

const CustomPreview: React.FC<PreviewProps> = ({
  previewUrl,
  resumeFile,
  previewStyle = {},
}) => {
  if (!previewUrl) {
    return null;
  }

  return (
    <div className="mt-4 mb-4" style={previewStyle}>
      {resumeFile?.type === "application/pdf" ? (
        <object
          data={previewUrl}
          type="application/pdf"
          width="400"
          height="500"
          aria-label="Resume PDF Preview"
          style={previewStyle}
        >
          <p>
            PDF preview is not available.{" "}
            <a href={previewUrl} target="_blank" rel="noopener noreferrer">
              Open in new tab
            </a>
          </p>
        </object>
      ) : resumeFile?.type.startsWith("image/") ? (
        <img
          src={previewUrl}
          alt="Resume Preview"
          className="w-[200px] h-auto"
          style={previewStyle}
        />
      ) : (
        <p>Preview not available for this file type.</p>
      )}
    </div>
  );
};

const ResumeUpload = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Handle file selection (from input)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setResumeFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Handle drag over event
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Handle drag leave event
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setResumeFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Handle resume upload
  const handleUpload = async () => {
    if (!resumeFile) {
      alert("Please choose a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", resumeFile);

    setIsUploading(true);

    try {
      // Replace with your actual backend URL
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Resume uploaded successfully!");
    } catch (error) {
      alert("Error uploading resume.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
    <Link to={"/"}>
                <div>
                    {/* <BackPage /> */}
                </div>
                <div
                    id="logo-cont"
                    className="inline-block relative text-[24px] left-1/2 -translate-x-1/2 font-bold italic mx-auto mt-[12px]"
                >
                    <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-orange-600 px-[1px]">
                        PolyCode
                    </span>
                    <span>Arena</span>
                </div>
            </Link>
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Upload Your Resume</h1>

      

      {/* Drag-and-drop area */}
      <div
        className={`border-2 border-dashed rounded-lg p-4 w-64 h-32 flex items-center justify-center text-center mb-4 mt-8 ${
          isDragging ? "border-purple-600 bg-gray-200" : "border-gray-500"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {resumeFile ? (
          <p className="text-white">File ready for upload</p>
        ) : (
          <p className="text-gray-400">Drag and drop your file here or choose a file</p>
        )}
      </div>
      {/* Custom Choose File button */}
      <label
        htmlFor="file-upload"
        className="py-2 px-6 rounded-lg hover:bg-purple-700 transition-all cursor-pointer bg-white text-black py-[6px] px-[16px] rounded-[6px] border border-black hover:bg-[#00000000] hover:border-[#00000000] hover:text-black transition active:bg-red-700 hover:bg-gradient-to-r from-orange-500 to-purple-600"
      >
        Choose File
      </label>
      <input
        type="file"
        id="file-upload"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Customizable Preview */}
      <CustomPreview
        previewUrl={previewUrl}
        resumeFile={resumeFile}
        previewStyle={{
          border: "2px solid #ddd",
          padding: "10px",
          borderRadius: "8px",
          maxWidth: "500px",
          width: "100%", // Make the preview area responsive
          textAlign: "center",
          marginBottom: "20px",
          backgroundColor: "#f9f9f9",
        }}
      />

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-all mt-4 mb-4"
        disabled={isUploading}
      >
        {isUploading ? "Uploading..." : "Upload"}
      </button>
    </div>
    </>
  );
};

export default ResumeUpload;
