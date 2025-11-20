import React from "react";
import { useEffect, useRef ,useState} from "react";
import {
  FaQrcode,

  FaLock,
  
  FaBookOpen,
} from "react-icons/fa";
import Hamburger from "./Hamburger";

const tools = [
  { name: "QR Maker", icon: <FaQrcode /> },

  { name: "Readme Forge", icon: <FaLock /> },
 
];

const ToolBar = ({ onSelectTool, activeTool }) => {
const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // 🔑 Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);


  return (
    <div className="sticky top-7 z-50 w-full mb-8">
      <div className="relative flex items-center justify-between w-full px-6 max-w-8xl mx-auto">
        {/* Left: Hamburger */}
         <div ref={menuRef}>
          <button
            className="px-3 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
          {isOpen && (
            <div className="absolute top-full left-5 mt-2 rounded-lg shadow-lg">
              <Hamburger onClose={() => setIsOpen(false)} />
            </div>
          )}
        </div>

        {/* Center: Tool capsule (absolute center of viewport) */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-4 bg-white px-4 py-2 rounded-full shadow-md border border-gray-200">
          {tools.map((tool, index) => {
            const isActive = activeTool === tool.name;
            return (
              <button
                key={index}
                onClick={() => onSelectTool(tool.name)}
                className={`group relative flex items-center justify-center w-8 h-8 rounded-lg transition
                     ${
                       isActive
                         ? "bg-dark-lavender text-white"
                         : "bg-gray-100 hover:bg-dark-lavender/20 hover:text-black"
                     }`}
              >
                <span className="text-lg">{tool.icon}</span>

                {/* Tooltip */}
                <span
                  className="absolute top-12 px-2 py-1 text-xs text-black bg-accent/90 rounded-md 
               opacity-0 group-hover:opacity-100 
               transition-opacity delay-700 whitespace-nowrap "
                >
                  {tool.name}
                </span>
              </button>
            );
          })}
        </div>
        {/* Right: Other buttons */}
        <div className="flex gap-2">
   <a
  href="https://github.com/tanishqtiwari7/Cognibench"
  target="_blank"
  rel="noopener noreferrer"
  className="px-3 py-2 rounded-md bg-accent hover:bg-accent/80 text-xs"
>
  GitHub
</a>
          <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-xs">
            Library
            <FaBookOpen className="text-md" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToolBar;
