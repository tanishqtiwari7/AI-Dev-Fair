import React, { useState } from "react";
import axios from "axios";
import MermaidDiagram from "../../components/MermaidDiagram";
import {
  FaGithub,
  FaExclamationTriangle,
  FaLayerGroup,
  FaCogs,
  FaDatabase,
} from "react-icons/fa";

const ArchitectureForge = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const token = localStorage.getItem("token");

  const analyzeRepo = async () => {
    if (!repoUrl) {
      setError("Please enter a GitHub repo URL.");
      return;
    }
    if (!repoUrl.includes("github.com")) {
      setError("Please enter a valid GitHub URL.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setCopied(false);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/architecture/analyze`,
        { repoUrl },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      setResult(response.data.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Analysis failed. Please check the URL and try again."
      );
    }

    setLoading(false);
  };

  const copyArchitecture = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const clearAll = () => {
    setRepoUrl("");
    setResult(null);
    setError("");
    setCopied(false);
  };

  return (
    <div className="justify-center mt-20 flex pb-20 min-h-screen">
      <div className="bg-white/90 p-7 rounded-xl shadow-md w-[1000px] flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-dark-lavender text-center">
          Architecture Forge
        </h2>

        <input
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="Paste GitHub repo URL e.g. https://github.com/owner/repo"
          className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent"
          onKeyDown={(e) => e.key === "Enter" && analyzeRepo()}
        />

        {/* Summary + Meta */}
        <div className="flex gap-4">
          <div className="flex-1 border border-dashed border-gray-300 rounded-md bg-gray-50 p-4 min-h-[100px]">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">
              Executive Summary
            </h3>
            {result?.summary ? (
              <div className="text-sm text-gray-800">{result.summary}</div>
            ) : (
              <div className="text-sm text-gray-500">
                Summary will appear here after analysis.
              </div>
            )}
          </div>

          <div className="w-1/3 border border-dashed border-gray-300 rounded-md bg-gray-50 p-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">
              Components & Layers
            </h3>
            {result ? (
              <div className="space-y-3">
                {/* Layers */}
                <div>
                  <div className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <FaLayerGroup className="text-blue-500" /> Layers
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {result.layers?.map((l, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded"
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Components */}
                <div>
                  <div className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <FaCogs className="text-green-500" /> Components
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {result.key_components?.map((c, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                Architecture details will show here.
              </div>
            )}
          </div>
        </div>

        {/* Diagram Preview */}
        <div className="border border-gray-300 rounded-md bg-white overflow-hidden min-h-[300px] p-3 relative">
          <h3 className="text-sm font-semibold text-gray-600 mb-2 absolute top-3 left-3 z-10 bg-white/80 px-2 rounded">
            Architecture Diagram
          </h3>
          {result?.tree_mermaid ? (
            <div className="flex justify-center pt-8">
              <MermaidDiagram code={result.tree_mermaid} />
            </div>
          ) : (
            <div className="text-gray-500 flex items-center justify-center h-full pt-8">
              Diagram will appear here...
            </div>
          )}
        </div>

        {/* Data Flow & Issues (Extra Split) */}
        {result && (
          <div className="flex gap-4">
            <div className="flex-1 border border-dashed border-blue-200 rounded-md bg-blue-50/50 p-4">
              <h3 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <FaDatabase /> Data Flow
              </h3>
              <p className="text-xs text-blue-900 whitespace-pre-wrap">
                {result.data_flow}
              </p>
            </div>
            <div className="flex-1 border border-dashed border-red-200 rounded-md bg-red-50/50 p-4">
              <h3 className="text-sm font-semibold text-red-800 mb-2 flex items-center gap-2">
                <FaExclamationTriangle /> Risks
              </h3>
              <ul className="space-y-1">
                {result.potential_issues?.map((issue, i) => (
                  <li
                    key={i}
                    className="text-xs text-red-900 flex items-start gap-1"
                  >
                    <span className="mt-1 w-1 h-1 rounded-full bg-red-500 shrink-0"></span>
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-between gap-2 text-xs">
          <div className="flex gap-2 w-full">
            <button
              onClick={analyzeRepo}
              disabled={loading || !repoUrl}
              className="flex-1 py-2 rounded-md bg-dark-lavender text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Analyze Architecture"}
            </button>

            <button
              onClick={copyArchitecture}
              disabled={!result}
              className="py-2 px-4 rounded-md bg-accent text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {copied ? "Copied!" : "Copy JSON"}
            </button>

            <button
              onClick={clearAll}
              className="py-2 px-4 rounded-md bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="text-red-600 text-sm mt-2 font-medium">{error}</div>
        )}
      </div>
    </div>
  );
};

export default ArchitectureForge;
