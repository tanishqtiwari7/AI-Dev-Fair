import React from "react";
import {
  FaGithub,
  FaShareAlt,
  FaQuestionCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link } from 'react-router-dom';

const Initial = () => {
  return (
    <div className="relative max-h-screen flex text-gray-500">
      {/* left content */}
      <div className="flex items-start">
        <span className="md:ml-7">
          <img
            src="/Arrow1left.png"
            alt="arrow"
            className="w-8 md:w-16 h-auto opacity-40"
          />
        </span>
        <span className="md:mt-20">
          <h1 className="text-xl font-caveat">
            setting, preferences, follow,....
          </h1>
        </span>
      </div>

      {/* center content (explicitly centered in screen) */}
      <div className="absolute inset-0 md:mt-70 flex flex-col items-center justify-center">
        {/* <div className="flex flex-col items-center  "> */}
        <div className=" flex flex-col items-center ">
          <h1 className="text-xs text-gray-400">
            Select any tool to start using it. Hover over a tool to see what it
            does.
          </h1>
          <span>
            <img
              src="/Arrow2center.png"
              alt=""
              className="w-8 md:w-16 h-auto md:ml-50 opacity-40"
            />
          </span>
          <span className="-translate-y-5">
            <h1 className="text-2xl font-caveat font-bold">
              Pick a tool & <br />
              Start working
            </h1>
          </span>
        </div>

        <div className="flex flex-col items-center gap-4 md:mt-15">
          <img src="/logo.png" alt="" className="w-8 md:w-90 h-auto" />
          <div>
            <h1 className="font-caveat text-xl -translate-y-2 font-bold md:mt-3">
              The Ultimate All-in-One Toolkit for Developers to Build, Test, and
              Explore
            </h1>
          </div>
          <div className="flex flex-col gap-2 items-start md:mt-5">
            <a
              href="https://github.com/tanishqtiwari7/Cognibench"
              target="_blank" // opens in new tab
              rel="noopener noreferrer" // security best practice
              className="flex items-center gap-2 hover:text-black hover:bg-accent/30 py-1 px-3 rounded-md md:w-[10rem]"
            >
              <FaGithub />
              <h1>Star on Github</h1>
            </a>
            <button className="flex items-center gap-2 hover:text-black hover:bg-accent/30 py-1 px-3 rounded-md md:w-[10rem]">
              <FaShareAlt />
              <h1>Liveshare</h1>
            </button>
            <button className="flex items-center gap-2 hover:text-black hover:bg-accent/30 py-1 px-3 rounded-md md:w-[10rem]">
              <FaQuestionCircle />
              <h1>Help</h1>
            </button>
            <Link
              to="/"
              className="flex items-center gap-2 hover:text-black hover:bg-accent/30 py-1 px-3 rounded-md md:w-[10rem]"
            >
              <FaSignOutAlt />
              <h1>Log out</h1>
            </Link>
          </div>
        </div>
        {/* </div> */}
      </div>
    </div>
  );
};

export default Initial;
