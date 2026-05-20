"use client";

import { useEffect, useState } from "react";
import { Download, AlertCircle } from "lucide-react";

type AccessResult = {
  downloadUrl?: string;
  fileName?: string;
  error?: string;
};

export default function ReceiveCard() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<AccessResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const qrCode = params.get("code");

  if (qrCode) {
    setTimeout(() => {
      setCode(qrCode);
    }, 0);
  }
}, []);

  async function handleAccess() {
    if (!code.trim()) return;

    setResult(null);
    setLoading(true);

    try {
      const res = await fetch("/api/access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessCode: code,
        }),
      });

      const data = await res.json();

      setResult(data);
      setCode("");
    } catch {
      setResult({
        error: "Something went wrong",
      });
    }

    setLoading(false);
  }

  function handleDownload() {
    if (!result?.downloadUrl) return;

    window.open(result.downloadUrl, "_blank");
    setResult(null);
  }

  return (
    <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl max-w-2xl mx-auto">
      <div className="text-center">
        <Download size={50} className="mx-auto mb-4 text-blue-400" />

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Receive File
        </h1>

        <p className="text-slate-400 mb-8 text-base sm:text-lg">
          Enter the access code to securely retrieve your file.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAccess();
            }
          }}
          placeholder="Enter access code"
          className="w-full flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-4 text-white outline-none focus:border-blue-500"
        />

        <button
          onClick={handleAccess}
          disabled={loading}
          className="w-full sm:w-auto bg-blue-600 px-6 py-4 rounded-xl text-white hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Checking..." : "Get File"}
        </button>
      </div>

      {result?.downloadUrl && (
        <div className="mt-8 bg-slate-800 rounded-2xl p-6 text-center">
          <p className="text-slate-400 mb-3">File Ready</p>

          <button
            onClick={handleDownload}
            className="w-full sm:w-auto bg-green-600 px-6 py-3 rounded-xl text-white font-semibold hover:bg-green-700 transition"
          >
            Download {result.fileName}
          </button>
        </div>
      )}

      {result?.error && (
        <div className="mt-8 bg-red-900/30 border border-red-700 rounded-2xl p-5 text-center">
          <AlertCircle className="mx-auto text-red-400 mb-3" />
          <p className="text-red-300">{result.error}</p>
        </div>
      )}
    </div>
  );
}