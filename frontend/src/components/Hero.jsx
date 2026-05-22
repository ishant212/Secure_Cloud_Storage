import { useState } from "react";
import Popup from "./Popup";
import { Shield, Upload, Lock, Cloud, Download } from "lucide-react";

export default function Hero({ onDownloadClick }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.1),transparent_70%)]"></div>
      
      {/* Floating icons */}
      <div className="absolute top-20 left-20 animate-pulse">
        <Lock className="w-8 h-8 text-orange-500/30" />
      </div>
      <div className="absolute top-40 right-32 animate-pulse delay-75">
        <Cloud className="w-10 h-10 text-orange-500/30" />
      </div>
      <div className="absolute bottom-32 left-32 animate-pulse delay-150">
        <Shield className="w-9 h-9 text-orange-500/30" />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        
        {/* Logo/Icon */}
        <div className="mb-8 flex justify-center">
          <div className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-2xl shadow-orange-500/25">
            <Shield className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Main heading */}
        <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-orange-400 to-orange-500 bg-clip-text text-transparent leading-tight">
          Secure Cloud on 
          <span className="block text-orange-400">Crypto</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          Encrypt your files using military-grade AES encryption and store them securely in the cloud.
        </p>

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <Lock className="w-4 h-4 text-orange-400" />
            <span>AES-256 Encryption</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Cloud className="w-4 h-4 text-orange-400" />
            <span>Cloud Storage</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Shield className="w-4 h-4 text-orange-400" />
            <span>Zero-Knowledge</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setOpen(true)}
            className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl font-semibold text-white shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/40 transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Upload Files
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </button>

          <button
            onClick={onDownloadClick}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download Files
          </button>
        </div>
      </div>

      {/* POPUP */}
      {open && <Popup onClose={() => setOpen(false)} />}
    </div>
  );
}