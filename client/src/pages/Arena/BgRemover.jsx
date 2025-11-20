import React, { useState, useRef, useEffect } from "react";

const BgRemover = () => {
  const [imageFile, setImageFile] = useState(null);
  const [outputImage, setOutputImage] = useState(null); 
  const [format, setFormat] = useState("png"); 
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false); 
  
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null); 

  // 🚀 EFFECT: Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Utility Functions ---
  
  const getFormatLabel = (fmt) => {
    switch (fmt) {
      case 'png': return 'PNG (Transparency)';
      case 'jpg': return 'JPEG';
      case 'svg': return 'SVG (Vector/Tracing)';
      default: return 'Format';
    }
  };

  const formatOptions = ['png', 'jpg', 'svg'];

  // --- Handlers ---

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError("Please select a valid image file.");
        return;
      }
      setImageFile(file);
      setOutputImage(null);
      setError(null);
    }
  };

  const handleRemoveBg = async () => {
    if (!imageFile) {
      setError("Please select an image first.");
      return;
    }

    setProcessing(true);
    setError(null);
    setOutputImage(null);

    try {
      // ⚠️ PLACEHOLDER: Replace this fetch with your actual server endpoint
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('format', format); 

      const response = await fetch("/api/remove-background", {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server Error: ${response.status} - ${errorText.substring(0, 100)}`);
      }

      // Assume server returns the processed image as a Blob
      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob); 
      setOutputImage(imageUrl);

    } catch (err) {
      console.error("Background removal error:", err);
      setError(`Failed to process image. ${err.message || 'Please check the console for details.'}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!outputImage) return;
    // Download link uses the URL to download the full, original data size.
    const link = document.createElement('a');
    link.href = outputImage;
    link.download = `removed-bg-image.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // Revoke the temporary URL
    URL.revokeObjectURL(outputImage); 
  };

  const handleClear = () => {
    setImageFile(null);
    if (outputImage) URL.revokeObjectURL(outputImage); 
    setOutputImage(null);
    setError(null);
    setProcessing(false);
    if (fileInputRef.current) fileInputRef.current.value = null; 
  };

  const selectedFileName = imageFile ? imageFile.name : "No image selected";

  return (
    <div className="justify-center mt-20 flex">
      <div className="bg-white/90 p-7 rounded-xl shadow-md w-[800px] flex flex-col gap-5">
        
        <h2 className="text-2xl font-bold text-dark-lavender text-center">
          Background Remover
        </h2>

        {/* 1. Control Panel */}
        <div className="flex justify-between items-center gap-4 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
          
          {/* File Input & Name */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => fileInputRef.current.click()}
              className="py-2 px-4 rounded-md bg-dark-lavender text-white font-semibold hover:opacity-90 transition text-sm flex-shrink-0"
            >
              Choose Image
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            <span className="text-sm text-gray-700 truncate max-w-[200px]">{selectedFileName}</span>
          </div>

          {/* 🚀 CUSTOM DROPDOWN (Format Selector) */}
          <div className="relative w-48" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm bg-white flex justify-between items-center hover:border-dark-lavender focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {getFormatLabel(format)}
              <span className="ml-2">▾</span>
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-md overflow-hidden z-10">
                {formatOptions.map((opt) => (
                  <div
                    key={opt}
                    onClick={() => {
                      setFormat(opt);
                      setDropdownOpen(false);
                    }}
                    className="px-4 py-2 cursor-pointer hover:bg-dark-lavender hover:text-white text-sm"
                  >
                    {getFormatLabel(opt)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>


        {/* 2. Image Display Area - FIXED HEIGHT PANELS */}
        <div className="flex gap-4">
          
          {/* Input Image Panel - Fixed height h-[300px] */}
          <div className="w-1/2 p-3 border border-gray-300 rounded-md flex flex-col items-center justify-center bg-gray-100/70 h-[300px]">
            {/* <span className="text-sm font-semibold mb-1 text-gray-600">Original Image</span> */}
            {imageFile && !error ? (
              <img 
                src={URL.createObjectURL(imageFile)} 
                alt="Input" 
                // These classes ensure the image scales down to fit the 300px panel
                className="max-h-full max-w-full object-contain rounded-md shadow-md border border-gray-200"
              />
            ) : (
              <span className="text-gray-500 text-sm">Select an image above.</span>
            )}
          </div>

          {/* Output Image Panel (Preview) - Fixed height h-[300px] */}
          <div className="w-1/2 p-3 border border-dashed border-gray-400 rounded-md flex flex-col items-center justify-center bg-white checkerboard-bg h-[300px]">
            <span className="text-sm font-semibold mb-2 text-gray-600">Processed Image</span>
            {processing && (
                <span className="text-dark-lavender font-semibold animate-pulse">Processing... Please wait.</span>
            )}
            {error && (
                <span className="text-red-600 text-center font-medium">{error}</span>
            )}
            {outputImage && !processing ? (
              <img 
                src={outputImage} 
                alt="Output with removed background" 
                // These classes ensure the image scales down to fit the 300px panel
                className="max-h-full max-w-full object-contain rounded-md shadow-md border border-gray-200"
              />
            ) : !processing && !error ? (
              <span className="text-gray-500 text-sm">Output will appear here.</span>
            ) : null}
          </div>
        </div>

        {/* 3. Action Buttons */}
        <div className="flex justify-center gap-4 text-xs mt-2">
          <button
            onClick={handleRemoveBg}
            disabled={!imageFile || processing}
            className="flex-1 py-2 px-6 rounded-md bg-dark-lavender text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {processing ? "Removing..." : "Remove Background"}
          </button>
          <button
            onClick={handleDownload}
            disabled={!outputImage || processing}
            className="flex-1 py-2 px-6 rounded-md bg-accent text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            Download ({format.toUpperCase()})
          </button>
          <button
            onClick={handleClear}
            className="flex-1 py-2 px-6 rounded-md bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default BgRemover;