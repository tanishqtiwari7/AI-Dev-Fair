import React, { useState, useRef, useEffect } from "react";
import { JSONTree } from "react-json-tree";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";

const JSONformator = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [parsedJSON, setParsedJSON] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState("pretty");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [outputHeight, setOutputHeight] = useState(400); // Default height
  const inputRef = useRef(null);
  const outputRef = useRef(null);

  useEffect(() => {
    const updateHeight = () => {
      if (inputRef.current) {
        setOutputHeight(inputRef.current.clientHeight);
      }
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    if (inputRef.current) {
      observer.observe(inputRef.current);
    }

    // Cleanup function
    return () => {
      if (inputRef.current) {
        observer.unobserve(inputRef.current);
      }
    };
  }, []); // Empty dependency array ensures it runs once on mount

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleParse = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setParsedJSON(parsed);
      setError(null);
      setCopied(false);
    } catch (e) {
      setParsedJSON(null);
      setError("Invalid JSON. Please correct it.");
    }
  };

  const handleCopy = () => {
    if (!parsedJSON) return;
    navigator.clipboard.writeText(JSON.stringify(parsedJSON, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClear = () => {
    setJsonInput("");
    setParsedJSON(null);
    setError(null);
    setCopied(false);
  };

  // Create a custom style based on 'coy' to ensure a transparent background
  // and maintain padding within the output container
  const coyWithCustomBackground = {
    ...coy,
    'pre[class*="language-"]': {
      ...coy['pre[class*="language-"]'],
      backgroundColor: "transparent", // Overrides the theme's background to transparent
      padding: 0, // Remove default padding from the pre tag
      margin: 0,
    },
  };

  return (
    <div className="justify-center mt-20 flex">
      <div className="bg-white/90 p-7 rounded-xl shadow-md w-[900px] flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-dark-lavender text-center">
          JSON Formatter
        </h2>

        {/* Side-by-side input/output */}
        <div className="flex gap-4">
          <textarea
            ref={inputRef} // 🚀 Attach ref
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste your JSON here..."
            className="w-1/2 h-64 px-4 py-3 border border-gray-300 rounded-md text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-accent"
          />

          {/* Note: The px-4 py-3 padding on this div is where the code content lives */}
          <div
           ref={outputRef} // 🚀 Attach ref
            style={{ height: outputHeight }} // 🚀 Dynamic height set by state
           className="w-1/2 border border-dashed border-gray-300 rounded-md bg-white px-4 py-3 font-mono  overflow-auto whitespace-pre-wrap text-sm">
            {error ? (
              <span className="text-red-600">{error}</span>
            ) : parsedJSON ? (
              <>
                {viewType === "pretty" && (
                  <SyntaxHighlighter
                    language="json"
                    // 🚀 Using the customized 'coy' theme
                    style={coyWithCustomBackground}
                    wrapLongLines
                    // Removed customStyle prop as it's now handled by coyWithCustomBackground
                  >
                    {JSON.stringify(parsedJSON, null, 2)}
                  </SyntaxHighlighter>
                )}
                {viewType === "raw" && (
                  <SyntaxHighlighter
                    language="json"
                    // 🚀 Using the customized 'coy' theme
                    style={coyWithCustomBackground}
                    wrapLongLines
                    // Removed customStyle prop
                  >
                    {JSON.stringify(parsedJSON)}
                  </SyntaxHighlighter>
                )}
                {viewType === "tree" && (
                  <JSONTree
                    data={parsedJSON}
                    theme={{
                      base00: "#ffffff", // background
                      base05: "#333333", // text
                    }}
                    invertTheme={false}
                  />
                )}
              </>
            ) : (
              <span className="text-gray-500">
                Formatted JSON will appear here
              </span>
            )}
          </div>
        </div>

        {/* Format dropdown */}
        <div className="relative w-48 self-center" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white flex justify-between items-center hover:border-dark-lavender focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {viewType === "pretty"
              ? "Pretty"
              : viewType === "raw"
              ? "Raw"
              : "Tree"}{" "}
            <span className="ml-2">▾</span>
          </button>
          {dropdownOpen && (
            <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-md overflow-hidden z-10">
              {["pretty", "raw", "tree"].map((opt) => (
                <div
                  key={opt}
                  onClick={() => {
                    setViewType(opt);
                    setDropdownOpen(false);
                  }}
                  className="px-4 py-2 cursor-pointer hover:bg-dark-lavender hover:text-white capitalize"
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Buttons centered below */}
        <div className="flex justify-center gap-4 text-xs mt-2">
          <button
            onClick={handleParse}
            disabled={!jsonInput}
            className="py-2 px-6 w-full rounded-md bg-dark-lavender text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            Format
          </button>
          <button
            onClick={handleCopy}
            disabled={!parsedJSON}
            className="py-2 px-6 w-full rounded-md bg-accent text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={handleClear}
            className="py-2 px-6 w-full rounded-md bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default JSONformator;
