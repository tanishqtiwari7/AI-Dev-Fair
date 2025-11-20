import React, { useState } from "react";
import {QRCodeCanvas} from "qrcode.react";

const QR = () => {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    const pngurl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    const link = document.createElement("a");
    link.href = pngurl;
    link.download = "qr-code.png";
    link.click();
  };

  // const handleCopy = async () => {
  //   try {
  //     await navigator.clipboard.writeText(text);
  //     setCopied(true);
  //     setTimeout(() => setCopied(false), 2000);
  //   } catch (err) {
  //     console.error("Copy Failed", err);
  //   }
  // };

  const handleClear = () => {
    setText("");
    setCopied(false);
  }

  return (
    <div className="justify-center mt-20 flex">
      <div className="bg-white/90 p-7  rounded-xl shadow-md  w-90 flex flex-col gap-4 justify-center ">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-dark-lavender text-center">
          QR Code Generator
        </h2>

        {/* Input field */}
        <input
          type="text"
          placeholder="Enter text or URL"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-accent"
        />

        {/* Canvas / QR preview */}
        <div className=" aspect-square flex items-center justify-center border border-dashed border-gray-300 rounded-md bg-gray-50 text-gray-400">
          {
            text.trim() ? (
              <QRCodeCanvas value={text} size={300} level="M" includeMargin={true} />
            ) : (
              <span className="text-gray-400">Enter text to generate QR code</span>
            )
          }
       
        </div>

        {/* Buttons */}
        <div className="flex justify-between gap-2 text-xs">
          <button className="flex-1 py-2 rounded-md bg-dark-lavender text-white font-semibold hover:opacity-90 transition" onClick={handleDownload}>
            Download
          </button>
          {/* <button className="flex-1 py-2 rounded-md bg-accent text-white font-semibold hover:opacity-90 transition" onClick={handleCopy}>
            Copy
          </button> */}
          <button className="flex-1 py-2 rounded-md bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition" onClick={handleClear}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default QR;
