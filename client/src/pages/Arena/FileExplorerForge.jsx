import React, { useState, useMemo } from "react";
import axios from "axios";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  FaFolder,
  FaFolderOpen,
  FaFileCode,
  FaSearch,
  FaChevronRight,
  FaChevronDown,
  FaProjectDiagram,
  FaTimes,
} from "react-icons/fa";
import MermaidDiagram from "../../components/MermaidDiagram";

// --- Helper: Build Tree Structure ---
const buildTree = (items) => {
  const root = [];

  items.forEach((item) => {
    const parts = item.path.split("/");
    let currentLevel = root;
    let currentPath = "";

    parts.forEach((part, index) => {
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      // Check if path exists in current level
      let existing = currentLevel.find((i) => i.name === part);

      if (!existing) {
        const isFile = index === parts.length - 1 && item.type === "blob";
        const newNode = {
          name: part,
          path: currentPath,
          type: isFile ? "blob" : "folder",
          children: isFile ? null : [],
        };
        currentLevel.push(newNode);
        existing = newNode;
      }

      if (existing.type === "folder") {
        currentLevel = existing.children;
      }
    });
  });

  // Sort: Folders first, then files
  const sortNodes = (nodes) => {
    nodes.sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type === "folder" ? -1 : 1;
    });
    nodes.forEach((node) => {
      if (node.children) sortNodes(node.children);
    });
  };

  sortNodes(root);
  return root;
};

