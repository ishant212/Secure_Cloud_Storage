import { motion } from "framer-motion";
import axios from "axios";
import { useState } from "react";
import { Upload, X, Shield, CheckCircle, AlertCircle, Loader2, Download, Copy } from "lucide-react";

export default function Popup({ onClose }) {
  const [fileId, setFileId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  const uploadFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setUploading(true);
    setError("");
    setUploadSuccess(false);

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await axios.post("http://localhost:3000/upload", form);

      setFileId(res.data.file_id);
      setDownloadUrl(`http://localhost:3000/download/${res.data.file_id}`);
      setUploadSuccess(true);
    } catch (err) {
      setError("Upload failed. Please try again.");
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = () => navigator.clipboard.writeText(fileId);
  const copyUrlToClipboard = () => navigator.clipboard.writeText(downloadUrl);

  // ✅ Blob download — preserves original filename and extension
  const handlePopupDownload = async () => {
    try {
      const response = await fetch(downloadUrl, { mode: 'cors' });

      if (!response.ok) throw new Error("Download failed");

      const disposition = response.headers.get('content-disposition');
      console.log("disposition:", disposition);

      let filename = `file-${fileId}`;
      if (disposition) {
        const match = disposition.match(/filename="?([^"]+)"?/i);
        if (match && match[1]) filename = match[1].trim();
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error("Download error:", err);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl w-full max-w-md border border-gray-700 shadow-2xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Secure Upload</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Upload Area */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Choose File to Encrypt & Upload
          </label>
          <div className="relative">
            <input
              type="file"
              onChange={uploadFile}
              disabled={uploading}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className={`flex items-center justify-center gap-3 w-full p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                uploading
                  ? 'border-gray-600 bg-gray-800 cursor-not-allowed'
                  : 'border-gray-600 hover:border-orange-500 hover:bg-gray-800/50'
              }`}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-6 h-6 text-orange-400 animate-spin" />
                  <span className="text-gray-300">Encrypting & Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-gray-400" />
                  <span className="text-gray-300">Click to select file</span>
                </>
              )}
            </label>
          </div>
          {fileName && !uploading && (
            <p className="mt-2 text-sm text-gray-400">Selected: {fileName}</p>
          )}
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-red-300 text-sm">{error}</span>
          </motion.div>
        )}

        {/* Success */}
        {uploadSuccess && fileId && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="p-4 bg-green-900/50 border border-green-700 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-300 font-medium">File uploaded successfully!</span>
            </div>

            {/* File ID */}
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Your File ID (keep this safe):
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-gray-900 rounded text-orange-400 font-mono text-sm">
                  {fileId}
                </code>
                <button
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Copy ID"
                >
                  <Copy className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Download URL */}
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Download URL:
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-gray-900 rounded text-blue-400 font-mono text-xs truncate">
                  {downloadUrl}
                </code>
                <button
                  onClick={copyUrlToClipboard}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Copy URL"
                >
                  <Copy className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* ✅ Fixed Download Button */}
            <button
              onClick={handlePopupDownload}
              className="w-full flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200"
            >
              <Download className="w-4 h-4" />
              Download File
            </button>
          </motion.div>
        )}

        {/* Close */}
        <button
          onClick={onClose}
          className="w-full mt-6 p-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-medium transition-colors"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}