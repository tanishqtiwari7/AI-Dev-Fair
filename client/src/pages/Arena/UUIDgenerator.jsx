import React, { useState } from "react";
import { v1 as uuidv1, v4 as uuidv4 } from "uuid";

const UUIDgenerator = () => {
  const [uuid, setUuid] = useState("");
  const [version, setVersion] = useState("v4");
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false); // dropdown state

  const generateUUID = () => {
    if (version === "v1") {
      setUuid(uuidv1());
    } else {
      setUuid(uuidv4());
    }
    setCopied(false);
  };

  const copyUUID = () => {
    if (!uuid) return;
    navigator.clipboard.writeText(uuid);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500); // reset after 1.5s
  };

  const clearUUID = () => {
    setUuid("");
    setCopied(false);
  };

  return (
    <div className="justify-center mt-20 flex">
      <div className="bg-white/90 p-7 rounded-xl shadow-md w-[360px] flex flex-col gap-4 justify-center">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-dark-lavender text-center">
          UUID Generator
        </h2>

        {/* Custom Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-base bg-white flex justify-between items-center hover:border-dark-lavender focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {version === "v1" ? "UUID v1 (time-based)" : "UUID v4 (random)"}
            <span className="ml-2">▾</span>
          </button>

          {open && (
            <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-md overflow-hidden z-10">
              <div
                onClick={() => {
                  setVersion("v1");
                  setOpen(false);
                }}
                className="px-4 py-2 cursor-pointer hover:bg-dark-lavender hover:text-white"
              >
                UUID v1 (time-based)
              </div>
              <div
                onClick={() => {
                  setVersion("v4");
                  setOpen(false);
                }}
                className="px-4 py-2 cursor-pointer hover:bg-dark-lavender hover:text-white"
              >
                UUID v4 (random)
              </div>
            </div>
          )}
        </div>

        {/* Output Field */}
        <div className="flex items-center md:mt-5 justify-between border border-dashed border-gray-300 rounded-md bg-gray-50 text-gray-700 px-4 py-2 font-mono">
          <span className="truncate">
            {uuid || "Your UUID will appear here"}
          </span>
          {uuid && (
            <button
              onClick={copyUUID}
              className="text-gray-500 hover:text-gray-700 text-sm ml-2"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between gap-2 text-xs">
          <button
            onClick={generateUUID}
            className="flex-1 py-2 rounded-md bg-dark-lavender text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition"
          >
            Generate
          </button>
          <button
            onClick={copyUUID}
            disabled={!uuid}
            className="flex-1 py-2 rounded-md bg-accent text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50"
          >
            Copy
          </button>
          <button
            onClick={clearUUID}
            className="flex-1 py-2 rounded-md bg-gray-200 text-gray-700 font-semibold flex items-center justify-center gap-2 hover:bg-gray-300 transition"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default UUIDgenerator;
