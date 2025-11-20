import React from "react";
import { useState } from "react";
import ToolBar from "../../components/ToolBar";
import QR from "./QR";
import Initial from "../../components/Initial";
import UUIDgenerator from "./UUIDgenerator";
import JWTdecoder from "./JWTdecoder";
import LoremIpsum from "./LoremIpsum";
import JSONformator from "./JSONformator";
import HashGenerator from "./HashGenerator";
import ColourConverter from "./ColourConverter";
import MarkdownPreviewer from "./MarkdownPreviewer";
import BgRemover from "./BgRemover";
import AICodeSummarizer from "./AICodeSummarizer";

const tools = {
  "QR Maker": <QR />,
  "UUID Generator": <UUIDgenerator />,
  "JWT Decoder": <JWTdecoder />,
  "Lorem Ipsum": <LoremIpsum />,
  "JSON Formatter": <JSONformator />,
  "Hash Generator": <HashGenerator />,
  "Color Converter": <ColourConverter />,
  "Markdown Previewer": <MarkdownPreviewer />,
  "Background Remover": <BgRemover />,
  "AI Code Summarizer": <AICodeSummarizer />,
};

const Bench = () => {
  const [selectedTool, setSelectedTool] = useState(null);
  return (

    <div className={`min-h-screen bg-light-lavender ${
    selectedTool ? "bg-dot-grid" : ""
  }`}>
    <ToolBar onSelectTool={setSelectedTool} activeTool={selectedTool} />
    <div>
    {selectedTool ? (
      tools[selectedTool]
    ) : (
      <Initial />
    )}
    </div>
    </div>
  
  );
};

export default Bench;
