import React, { useState } from "react";
import axios from "axios";
import BackPage from "../components/BackPage";
import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";

interface UploadMessageParams {
    message: string;
    file?: File;
    onUploadSuccess: (response: any) => void;
    onUploadError: (error: any) => void;
}

const UploadMessage = async ({
    message,
    file,
    onUploadSuccess,
    onUploadError,
}: UploadMessageParams): Promise<void> => {
    try {
        const formData = new FormData();
        formData.append("message", message);

        if (file) {
            formData.append("file", file);
        }

        const response = await axios.post("/api/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        onUploadSuccess(response.data);
    } catch (error) {
        onUploadError(error);
    }
};

const ResumeUpload = () => {
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleResumeUploadDone = () => {
        console.log("Resume Uploaded");
        alert("Resume Uploaded");
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        updateFile(file);
    };

    const updateFile = (file: File | null) => {
        setResumeFile(file);
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setPreviewUrl(null);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        updateFile(file);
    };

    return (
        <div>
            {/* Meta tags for SEO */}
            <head>
                <meta
                    name="description"
                    content="Upload your resume with ease using PolyCode Arena. Easily upload PDF, DOCX, and image files."
                />
                <meta
                    name="keywords"
                    content="resume upload, file upload, career, job application, PolyCode Arena"
                />
                <meta name="robots" content="index, follow" />
                <title>Upload Your Resume | PolyCode Arena</title>
                <link rel="canonical" href="https://yourwebsite.com/resume-upload" />
            </head>

            <Link to={"/"}>
                <div>
                    <BackPage />
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
                <h1 className="text-3xl font-bold text-white mb-4">Upload Your Resume</h1>
                <h1 className="absolute text-[38px] md:text-[48px] mx-auto text-center font-bold mt-[100px] z-50 inset-0 top-[100px]">
                        <TypeAnimation
                            sequence={[
                                "Learn",
                                2000,
                                "Solve",
                                2000,
                                "Explore",
                                2000,
                                "Prepare",
                                2000,
                                "Start Now!",
                                5000,
                            ]}
                            wrapper="span"
                            cursor={true}
                            repeat={Infinity}
                            style={{
                                fontSize: "1em",
                                display: "inline-block",
                            }}
                        />
                    </h1>

                {/* Drag-and-drop area */}
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-4 w-64 h-32 flex items-center justify-center text-center mb-4 mt-20 ${
                        isDragging
                            ? "border-purple-600 bg-gray-800"
                            : "border-gray-500"
                    }`}
                >
                    {resumeFile ? (
                        <p className="text-white">File ready for upload</p>
                    ) : (
                        <p className="text-gray-400">
                            Drag and drop your file here or click "Choose File"
                        </p>
                    )}
                </div>

                {/* Conditionally render "Choose File" button only if no file is selected */}
                {!resumeFile && (
                    <label className="py-2 px-6 rounded-lg hover:bg-purple-700 transition-all cursor-pointer bg-white text-black py-[6px] px-[16px] rounded-[6px] border border-black hover:bg-[#00000000] hover:border-[#00000000] hover:text-black transition active:bg-red-700 hover:bg-gradient-to-r from-orange-500 to-purple-600">
                        Choose File
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                )}

                {previewUrl && (
                    <div className="mt-4 border border-gray-500 p-4 rounded-lg">
                        {resumeFile?.type === "application/pdf" ? (
                            <object
                                data={previewUrl}
                                type="application/pdf"
                                width="400"
                                height="500"
                                aria-label="Resume PDF Preview"
                            >
                                <p>
                                    PDF preview is not available.{" "}
                                    <a
                                        href={previewUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Open in new tab
                                    </a>
                                </p>
                            </object>
                        ) : resumeFile?.type.startsWith("image/") ? (
                            <img
                                src={previewUrl}
                                alt="Resume Preview"
                                className="w-[200px] h-auto"
                            />
                        ) : (
                            <p className="text-white">
                                Preview not available for this file type.
                            </p>
                        )}
                    </div>
                )}

                <button
                    className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition-all mt-4"
                    onClick={handleResumeUploadDone}
                    aria-label="Upload Resume"
                >
                    Upload
                </button>
            </div>
        </div>
    );
};

export default ResumeUpload;
