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

// -------------------- README GENERATOR --------------------

/**
 * Generate README from a GitHub repo URL.
 *
 * Usage:
 * const result = await generateReadme("https://github.com/owner/repo");
 * console.log(result); // { summary, readme_markdown, mermaid, ... }
 */
export const generateReadme = async (repoUrl) => {
  if (!repoUrl || typeof repoUrl !== "string") {
    throw new Error("Invalid or missing repoUrl");
  }

  const token = localStorage.getItem("token");

  const response = await api.post(
    "/api/readme/generate",
    { repoUrl },
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    }
  );

  // Backend returns { ok:true, data: {...} }
  return response.data.data; // return only the payload for cleaner frontend use
};
