// Hamburger.jsx
import React from 'react';
import { Link } from 'react-router-dom';  

const Hamburger = ({ onClose }) => {

  return (
    <div className="md:w-48 bg-white shadow-lg rounded-lg text-gray-800 p-4 flex flex-col gap-4 text-xs">
      
      {/* Main Navigation */}
      <div className="flex flex-col leading-none ">
        {["Home", "Help", "Find on Canvas", "Reset Canvas", "Live Collaboration"].map((item, idx) => (
          <button
            key={idx}
            onClick={onClose}
            className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-200 transition"
          >
            {item}
          </button>
        ))}
      </div>

      <hr className="border-gray-300" />

      {/* Links / Socials */}
      <div className="flex flex-col leading-none ">
        {["Get Cogniboard+", "GitHub", "Discord", "LinkedIn", "Developer"].map((item, idx) => (
          <button
            key={idx}
            onClick={onClose}
            className={`w-full text-left px-3 py-2 rounded-md transition ${
              idx === 0
                ? "text-dark-lavender/90 font-bold hover:bg-accent/50 hover:border-dark-lavender/70  hover:border-1 border-0"
                : "hover:bg-gray-200"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <hr className="border-gray-300" />

      {/* Settings */}
      <div className="flex flex-col ">
        <div className="px-3 py-2 font-semibold text-gray-600">Theme</div>
        <Link
          onClick={onClose}
          className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-200 transition"
          to="/"
        >
          Logout
        </Link>
      </div>
    </div>
  );
};

export default Hamburger;
