import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// 🚀 Changed import from duotoneSpace to coy
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import CryptoJS from "crypto-js"; 

const HashGenerator = () => {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState(null);
  const [copied, setCopied] = useState(false);

  const generateHashes = () => {
    if (!input) {
      setHashes(null);
      return;
    }

    const results = {
      // Use .toUpperCase() for cleaner hash output, though CryptoJS already returns hex.
      "MD5": CryptoJS.MD5(input).toString().toUpperCase(),
      "SHA-1": CryptoJS.SHA1(input).toString().toUpperCase(),
      "SHA-256": CryptoJS.SHA256(input).toString().toUpperCase(),
      "SHA-512": CryptoJS.SHA512(input).toString().toUpperCase(),
      "RIPEMD-160": CryptoJS.RIPEMD160(input).toString().toUpperCase(),
    };

    setHashes(results);
    setCopied(false);
  };

  const copyHashes = () => {
    if (!hashes) return;
    // Format JSON output for copying
    navigator.clipboard.writeText(JSON.stringify(hashes, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const clearAll = () => {
    setInput("");
    setHashes(null);
    setCopied(false);
  };
  
  // Custom style object to ensure the SyntaxHighlighter's background is transparent
  // and remove default padding/margin added by the 'coy' theme's pre tag style.
  const coyWithTransparentBackground = {
    ...coy,
    'pre[class*="language-"]': {
        ...coy['pre[class*="language-"]'],
        backgroundColor: 'transparent', 
        padding: 0, 
        margin: 0,
    },
    // Adding extra padding for the code content itself
    'code[class*="language-"]': {
        ...coy['code[class*="language-"]'],
        padding: '1rem', 
    }
  };


  return (
    <div className="justify-center mt-20 flex">
      {/* Reduced width from w-[1000px] to w-[500px] for a better fit */}
      <div className="bg-white/90 p-7 rounded-xl shadow-md w-[500px] flex flex-col gap-4 justify-center">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-dark-lavender text-center">
          Hash Generator
        </h2>

        {/* Input */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to hash..."
          className="w-full h-24 px-4 py-2 border border-gray-300 rounded-md text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-accent"
        />

        {/* Output with Highlighting */}
        {/* The bg-gray-50 color will show through clearly */}
        <div className="border border-dashed border-gray-300 rounded-md md:mt-5 bg-gray-50 text-gray-700 overflow-auto h-60">
          {hashes ? (
            <SyntaxHighlighter
              language="json"
              // 🚀 Using the customized 'coy' theme
              style={coyWithTransparentBackground} 
              customStyle={{
                margin: 0,
                fontSize: "0.9rem",
                // Removed redundant background styling here since it's in the theme object
              }}
            >
              {JSON.stringify(hashes, null, 2)}
            </SyntaxHighlighter>
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">
              Generated hashes will appear here
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between gap-2 text-xs">
          <button
            onClick={generateHashes}
            disabled={!input}
            className="flex-1 py-2 rounded-md bg-dark-lavender text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            Generate
          </button>
          <button
            onClick={copyHashes}
            disabled={!hashes}
            className="flex-1 py-2 rounded-md bg-accent text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={clearAll}
            className="flex-1 py-2 rounded-md bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default HashGenerator;