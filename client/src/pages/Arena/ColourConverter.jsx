import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// 🚀 Changed import from duotoneSpace to coy
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism"; 
import tinycolor from "tinycolor2"; 

const ColourConverter = () => {
  const [input, setInput] = useState("");
  const [converted, setConverted] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    try {
      const color = tinycolor(input);
      if (!color.isValid()) {
        setConverted({ error: "Invalid color format. Try HEX, RGB, or HSL." });
        return;
      }

      const cmyk = color.toCmyk ? color.toCmyk() : null;

      const result = {
        HEX: color.toHexString(),
        RGB: color.toRgbString(),
        HSL: color.toHslString(),
        HSV: color.toHsvString(),
        CMYK: cmyk
          ? `cmyk(${Math.round(cmyk.c * 100)}%, ${Math.round(cmyk.m * 100)}%, ${Math.round(cmyk.y * 100)}%, ${Math.round(cmyk.k * 100)}%)`
          : "Not available",
      };

      setConverted(result);
      setCopied(false);
    } catch (e) {
      setConverted({ error: "Conversion failed" });
    }
  };

  const copyConverted = () => {
    if (!converted || converted.error) return;
    navigator.clipboard.writeText(JSON.stringify(converted, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const clearAll = () => {
    setInput("");
    setConverted(null);
    setCopied(false);
  };

  return (
    <div className="justify-center mt-20 flex">
      {/* Width remains w-96 */}
      <div className="bg-white/90 p-7 rounded-xl shadow-md w-96 flex flex-col gap-4 justify-center">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-dark-lavender text-center">
          Colour Converter
        </h2>

        {/* Input */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter color (e.g., #ff5733, rgb(255,87,51), hsl(14,100%,60%))"
          className="w-full h-16 px-4 py-2 border border-gray-300 rounded-md text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-accent"
        />

        {/* Output */}
        <div className="border border-dashed border-gray-300 rounded-md md:mt-5 bg-white text-gray-700 overflow-auto h-60">
          {converted ? (
            <SyntaxHighlighter
              language="json"
              // 🚀 Using the simpler 'coy' theme
              style={coy} 
              customStyle={{
                margin: 0,
                background: "transparent", // Ensures overall background is transparent
                fontSize: "0.9rem",
                padding: "1rem", // Added padding inside the box
              }}
            >
              {converted.error ? JSON.stringify(converted, null, 2) : JSON.stringify(converted, (key, value) => {
                if (key === "CMYK" && typeof value === 'string' && value !== "Not available") {
                  return value.replace(/\s/g, ''); 
                }
                return value;
              }, 2)}
            </SyntaxHighlighter>
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">
              Converted colors will appear here
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between gap-2 text-xs">
          <button
            onClick={handleConvert}
            disabled={!input}
            className="flex-1 py-2 rounded-md bg-dark-lavender text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            Convert
          </button>
          <button
            onClick={copyConverted}
            disabled={!converted || converted.error}
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

export default ColourConverter;