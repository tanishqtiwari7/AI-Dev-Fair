import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import axios from "axios";
import MermaidDiagram from "../../components/MermaidDiagram";
import {
  FaGithub,
  FaStar,
  FaCodeBranch,
  FaLayerGroup,
  FaCogs,
  FaDatabase,
  FaExclamationTriangle,
  FaProjectDiagram,
  FaCopy,
  FaCheck,
  FaFileCode,
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
    // Basic validation
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
      <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-[1200px] flex flex-col gap-6 border border-white/20">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-dark-lavender to-accent">
            Architecture Forge
          </h2>
          <p className="text-gray-500 text-sm max-w-lg mx-auto">
            Deep dive into any GitHub repository. Visualize structure, analyze
            layers, and uncover potential risks with AI.
          </p>
        </div>

        {/* Input Section */}
        <div className="flex gap-3 shadow-sm rounded-lg overflow-hidden border border-gray-200 p-1 bg-white">
          <div className="pl-3 flex items-center text-gray-400">
            <FaGithub size={20} />
          </div>
          <input
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/username/repository"
            className="flex-1 px-3 py-3 text-gray-700 placeholder-gray-400 focus:outline-none font-mono text-sm"
            onKeyDown={(e) => e.key === "Enter" && analyzeRepo()}
          />
          <button
            onClick={analyzeRepo}
            disabled={!repoUrl || loading}
            className="px-8 py-2 rounded-md bg-dark-lavender text-white font-bold hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Analyzing...
              </span>
            ) : (
              "Analyze"
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-3 text-red-700 bg-red-50 p-4 rounded-lg border border-red-200 animate-fade-in">
            <FaExclamationTriangle />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Loading State Skeleton */}
        {loading && !result && (
          <div className="space-y-4 animate-pulse mt-4">
            <div className="h-32 bg-gray-200 rounded-xl"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-48 bg-gray-200 rounded-xl"></div>
              <div className="h-48 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        )}

        {/* Results Dashboard */}
        {result && (
          <div className="flex flex-col gap-6 animate-fade-in-up">
            {/* 1. Repo Header Card */}
            <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border border-gray-200 flex justify-between items-start shadow-sm">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <FaGithub />
                  {result.repo_details?.owner} /{" "}
                  <span className="text-accent">
                    {result.repo_details?.name}
                  </span>
                </h3>
                <p className="text-gray-600 mt-2 max-w-2xl">
                  {result.repo_details?.description}
                </p>
                <div className="flex gap-6 mt-4 text-sm text-gray-600 font-medium">
                  <span className="flex items-center gap-1">
                    <FaStar className="text-yellow-500" />{" "}
                    {result.repo_details?.stars} Stars
                  </span>
                  <span className="flex items-center gap-1">
                    <FaCodeBranch className="text-blue-500" />{" "}
                    {result.repo_details?.forks} Forks
                  </span>
                </div>
              </div>
              <button
                onClick={copyArchitecture}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {copied ? <FaCheck className="text-green-500" /> : <FaCopy />}
                {copied ? "Copied JSON" : "Export JSON"}
              </button>
            </div>

            {/* 2. Executive Summary */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-accent">
              <h4 className="text-lg font-bold text-gray-800 mb-3">
                Executive Summary
              </h4>
              <p className="text-gray-700 leading-relaxed text-base">
                {result.summary}
              </p>
            </div>

            {/* 3. Architecture Diagram */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
                <h4 className="font-bold text-gray-700 flex items-center gap-2">
                  <FaProjectDiagram className="text-dark-lavender" />{" "}
                  Architecture Diagram
                </h4>
                <span className="text-xs text-gray-400 uppercase font-semibold">
                  Mermaid.js
                </span>
              </div>
              <div className="p-6 bg-white flex justify-center">
                <MermaidDiagram
                  code={
                    result.tree_mermaid || "graph TD; A[No Diagram Generated]"
                  }
                />
              </div>
            </div>

            {/* 4. Grid: Layers & Components */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Layers */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                  <FaLayerGroup className="text-blue-500" /> Architectural
                  Layers
                </h4>
                <ul className="space-y-2">
                  {result.layers?.map((layer, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span>
                      {layer}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Components */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                  <FaCogs className="text-green-500" /> Key Components
                </h4>
                <ul className="space-y-2">
                  {result.key_components?.map((comp, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-400 shrink-0"></span>
                      {comp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 5. Data Flow & Issues */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Data Flow */}
              <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 shadow-sm">
                <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <FaDatabase className="text-blue-600" /> Data Flow Analysis
                </h4>
                <p className="text-sm text-blue-800 whitespace-pre-wrap leading-relaxed">
                  {result.data_flow}
                </p>
              </div>

              {/* Potential Issues */}
              <div className="bg-red-50/50 p-6 rounded-xl border border-red-100 shadow-sm">
                <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                  <FaExclamationTriangle className="text-red-600" /> Potential
                  Risks
                </h4>
                {result.potential_issues?.length > 0 ? (
                  <ul className="space-y-2">
                    {result.potential_issues.map((issue, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-red-800"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                        {issue}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-green-700 italic">
                    No major issues detected.
                  </p>
                )}
              </div>
            </div>

            {/* 6. Raw File Structure (Collapsible/Scrollable) */}
            <div className="bg-gray-900 rounded-xl overflow-hidden shadow-md">
              <div className="bg-gray-800 px-6 py-3 flex justify-between items-center">
                <h4 className="font-bold text-gray-200 flex items-center gap-2 text-sm">
                  <FaFileCode /> File Structure Preview
                </h4>
                <span className="text-xs text-gray-500">First 500 files</span>
              </div>
              <pre className="p-4 text-xs text-green-400 font-mono overflow-auto max-h-60 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                {result.tree_raw}
              </pre>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-center pt-6">
              <button
                onClick={clearAll}
                className="px-8 py-2 rounded-full bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200 transition-colors shadow-sm border border-gray-200"
              >
                Analyze Another Repository
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchitectureForge;
