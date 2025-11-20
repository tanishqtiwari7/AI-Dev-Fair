import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// 🚀 Changed import from duotoneSpace to coy
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";

// Utility function remains the same, but we will handle the error message in the component
const decodeJWT = (token) => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
        return { error: "Invalid JWT structure (requires 3 parts separated by dots)." };
    }
    const [header, payload] = parts;

    const decodeBase64 = (str) =>
      // Base64 URL decoding: replace URL-safe characters, then decode
      JSON.parse(atob(str.replace(/-/g, "+").replace(/_/g, "/")));

    return {
      header: decodeBase64(header),
      payload: decodeBase64(payload),
    };
  } catch (e) {
    // Catch decoding errors (like invalid base64 or invalid JSON)
    return { error: "Decoding failed. Check for malformed base64 or non-JSON content." };
  }
};

const JWTdecoder = () => {
  const [jwt, setJwt] = useState("");
  const [decoded, setDecoded] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleDecode = () => {
    // Clear previous copy state
    setCopied(false); 
    if (!jwt) {
        setDecoded({ error: "Please enter a JWT." });
        return;
    }
    
    const result = decodeJWT(jwt);
    setDecoded(result);
  };

  const copyDecoded = () => {
    // Do not copy if there is an error
    if (!decoded || decoded.error) return; 
    navigator.clipboard.writeText(JSON.stringify(decoded, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const clearAll = () => {
    setJwt("");
    setDecoded(null);
    setCopied(false);
  };

  // Custom style object to ensure the SyntaxHighlighter's background is transparent
  const coyWithTransparentBackground = {
    ...coy,
    'pre[class*="language-"]': {
        ...coy['pre[class*="language-"]'],
        backgroundColor: 'transparent', 
        padding: 0, 
        margin: 0,
    },
    'code[class*="language-"]': {
        ...coy['code[class*="language-"]'],
        padding: '1rem', 
    }
  };


  return (
    <div className="justify-center mt-20 flex">
      {/* 1. Reduced width to w-[500px] */}
      <div className="bg-white/90 p-7 rounded-xl shadow-md w-[1000px] flex flex-col gap-4 justify-center">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-dark-lavender text-center">
          JWT Decoder
        </h2>

        {/* Input */}
        <textarea
          value={jwt}
          onChange={(e) => setJwt(e.target.value)}
          placeholder="Paste your JWT here (e.g., header.payload.signature)..."
          className="w-full h-24 px-4 py-2 border border-gray-300 rounded-md text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-accent"
        />

        {/* Output with Highlighting */}
        <div className="border border-dashed border-gray-300 rounded-md md:mt-5 bg-gray-50 text-gray-700 overflow-auto h-60">
          {decoded ? (
            decoded.error ? (
                // 3. Display error in red when decoding fails
                <div className="px-4 py-3 text-sm text-red-600 font-semibold whitespace-pre-wrap">
                    Error: {decoded.error}
                </div>
            ) : (
                <SyntaxHighlighter
                  language="json"
                  // 2. Using the customized 'coy' theme
                  style={coyWithTransparentBackground}
                  customStyle={{
                    margin: 0,
                    fontSize: "0.9rem",
                  }}
                >
                  {JSON.stringify(decoded, null, 2)}
                </SyntaxHighlighter>
            )
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">
              Decoded JWT will appear here
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between gap-2 text-xs">
          <button
            onClick={handleDecode}
            disabled={!jwt}
            className="flex-1 py-2 rounded-md bg-dark-lavender text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            Decode
          </button>
          <button
            onClick={copyDecoded}
            // Disable copy if there's no decoded object OR if there is an error property
            disabled={!decoded || decoded.error}
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

export default JWTdecoder;