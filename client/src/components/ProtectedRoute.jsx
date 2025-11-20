import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

const ProtectedRoute = ({ children }) => {
  const [status, setStatus] = useState("loading"); // loading | ok | unauth

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setStatus("unauth");
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStatus(res.ok ? "ok" : "unauth");
      } catch {
        setStatus("unauth");
      }
    };
    verify();
  }, []);

  if (status === "loading") return null; // optional: spinner
  if (status === "unauth") return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;