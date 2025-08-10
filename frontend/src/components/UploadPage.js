

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const FileUploader = () => {
  const [files, setFiles] = useState([]);
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0();

  const onDrop = async (acceptedFiles) => {
    if (!isAuthenticated) {
      await loginWithRedirect();
      return;
    }

    // ✅ Get Auth0 Access Token
    const token = await getAccessTokenSilently();

    const updatedFiles = acceptedFiles.map((file) => ({
      file,
      uploading: true,
      progress: 0,
      completed: false,
    }));
    setFiles((prev) => [...prev, ...updatedFiles]);

    updatedFiles.forEach((fileData, index) => {
      const formData = new FormData();
      formData.append("file", fileData.file);

      axios
        .post("http://localhost:8000/upload", formData, {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Send only token
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setFiles((prev) =>
              prev.map((f, i) =>
                i === files.length + index ? { ...f, progress: percent } : f
              )
            );
          },
        })
        .then(() => {
          setFiles((prev) =>
            prev.map((f, i) =>
              i === files.length + index
                ? { ...f, uploading: false, completed: true }
                : f
            )
          );
        })
        .catch((err) => {
          console.error("Upload error:", err.response?.data || err.message);
          alert("Upload failed");
        });
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxSize: 50 * 1024 * 1024,
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-black to-purple-100 p-6">
      <div className="w-full max-w-2xl bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-white/30">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
          🖼️ Upload Your Images
        </h2>
        <p className="text-sm text-gray-600 text-center mb-8">
          Drag & drop JPG, PNG, or WebP images here, or click to browse.
        </p>

        <div
          {...getRootProps()}
          className={`border-4 border-dashed rounded-2xl transition-all duration-300 text-center p-12 ${
            isDragActive
              ? "border-blue-400 bg-blue-100 shadow-md scale-105"
              : "border-gray-300 bg-black hover:bg-gray-50"
          } cursor-pointer`}
        >
          <input {...getInputProps()} />
          <p className="text-gray-600 text-lg font-semibold">
            📂 Drag & drop files here
          </p>
          <p className="text-xs text-gray-400">or click to select from your device</p>
          <button className="mt-5 px-5 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition">
            <font color="black">Browse Files</font>
          </button>
        </div>

        {files.length > 0 && (
          <div className="mt-10 space-y-5">
            {files.map((f, idx) => (
              <div
                key={idx}
                className="flex flex-col p-4 rounded-xl bg-white shadow-md border border-gray-200 transition hover:shadow-lg"
              >
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {f.file.name}
                </p>
                <p className="text-xs text-gray-500 mb-1">
                  {Math.round(f.file.size / 1024)} KB
                  {f.uploading && " · Uploading..."}
                  {f.completed && (
                    <span className="text-green-600 font-medium"> · Uploaded</span>
                  )}
                </p>

                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      f.completed ? "bg-green-500" : "bg-blue-500"
                    }`}
                    style={{ width: `${f.progress}%` }}
                  ></div>
                </div>

                {f.completed && (
                  <span className="mt-2 self-end text-green-600 bg-green-100 px-3 py-1 text-xs rounded-full font-medium">
                    Done
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
