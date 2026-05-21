"use client";

import { QRCodeCanvas } from "qrcode.react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, Copy, Link2, FileText, CheckCircle, AlertCircle } from "lucide-react";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

export default function UploadCard() {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [copied, setCopied] = useState<"code" | "link" | null>(null);

  async function uploadFile(file: File) {
    if (file.type.startsWith("video/") || file.type.startsWith("audio/")) {
      setMessage("Video and audio files are not supported");
      setMessageType("error");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setMessage("File exceeds 50MB limit");
      setMessageType("error");
      return;
    }

    setSelectedFile(file);
    setLoading(true);
    setProgress(0);
    setMessage("");
    setAccessCode("");

    const formData = new FormData();
    formData.append("file", file);
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      const data = JSON.parse(xhr.responseText);
      if (data.success) {
        setAccessCode(data.accessCode);
        setMessage("File uploaded successfully");
        setMessageType("success");
      } else {
        setMessage(data.error || "Upload failed");
        setMessageType("error");
      }
      setLoading(false);
    };

    xhr.onerror = () => {
      setMessage("Upload failed");
      setMessageType("error");
      setLoading(false);
    };

    xhr.open("POST", "/api/upload");
    xhr.send(formData);
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) uploadFile(acceptedFiles[0]);
    },
  });

  function copyToClipboard(text: string, type: "code" | "link") {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }

  function formatFileSize(bytes: number) {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div className="bg-[#111118] rounded-3xl p-6 sm:p-10 border border-[#2a2a38] shadow-2xl max-w-2xl mx-auto">

      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-[#4fffb0]/10 flex items-center justify-center mx-auto mb-4">
          <UploadCloud size={28} strokeWidth={1.5} className="text-[#4fffb0]" />
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white mb-2">
          Upload <span className="text-[#4fffb0]">file</span>
        </h1>
        <p className="text-[#8884a0] text-sm">
          Transfer files instantly between devices — no account needed.
        </p>
      </div>

      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-200
          ${isDragActive
            ? "border-[#4fffb0] bg-[#4fffb0]/5"
            : "border-[#2a2a38] hover:border-[#4fffb0]/50 hover:bg-[#4fffb0]/3"
          }`}
      >
        <input {...getInputProps()} />

        {loading ? (
          <div>
            <p className="font-mono text-sm text-[#4fffb0] mb-4">
              uploading... {progress}%
            </p>
            <div className="w-full bg-[#2a2a38] rounded-full h-1.5">
              <div
                className="bg-[#4fffb0] h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            {selectedFile && (
              <p className="font-mono text-[11px] text-[#8884a0] mt-3 truncate">
                {selectedFile.name}
              </p>
            )}
          </div>
        ) : isDragActive ? (
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#4fffb0]/20 flex items-center justify-center mx-auto mb-3">
              <UploadCloud size={24} className="text-[#4fffb0]" />
            </div>
            <p className="text-[#4fffb0] font-semibold">Drop it here</p>
          </div>
        ) : (
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#2a2a38] flex items-center justify-center mx-auto mb-3">
              <UploadCloud size={22} strokeWidth={1.5} className="text-[#8884a0]" />
            </div>
            <p className="text-white font-semibold mb-1">Drag & drop your file here</p>
            <p className="text-[#8884a0] text-sm">or <span className="text-[#4fffb0]">click to browse</span></p>
          </div>
        )}
      </div>

      {/* File type hint */}
      <p className="font-mono text-[10px] text-[#8884a0] text-center mt-3 tracking-wide">
        all file types supported except video & audio · max 50 MB
      </p>

      {/* Selected file chip */}
      {selectedFile && !loading && !accessCode && (
        <div className="mt-4 flex items-center gap-3 bg-[#16161f] border border-[#2a2a38] rounded-xl px-4 py-3">
          <div className="w-8 h-8 rounded-lg bg-[#7b5ea7]/15 flex items-center justify-center flex-shrink-0">
            <FileText size={15} className="text-[#7b5ea7]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{selectedFile.name}</p>
            <p className="font-mono text-[11px] text-[#8884a0]">{formatFileSize(selectedFile.size)}</p>
          </div>
        </div>
      )}

      {/* Error / info message */}
      {message && !accessCode && (
        <div className={`mt-4 flex items-center gap-2 rounded-xl px-4 py-3 border text-sm
          ${messageType === "error"
            ? "bg-red-500/8 border-red-500/20 text-red-400"
            : "bg-[#4fffb0]/8 border-[#4fffb0]/20 text-[#4fffb0]"
          }`}>
          {messageType === "error"
            ? <AlertCircle size={15} />
            : <CheckCircle size={15} />
          }
          {message}
        </div>
      )}

      {/* Success — access code */}
      {accessCode && (
        <>
          <div className="mt-6 bg-[#0a0a0f] border border-[#2a2a38] rounded-2xl p-6 text-center">

            {/* Pulse dot */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4fffb0] animate-pulse" />
              <span className="font-mono text-[10px] tracking-widest uppercase text-[#8884a0]">
                your transfer code
              </span>
            </div>

            {/* Code */}
            <div className="font-mono text-5xl font-medium tracking-[.3em] text-[#4fffb0] mb-1"
                 style={{ textShadow: "0 0 40px rgba(79,255,176,0.3)" }}>
              {accessCode}
            </div>

            <p className="text-[#8884a0] text-xs mb-5">share this code with your other device</p>

            {/* Action buttons */}
            <div className="flex justify-center gap-2">
              <button
                onClick={() => copyToClipboard(accessCode, "code")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-mono transition-all duration-150
                  ${copied === "code"
                    ? "border-[#4fffb0]/40 bg-[#4fffb0]/10 text-[#4fffb0]"
                    : "border-[#2a2a38] text-[#8884a0] hover:border-[#4fffb0]/40 hover:text-[#4fffb0]"
                  }`}
              >
                <Copy size={13} />
                {copied === "code" ? "copied!" : "copy code"}
              </button>

              <button
                onClick={() => copyToClipboard(`${window.location.origin}/receive?code=${accessCode}`, "link")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-mono transition-all duration-150
                  ${copied === "link"
                    ? "border-[#4fffb0]/40 bg-[#4fffb0]/10 text-[#4fffb0]"
                    : "border-[#2a2a38] text-[#8884a0] hover:border-[#4fffb0]/40 hover:text-[#4fffb0]"
                  }`}
              >
                <Link2 size={13} />
                {copied === "link" ? "copied!" : "share link"}
              </button>
            </div>
          </div>

          {/* QR code */}
          <div className="mt-5 text-center">
            <p className="font-mono text-[10px] tracking-widest uppercase text-[#8884a0] mb-4">
              or scan on mobile
            </p>
            <div className="inline-block bg-white p-3 rounded-2xl">
              <QRCodeCanvas
                value={`${window.location.origin}/receive?code=${accessCode}`}
                size={160}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}