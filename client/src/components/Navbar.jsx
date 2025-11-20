import React, { use } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { FaDiscord, FaGithub } from "react-icons/fa";

const Navlinks = [
  { id: 1, to: "/pricing", label: "Pricing" },
  { id: 2, to: "/roadmap", label: "Roadmap" },
  { id: 3, to: "/community", label: "Community" },
  { id: 4, to: "/resources", label: "Resources" },
];

const Navbar = () => {
  const navigate = useNavigate();

  const homebutton = () => {
    navigate("/");
  };

  const LoginButton = () => {
    navigate("/login");
  };

  return (
    <nav className="fixed w-full bg-light-lavender z-100">
      <div className="flex items-center px-4 py-1">
        <span className="md:py-4 md:px-2 md:w-[15rem] h-auto inline-block align-middle">
          <button onClick={homebutton}>
            <Logo />
          </button>
        </span>
        <span className="flex gap-2 ml-10">
          {Navlinks.map((link) => (
            <Link
              key={link.id}
              to={link.to}
              className="text-dark-lavender/80 tracking-widest font-bold font-simple-nunito text-xs hover:bg-dark-lavender/5 hover:rounded-full px-3 py-2  ease-in-out"
              replace
            >
              {link.label}
            </Link>
          ))}
        </span>
        <div className="flex gap-1 ml-auto md:mr-8 items-center">
          <span>
            <Link
              to="https://discord.com/"
              className=" text-dark-lavender px-4 py-2  tracking-wider text-xs flex items-center gap-2 hover:text-dark-lavender/40 transition ease-in-out text-simple-nunito"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaDiscord className="w-5 h-5" />
              Discord
            </Link>
          </span>
          <span>
            <Link
              to="https://github.com/tanishqtiwari7/Cognibench"
              className=" text-dark-lavender px-4 py-2  tracking-wider text-xs flex items-center gap-2 hover:text-dark-lavender/40 transition ease-in-out text-simple-nunito"
              target="_blank"
              rel="noopener noreferrer"
              
            >
              <FaGithub className="w-5 h-5" />
              GitHub
            </Link>
          </span>
          <span>
            <button
              onClick={LoginButton}
              className="bg-dark-lavender/90 text-white px-6 py-2 rounded-full tracking-wider border border-transparent text-xs hover:bg-accent/20 hover:border-dark-lavender hover:text-dark-lavender transition"
            >
              Sign In
            </button>
          </span>
        </div>
      </div>
      <div></div>
    </nav>
  );
};

export default Navbar;
