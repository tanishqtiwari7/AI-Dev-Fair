import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoginChecker } from '../api';
import { FaGoogle, FaGithub, FaFacebookF } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) return setError("Please enter an email.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setError("Enter a valid email address.");
    if (!password) return setError("Please enter a password.");

    try {
      setLoading(true);

      const data = await LoginChecker(email, password);

      // store token
      localStorage.setItem("token", data.token);

      navigate("/arena/bench",{replace:true});
    } catch (err) {
      const resp = err?.response;

      if (!resp) return setError("Network error. Please try again later.");
      if (resp.status === 404) setError("No account found for this email.");
      else if (resp.status === 401) setError("Incorrect password.");
      else setError(resp.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative"
      style={{
        backgroundImage: "url('/loginbg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[4px] z-0"></div>

      <div className="z-10 mb-8">
        <img src="/logo.png" alt="Logo" className="w-40 h-auto mx-auto" />
      </div>

      <div className="relative z-10 bg-white/95 p-8 rounded-lg shadow-lg w-full max-w-sm flex flex-col gap-4">

        <h2 className="text-center text-dark-lavender font-bold text-2xl mb-2">
          Login
        </h2>

        {error && (
          <div className="
           text-red-700 px-2 text-sm">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-accent outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-accent outline-none"
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="bg-dark-lavender text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <div className="flex justify-center gap-4 mt-4">
          <button className="p-3 rounded-full border hover:bg-gray-100">
            <FaGoogle className="w-5 h-5 text-dark-lavender" />
          </button>
          <button className="p-3 rounded-full border hover:bg-gray-100">
            <FaGithub className="w-5 h-5 text-dark-lavender" />
          </button>
          <button className="p-3 rounded-full border hover:bg-gray-100">
            <FaFacebookF className="w-5 h-5 text-dark-lavender" />
          </button>
        </div>

        <div className="text-center mt-2 text-sm">
          <span className="text-gray-700">Don't have an account?</span>
          <Link
            to="/signup"
            className="ml-2 text-dark-lavender font-semibold hover:underline"
            replace={true}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
