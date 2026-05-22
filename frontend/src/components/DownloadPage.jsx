import { useState } from "react";
import { Download, ArrowLeft, Shield, Key, Copy, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function DownloadPage({ onBack }) {
  const [fileId, setFileId] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
const handleDownload = async () => {
  if (!fileId.trim()) {
    setError("Please enter a file ID");
    return;
  }

  setDownloading(true);
  setError("");

  try {
    const response = await fetch(`http://localhost:3000/download/${fileId}`, {
      mode: 'cors',  // ← add this
    });

    if (!response.ok) throw new Error('Download failed');

    const disposition = response.headers.get('content-disposition');
    console.log("disposition:", disposition); // 🔍 debug

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

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

  } catch (err) {
    setError("Download failed. Please check your file ID and try again.");
    console.error("Download error:", err);
  } finally {
    setDownloading(false);
  }
};

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setFileId(text.trim());
    } catch (err) {
      console.error("Failed to paste:", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleDownload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex flex-col">
      
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/25">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Download Files</h1>
              <p className="text-gray-400 mt-1">Retrieve your encrypted files securely</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          
          {/* Instructions */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold">How to download</h2>
            </div>
            <ol className="space-y-3 text-sm text-gray-300">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-semibold">1</span>
                <span>Enter the file ID you received when uploading</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-semibold">2</span>
                <span>Click the download button to retrieve your file</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-semibold">3</span>
                <span>Your file will be downloaded in its encrypted format</span>
              </li>
            </ol>
          </div>

          {/* Download Form */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 shadow-xl">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              <Key className="w-4 h-4 inline mr-2" />
              File ID
            </label>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={fileId}
                onChange={(e) => setFileId(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your file ID..."
                className="flex-1 px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button
                onClick={handlePaste}
                className="px-4 py-3 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg transition-colors"
                title="Paste from clipboard"
              >
                <Copy className="w-4 h-4 text-gray-300" />
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-red-300 text-sm">{error}</span>
              </div>
            )}

            {/* Success Message */}
            {copied && (
              <div className="mb-4 p-3 bg-green-900/50 border border-green-700 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-green-300 text-sm">Download started successfully!</span>
              </div>
            )}

            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={downloading || !fileId.trim()}
              className={`w-full flex items-center justify-center gap-3 py-3 rounded-lg font-semibold transition-all duration-200 ${
                downloading || !fileId.trim()
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transform hover:-translate-y-0.5 shadow-lg hover:shadow-blue-500/25'
              }`}
            >
              {downloading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download File
                </>
              )}
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Files are downloaded in their encrypted format</p>
            <p className="mt-1">Keep your file IDs secure and private</p>
          </div>
        </div>
      </div>
    </div>
  );
}
