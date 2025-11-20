import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// -------------------- AUTH --------------------

export const LoginChecker = async (email, password) => {
  const response = await api.post("/login", { email, password });
  return response.data;
};

export const getProfile = async () => {
  const token = localStorage.getItem("token");
  const response = await api.get("/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const SignupUser = async (email, password) => {
  const response = await api.post("/signup", { email, password });
  return response.data;
};

// ----------------- AI Summarizer -----------------

export const summarizeCode = async (code) => {
  const token = localStorage.getItem("token");

  const response = await api.post(
    "/api/ai/code/summarize",
    { code },
    { headers: { Authorization: token ? `Bearer ${token}` : "" } }
  );

  return response.data.summary;
};
