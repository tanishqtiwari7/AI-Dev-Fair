import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown'; 

const initialMarkdown = `# Hello, Markdown Previewer! 👋

This is a live preview. Type **Markdown** on the left to see it rendered here.

## Features:
* **Bold** and *Italics*
* [Links](https://www.google.com)
* \`Inline code\`

### Code Example

\`\`\`javascript
const greet = (name) => {
  console.log("Hello, " + name);
};
\`\`\`
`;

const MarkdownPreviewer = () => {
  const [markdownInput, setMarkdownInput] = useState(initialMarkdown);
  const [copied, setCopied] = useState(false);
  const [outputHeight, setOutputHeight] = useState(400); // Default height
  
  // Refs for the input textarea and the output div
  const inputRef = useRef(null);
  const outputRef = useRef(null);

  // 🚀 EFFECT: Synchronize output panel height with input textarea height
  useEffect(() => {
    // This function monitors the height of the textarea and updates the output panel
    const updateHeight = () => {
      if (inputRef.current) {
        // Set the output height to the scroll height of the input, 
        // ensuring they visually match when the user resizes the textarea.
        setOutputHeight(inputRef.current.clientHeight);
      }
    };

    // 1. Initial height calculation
    updateHeight();

    // 2. Observer for resize events on the textarea
    // The ResizeObserver ensures the height updates whenever the user drags the resize handle.
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

  const handleCopy = () => {
    if (!markdownInput) return;
    navigator.clipboard.writeText(markdownInput); 
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClear = () => {
    setMarkdownInput("");
    setCopied(false);
  };

  return (
    <div className="justify-center mt-20 flex">
      <div className="bg-white/90 p-7 rounded-xl shadow-md w-[900px] flex flex-col gap-4">
        
        <h2 className="text-2xl font-bold text-dark-lavender text-center">
          Markdown Previewer
        </h2>

        {/* Side-by-side input/output */}
        <div className="flex gap-4">
          
          {/* Input Panel (Markdown Source) */}
          <textarea
            ref={inputRef} // 🚀 Attach ref
            value={markdownInput}
            onChange={(e) => setMarkdownInput(e.target.value)}
            placeholder="Paste your Markdown here..."
            // Tailwind class h-[25rem] is replaced with a standard h-auto or min-h to allow resize
            className="w-1/2 min-h-[25rem] px-4 py-3 border border-gray-300 rounded-md text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-accent"
          />

          {/* Output Panel (Rendered HTML) */}
          <div 
            ref={outputRef} // 🚀 Attach ref
            style={{ height: outputHeight }} // 🚀 Dynamic height set by state
            className="w-1/2 border border-dashed border-gray-300 rounded-md bg-white px-4 py-3 font-mono overflow-auto text-sm custom-markdown-style"
          >
            {markdownInput ? (
                <ReactMarkdown>{markdownInput}</ReactMarkdown>
            ) : (
                <span className="text-gray-500">
                    Rendered HTML preview will appear here
                </span>
            )}
          </div>
        </div>

        {/* Buttons centered below */}
        <div className="flex justify-center gap-4 text-xs mt-2">
          {/* ❌ Removed the redundant "Preview" button ❌ */}
          
          <button
            onClick={handleCopy}
            disabled={!markdownInput}
            // Use flex-1 twice for Copy and Clear to keep them visually balanced
            className="flex-1 py-2 px-6 rounded-md bg-accent text-white font-semibold hover:opacity-90 transition disabled:opacity-50" 
          >
            {copied ? "Copied Source!" : "Copy Source"}
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

export default MarkdownPreviewer;