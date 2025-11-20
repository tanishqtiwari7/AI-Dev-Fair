import React, { useState } from "react";
import ToolBar from "../../components/ToolBar";
import Initial from "../../components/Initial";
import QR from "./QR";
import ReadmeForge from "./ReadmeForge";
import ArchitectureForge from "./ArchitectureForge";
import FileExplorerForge from "./FileExplorerForge";

const tools = {
  "QR Maker": <QR />,
  "Readme Forge": <ReadmeForge />,
  "Architecture Forge": <ArchitectureForge />,
  "Explorer Forge": <FileExplorerForge />,
};

const Bench = () => {
  const [selectedTool, setSelectedTool] = useState(null);
  return (
    <div
      className={`min-h-screen bg-light-lavender ${
        selectedTool ? "bg-dot-grid" : ""
      }`}
    >
      <ToolBar onSelectTool={setSelectedTool} activeTool={selectedTool} />
      <div>{selectedTool ? tools[selectedTool] : <Initial />}</div>
    </div>
  );
};

export default Bench;