// --- Helper: Generate Mermaid Graph ---
const generateMermaidTree = (nodes) => {
  if (!nodes || nodes.length === 0) return "graph TD; A[No Files Loaded]";

  let code = "graph TD;\n";
  let idCounter = 0;
  const idMap = new Map();

  const getId = (path) => {
    if (!idMap.has(path)) {
      idMap.set(path, `n${idCounter++}`);
    }
    return idMap.get(path);
  };

  const traverse = (items, parentPath) => {
    items.forEach((item) => {
      const currentId = getId(item.path);
      const label = item.name.replace(/["()[\]]/g, ""); // Sanitize

      const shapeStart = item.type === "folder" ? "[" : "(";
      const shapeEnd = item.type === "folder" ? "]" : ")";

      if (parentPath) {
        const parentId = getId(parentPath);
        code += `  ${parentId} --> ${currentId}${shapeStart}"${label}"${shapeEnd};\n`;
      } else {
        code += `  ${currentId}${shapeStart}"${label}"${shapeEnd};\n`;
      }

      if (item.children) {
        traverse(item.children, item.path);
      }
    });
  };

  traverse(nodes, null);

  code += "  classDef folder fill:#f9f,stroke:#333,stroke-width:2px;\n";
  code += "  classDef file fill:#fff,stroke:#333,stroke-width:1px;\n";
  return code;
};

// --- Component: Recursive File Node ---
const FileNode = ({ node, onFileClick, activePath, depth = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (node.type === "folder") {
    return (
      <div>
        <div
          className="flex items-center cursor-pointer hover:bg-gray-200 py-1 text-gray-700 select-none transition-colors"
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="mr-1 text-[10px] text-gray-500">
            {isOpen ? <FaChevronDown /> : <FaChevronRight />}
          </span>
          <span className="mr-2 text-yellow-500 text-sm">
            {isOpen ? <FaFolderOpen /> : <FaFolder />}
          </span>
          <span className="truncate text-xs font-medium">{node.name}</span>
        </div>
        {isOpen && (
          <div>
            {node.children.map((child) => (
              <FileNode
                key={child.path}
                node={child}
                onFileClick={onFileClick}
                activePath={activePath}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center cursor-pointer py-1 select-none transition-colors ${
        activePath === node.path
          ? "bg-accent text-white"
          : "text-gray-600 hover:bg-gray-100"
      }`}
      style={{ paddingLeft: `${depth * 12 + 24}px` }}
      onClick={() => onFileClick(node.path)}
    >
      <span
        className={`mr-2 text-sm ${
          activePath === node.path ? "text-white" : "text-gray-400"
        }`}
      >
        <FaFileCode />
      </span>
      <span className="truncate text-xs">{node.name}</span>
    </div>
  );
};

const FileExplorerForge = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const [rawTree, setRawTree] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [contentLoading, setContentLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const [showGraph, setShowGraph] = useState(false);

  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Memoize tree construction
  const treeStructure = useMemo(() => buildTree(rawTree), [rawTree]);

  // Fetch repo tree
  const fetchTree = async () => {
    if (!repoUrl) {
      setError("Please enter a GitHub repo URL.");
      return;
    }
    if (!repoUrl.includes("github.com")) {
      setError("Please enter a valid GitHub URL.");
      return;
    }

    setError("");
    setLoading(true);
    setRawTree([]);
    setActiveFile(null);
    setFileContent("");
    setSearchResult("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/explorer/tree`,
        { repoUrl },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      setRawTree(response.data.tree || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load repository.");
    }
    setLoading(false);
  };

  const fetchFile = async (path) => {
    setActiveFile(path);
    setContentLoading(true);
    setFileContent("");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/explorer/content`,
        { repoUrl, path },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      setFileContent(response.data.content);
    } catch (err) {
      setFileContent(
        "// Error loading file content: " +
          (err.response?.data?.message || err.message)
      );
    }
    setContentLoading(false);
  };

  const handleSearch = async () => {
    if (!searchQuery) return;
    setSearchLoading(true);
    setSearchResult("");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/explorer/search`,
        { repoUrl, query: searchQuery },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      setSearchResult(response.data.result);
    } catch (err) {
      setSearchResult(
        "Error performing search: " +
          (err.response?.data?.message || err.message)
      );
    }
    setSearchLoading(false);
  };

  return (
    <div className="justify-center mt-20 flex h-[85vh] pb-10">
      <div className="bg-white/90 p-6 rounded-xl shadow-md w-[1200px] flex flex-col gap-4 h-full">
        <h2 className="text-2xl font-bold text-dark-lavender text-center">
          Explorer Forge
        </h2>

        {/* Input Bar */}
        <div className="flex gap-2 shrink-0">
          <input
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="Enter GitHub repo URL e.g., https://github.com/user/repo"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            onClick={fetchTree}
            disabled={loading}
            className="px-6 py-2 bg-dark-lavender text-white rounded-md font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load Repo"}
          </button>
        </div>

        {error && (
          <div className="text-red-600 font-semibold text-sm text-center shrink-0">
            {error}
          </div>
        )}

        <div className="flex flex-1 gap-4 overflow-hidden min-h-0">
          {/* Sidebar - Tree */}
          <div className="w-1/4 border border-gray-300 rounded-md bg-gray-50 flex flex-col min-h-0">
            <div className="p-2 bg-gray-100 border-b border-gray-200 font-semibold text-gray-700 text-sm shrink-0 flex justify-between items-center">
              <span>Files</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                  {rawTree.length}
                </span>
                {rawTree.length > 0 && (
                  <button
                    onClick={() => setShowGraph(true)}
                    className="text-accent hover:text-dark-lavender transition-colors"
                    title="Visualize Structure"
                  >
                    <FaProjectDiagram />
                  </button>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              {rawTree.length === 0 ? (
                <div className="text-gray-400 text-sm text-center mt-10">
                  {loading ? "Fetching files..." : "No files loaded"}
                </div>
              ) : (
                <div className="font-mono">
                  {treeStructure.map((node) => (
                    <FileNode
                      key={node.path}
                      node={node}
                      onFileClick={fetchFile}
                      activePath={activeFile}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Content - Code & Search */}
          <div className="w-3/4 flex flex-col gap-4 min-h-0">
            {/* Search Box */}
            <div className="flex gap-2 shrink-0">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ask AI about this codebase (e.g., 'Where is the auth logic?')"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={searchLoading || !rawTree.length}
                className="px-4 py-2 bg-accent text-white rounded-md text-sm font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {searchLoading ? "Thinking..." : "Ask AI"}
              </button>
            </div>

            {/* Search Result Area */}
            {searchResult && (
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md text-sm text-gray-800 max-h-40 overflow-y-auto whitespace-pre-wrap shrink-0 shadow-inner">
                <strong>AI Answer:</strong> {searchResult}
              </div>
            )}

            {/* Code Viewer */}
            <div className="flex-1 border border-gray-300 rounded-md bg-white overflow-hidden flex flex-col min-h-0">
              <div className="p-2 bg-gray-100 border-b border-gray-200 font-semibold text-gray-700 text-sm flex justify-between shrink-0 items-center">
                <span className="truncate flex items-center gap-2">
                  <FaFileCode className="text-gray-500" />
                  {activeFile || "Select a file to view"}
                </span>
                {contentLoading && (
                  <span className="text-xs text-gray-500 animate-pulse">
                    Loading content...
                  </span>
                )}
              </div>
              <div className="flex-1 overflow-auto relative">
                {fileContent ? (
                  <SyntaxHighlighter
                    language="javascript"
                    style={coy}
                    customStyle={{
                      margin: 0,
                      height: "100%",
                      fontSize: "12px",
                    }}
                    showLineNumbers={true}
                  >
                    {fileContent}
                  </SyntaxHighlighter>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    <div className="text-center">
                      <p>Select a file from the sidebar</p>
                      <p className="text-xs mt-2 opacity-70">
                        or ask AI a question above
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Graph Modal */}
      {showGraph && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-10 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full h-full flex flex-col overflow-hidden animate-fade-in">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50 shrink-0">
              <h3 className="font-bold text-lg text-dark-lavender flex items-center gap-2">
                <FaProjectDiagram /> Repository Structure Graph
              </h3>
              <button
                onClick={() => setShowGraph(false)}
                className="text-gray-500 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-gray-200"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-gray-100">
              <MermaidDiagram code={generateMermaidTree(treeStructure)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileExplorerForge;
