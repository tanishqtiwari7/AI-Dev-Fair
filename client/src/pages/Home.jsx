import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Link } from "react-router-dom";
import { FaGithub, FaDiscord, FaLinkedin } from "react-icons/fa";

const Tools = [
  "QR Maker",
  "UUID Generator",
  "JWT Decoder",
  "Lorem Ipsum",
  "JSON Formatter",
  "Hash Generator",
  "Color Converter",
  "Markdown Previewer",
  "Background Remover",
  "AI Summarizer",
];

const Home = () => {
  const marqueeRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (marqueeRef.current) {
      animationRef.current = gsap.to(marqueeRef.current, {
        x: "-100%",
        duration: 50,
        ease: "none",
        repeat: -1,
      });
    }
  }, []);

  // const handleMouseEnter = () => {
  //   animationRef.current?.pause();
  // };

  // const handleMouseLeave = () => {
  //   animationRef.current?.resume();
  // };

  return (
    <div className="bg-light-lavender min-h-screen flex-col">
      {/* First section */}
      <section className="relative text-center flex flex-col items-center justify-center w-full min-h-screen overflow-hidden">
        <span className="flex flex-col md:flex-row items-center tracking-widest justify-center z-20">
          <span>
            <h1 className="text-4xl md:text-6xl font-bold text-center text-dark-lavender">
              One.
            </h1>
          </span>
          <span>
            <h1 className="text-4xl md:text-6xl text-center shadow-xs shadow-dark-lavender/20 text-dark-lavender bg-accent/30 rounded-2xl px-5 py-2 inline-flex items-center justify-center">
              <strong>Bench</strong>
            </h1>
          </span>
          <span>
            <h1 className="text-4xl md:text-6xl font-bold text-center text-dark-lavender">
              , Endless Tools
            </h1>
          </span>
        </span>

        <img
          src="/loginbg.png"
          alt="Hero background"
          className="absolute top-0 left-0 w-full h-full object-cover blur-xs pointer-events-none"
        />
      </section>

      {/* Second section */}
      <section className="relative flex items-center justify-center w-full md:px-20 md:mt-30">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-20 bg-dark-lavender z-10 shadow-2xl" />
        <div className="bg-white rounded-xl shadow-2xl p-5 flex items-center justify-center relative">
          <img
            src="/home2ndSec.png"
            alt=""
            className="w-[90%] h-auto rounded-lg shadow-xl z-20"
          />
        </div>
      </section>

      {/* Third section */}
      <section className="text-center md:mt-50 bg-accent/30 shardow-2xl py-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-dark-lavender mb-8">
          Featuring a wide range of essential developer tools.
        </h1>

        <div
          className="overflow-hidden whitespace-nowrap w-full"
          // onMouseEnter={handleMouseEnter}
          // onMouseLeave={handleMouseLeave}
        >
          <div
            ref={marqueeRef}
            className="flex space-x-12 text-xl md:text-2xl font-medium text-dark-lavender/50"
            style={{ width: "200%" }}
          >
            {[...Tools, ...Tools].map((tool, index) => (
              <span
                key={index}
                className="flex-shrink-0 font-simple-nunito text-md font-semibold"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Fourth section */}
      <section className="relative flex flex-col items-center justify-center w-full md:px-20 md:mt-30">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-20 bg-dark-lavender z-10 shadow-2xl" />

        <h1 className="font-simple-nunito text-dark-lavender text-2xl md:text-3xl text-center mb-8 z-20 font-bold">
          Work with ease and efficiency using our comprehensive suite of
          developer tools.
        </h1>

        <div className="bg-white rounded-xl shadow-2xl p-5 flex items-center justify-center relative">
          <video
            src="/homeVideo.mp4"
            className="w-[90%] h-auto rounded-lg shadow-xl z-20"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </section>

      {/* Fifth section - Footer */}
      <footer className="mt-50 bg-dark-lavender text-white font-simple-nunito">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h3 className="text-2xl font-bold">CogniBench</h3>
            <p className="text-sm text-white/80">
              A compact suite of essential developer tools — fast, simple, and
              free to use.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-5">Quick Tools</h4>
            <ul className="space-y-1 text-xs text-white/90">
              {Tools.slice(0, 6).map((tool) => (
                <li key={tool}>
                  <Link to="/login">{tool}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Connect</h4>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/tanishqtiwari7"
                aria-label="GitHub"
                className="text-white/90 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub />
              </a>
              <a
                href="https://discord.gg"
                aria-label="Discord"
                className="text-white/90 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaDiscord />
              </a>
              <a
                href="https://www.linkedin.com/in/tanishq-tiwari-12a3a6302/"
                aria-label="LinkedIn"
                className="text-white/90 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin />
              </a>
            </div>

            <div className="mt-6 text-sm text-white/70">
              <p>Built with 💀 for developers.</p>
              <p className="mt-2">© {new Date().getFullYear()} CogniBench</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-3 text-xs text-white/60 flex items-center justify-between">
            <span>Terms • Privacy • Status</span>
            <span>Made in India</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
