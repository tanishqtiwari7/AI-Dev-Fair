import React, { useState } from "react";
import { summarizeCode } from "../../api";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";

const AICodeSummarizer = () => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSummarize = async () => {
    setLoading(true);
    setOutput("");

    try {
      const result = await summarizeCode(code);
      setOutput(result);
    } catch (err) {
      setOutput(" X " + err);
    }

    setLoading(false);
  };

  const copyOutput = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const clearAll = () => {
    setCode("");
    setOutput("");
    setCopied(false);
  };

  return (
    <div className="justify-center mt-20 flex">
      <div className="bg-white/90 p-7 rounded-xl shadow-md w-[1000px] flex flex-col gap-4 justify-center">
        <h2 className="text-2xl font-bold text-dark-lavender text-center">
          AI Code Summarizer & Reviewer
        </h2>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your code here..."
          className="w-full h-40 px-4 py-2 border border-gray-300 rounded-md text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-accent"
        />

        {/* Output Box */}
        <div className="border border-dashed border-gray-300 rounded-md bg-gray-50 overflow-auto h-72 p-3 text-sm">
          {output ? (
            <SyntaxHighlighter
              language="markdown"
              style={coy}
              customStyle={{ background: "transparent" }}
            >
              {output}
            </SyntaxHighlighter>
          ) : (
            <div className="text-gray-500">AI summary will appear here...</div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-between gap-2 text-xs">
          <button
            onClick={handleSummarize}
            disabled={!code}
            className="flex-1 py-2 rounded-md bg-dark-lavender text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Summarizing..." : "Summarize"}
          </button>

          <button
            onClick={copyOutput}
            disabled={!output}
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

export default AICodeSummarizer;
