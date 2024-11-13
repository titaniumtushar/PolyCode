import React, { useState } from "react";
import axios from 'axios';
import BackPage from "../components/BackPage";
import { Link } from "react-router-dom";

interface UploadMessageParams {
    message: string;
    file?: File;
    onUploadSuccess: (response: any) => void;
    onUploadError: (error: any) => void;
}

// Declare uploadMessage as a constant function
const UploadMessage = async ({
    message,
    file,
    onUploadSuccess,
    onUploadError
}: UploadMessageParams): Promise<void> => {
    try {
        const formData = new FormData();
        formData.append('message', message);

        if (file) {
            formData.append('file', file);
        }

        const response = await axios.post('/api/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
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
        <>
            <div>
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
                    <h2 className="text-2xl font-bold text-white mb-4">Upload Resume</h2>

                    {/* Drag-and-drop area */}
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-lg p-4 w-64 h-32 flex items-center justify-center text-center mb-4 ${
                            isDragging ? "border-purple-600 bg-gray-800" : "border-gray-500"
                        }`}
                    >
                        {resumeFile ? (
                            <p className="text-white">File ready for upload</p>
                        ) : (
                            <p className="text-gray-400">Drag and drop your file here or click "Choose File"</p>
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
                                <object data={previewUrl} type="application/pdf" width="400" height="500">
                                    <p>PDF preview is not available. <a href={previewUrl} target="_blank" rel="noopener noreferrer">Open in new tab</a></p>
                                </object>
                            ) : resumeFile?.type.startsWith("image/") ? (
                                <img src={previewUrl} alt="Resume Preview" className="w-[200px] h-auto" />
                            ) : (
                                <p className="text-white">Preview not available for this file type.</p>
                            )}
                        </div>
                    )}

                    <button
                        className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition-all mt-4"
                        onClick={handleResumeUploadDone}
                    >
                        Upload
                    </button>
                </div>
            </div>
        </>
    );
};

export default ResumeUpload;
