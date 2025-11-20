import React, { useState, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import { generateReadme } from "../../api"; // adjust path if needed

const ReadmeForge = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const controllerRef = useRef(null);

  const handleGenerate = async () => {
    if (!repoUrl || !/github\.com\/[^/]+\/[^/]+/i.test(repoUrl)) {
      setError(
        "Please enter a valid GitHub repo URL (e.g. https://github.com/owner/repo)."
      );
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setCopied(false);

    // Abortable call: create controller and pass via fetch wrapper if implemented
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      // If your api.generateReadme supports a signal, you can pass it.
      // For the simple api.js we created earlier, it doesn't accept signal. But keeping this for future.
      const resp = await generateReadme(repoUrl);
      // resp is expected { summary, readme_markdown, mermaid, tech_stack, detected_scripts, notes }
      setResult(resp);
    } catch (err) {
      // axios errors sometimes put message in err.error or err.message
      const msg =
        err?.response?.data?.message ||
        err?.error ||
        err?.message ||
        String(err);
      setError(msg);
    } finally {
      setLoading(false);
      controllerRef.current = null;
    }
  };

  const handleCancel = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }
    setLoading(false);
    setError("Request cancelled.");
  };

  const copyReadme = async () => {
    if (!result?.readme_markdown) return;
    try {
      await navigator.clipboard.writeText(result.readme_markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("Clipboard permission denied.");
    }
  };

  const downloadReadme = () => {
    if (!result?.readme_markdown) return;
    const blob = new Blob([result.readme_markdown], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setRepoUrl("");
    setResult(null);
    setError("");
    setCopied(false);
  };

  return (
    <div className="justify-center mt-20 flex">
      <div className="bg-white/90 p-7 rounded-xl shadow-md w-[1000px] flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-dark-lavender text-center">
          ReadmeForge — README Generator
        </h2>

        <input
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="Paste GitHub repo URL e.g. https://github.com/owner/repo"
          className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent"
        />

        {/* Summary + Meta */}
        <div className="flex gap-4">
          <div className="flex-1 border border-dashed border-gray-300 rounded-md bg-gray-50 p-4 min-h-[100px]">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">
              Summary
            </h3>
            {result?.summary ? (
              <div className="text-sm text-gray-800">{result.summary}</div>
            ) : (
              <div className="text-sm text-gray-500">
                Summary will appear here after generation.
              </div>
            )}
          </div>

          <div className="w-1/3 border border-dashed border-gray-300 rounded-md bg-gray-50 p-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">
              Detected
            </h3>
            {result ? (
              <>
                {/* Language Bar Graph */}
                {result.languages &&
                  Object.keys(result.languages).length > 0 && (
                    <div className="mb-3">
                      <div className="text-xs font-semibold text-gray-700 mb-1">
                        Languages
                      </div>
                      <div className="flex h-2 rounded-full overflow-hidden bg-gray-200 w-full">
                        {(() => {
                          const total = Object.values(result.languages).reduce(
                            (a, b) => a + b,
                            0
                          );
                          const colors = [
                            "#f87171",
                            "#fbbf24",
                            "#34d399",
                            "#60a5fa",
                            "#a78bfa",
                            "#f472b6",
                          ];
                          return Object.entries(result.languages).map(
                            ([lang, bytes], i) => {
                              const percent = (bytes / total) * 100;
                              if (percent < 1) return null; // hide tiny ones
                              return (
                                <div
                                  key={lang}
                                  style={{
                                    width: `${percent}%`,
                                    backgroundColor: colors[i % colors.length],
                                  }}
                                  title={`${lang}: ${percent.toFixed(1)}%`}
                                />
                              );
                            }
                          );
                        })()}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {(() => {
                          const total = Object.values(result.languages).reduce(
                            (a, b) => a + b,
                            0
                          );
                          const colors = [
                            "#f87171",
                            "#fbbf24",
                            "#34d399",
                            "#60a5fa",
                            "#a78bfa",
                            "#f472b6",
                          ];
                          return Object.entries(result.languages)
                            .slice(0, 4)
                            .map(([lang, bytes], i) => (
                              <div
                                key={lang}
                                className="flex items-center gap-1"
                              >
                                <div
                                  className="w-2 h-2 rounded-full"
                                  style={{
                                    backgroundColor: colors[i % colors.length],
                                  }}
                                ></div>
                                <span className="text-[10px] text-gray-600">
                                  {lang}
                                </span>
                              </div>
                            ));
                        })()}
                      </div>
                    </div>
                  )}

                <div className="text-xs text-gray-700">
                  <strong>Tech:</strong>{" "}
                  {(result.tech_stack && result.tech_stack.join(", ")) || "—"}
                </div>
                <div className="text-xs text-gray-700 mt-2">
                  <strong>Scripts:</strong>{" "}
                  {result.detected_scripts
                    ? JSON.stringify(result.detected_scripts)
                    : "—"}
                </div>
                {result.notes && (
                  <div className="text-xs text-amber-700 mt-2">
                    Notes: {result.notes}
                  </div>
                )}
              </>
            ) : (
              <div className="text-sm text-gray-500">
                Tooling info will show here.
              </div>
            )}
          </div>
        </div>

        {/* README preview */}
        <div className="border border-gray-300 rounded-md bg-gray-50 overflow-auto h-72 p-3 text-sm">
          {result?.readme_markdown ? (
            <SyntaxHighlighter
              language="markdown"
              style={coy}
              customStyle={{ background: "transparent", margin: 0 }}
            >
              {result.readme_markdown}
            </SyntaxHighlighter>
          ) : (
            <div className="text-gray-500">
              Generated README will appear here...
            </div>
          )}
        </div>

        {/* Mermaid / diagram preview */}
        {result?.mermaid && (
          <div className="border border-dashed border-gray-300 rounded-md bg-white p-3">
            <h4 className="text-sm font-semibold text-gray-600 mb-2">
              Mermaid Diagram
            </h4>
            <pre className="text-xs whitespace-pre-wrap">{result.mermaid}</pre>
            <div className="text-xs text-gray-500 mt-2">
              (Render with mermaid in UI if desired.)
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-between gap-2 text-xs">
          <div className="flex gap-2 w-full">
            <button
              onClick={handleGenerate}
              disabled={loading || !repoUrl}
              className="flex-1 py-2 rounded-md bg-dark-lavender text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Generating..." : "Generate README"}
            </button>

            <button
              onClick={handleCancel}
              disabled={!loading}
              className="py-2 px-4 rounded-md bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={copyReadme}
              disabled={!result?.readme_markdown}
              className="py-2 px-4 rounded-md bg-accent text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {copied ? "Copied!" : "Copy README"}
            </button>

            <button
              onClick={downloadReadme}
              disabled={!result?.readme_markdown}
              className="py-2 px-4 rounded-md bg-dark-lavender text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              Download
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

export default ReadmeForge;
