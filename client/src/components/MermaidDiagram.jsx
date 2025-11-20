import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose",
  fontFamily: "monospace",
});

const MermaidDiagram = ({ code }) => {
  const [svg, setSvg] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!code) return;

      try {
        setError(null);
        // Unique ID for each render to avoid conflicts
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, code);
        setSvg(svg);
      } catch (err) {
        console.error("Mermaid render error:", err);
        setError("Failed to render diagram. The syntax might be invalid.");
        // Mermaid leaves error text in the DOM, we might want to clean it up or just show our error
      }
    };

    renderDiagram();
  }, [code]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded text-red-600 text-xs font-mono">
        {error}
        <pre className="mt-2 text-gray-500 whitespace-pre-wrap">{code}</pre>
      </div>
    );
  }

  return (
    <div
      className="mermaid-container overflow-x-auto bg-white p-4 rounded border border-gray-200 flex justify-center min-h-[200px]"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default MermaidDiagram;
