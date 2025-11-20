// controllers/ReadmeController.js

const axios = require("axios");
const { flashModel } = require("../ai/gemini");

// Extract owner/repo from full GitHub URL
function parseRepoUrl(url) {
  try {
    const u = new URL(url);
    const parts = u.pathname.replace(/(^\/|\.git$)/g, "").split("/");
    if (parts.length < 2) return null;
    return { owner: parts[0], repo: parts[1] };
  } catch {
    return null;
  }
}

function jsonRepair(str) {
  return str
    .replace(/(\r\n|\r)/g, "\n")
    .replace(/\n+/g, "\n")
    .replace(/\\(?!["\\/bfnrtu])/g, "\\\\") // fix bad backslashes
    .replace(/“|”/g, '"') // fix curly quotes
    .replace(/‘|’/g, "'"); // fix single curly quotes
}

// Get file content from GitHub
async function ghGet(path, token) {
  const resp = await axios.get(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: token ? `token ${token}` : undefined,
    },
  });
  return resp.data;
}

async function fetchRepoSnapshot(owner, repo, token) {
  const repoMeta = await ghGet(`/repos/${owner}/${repo}`, token);
  const languages = await ghGet(`/repos/${owner}/${repo}/languages`, token);

  // FIX 1: Get REAL tree SHA
  const branchInfo = await ghGet(
    `/repos/${owner}/${repo}/branches/${repoMeta.default_branch}`,
    token
  );
  const treeSha = branchInfo.commit.commit.tree.sha;
  const treeData = await ghGet(
    `/repos/${owner}/${repo}/git/trees/${treeSha}?recursive=1`,
    token
  );

  const IMPORTANT_FILES = [
    "package.json",
    "requirements.txt",
    "setup.py",
    "build.gradle",
    "pom.xml",
    "pyproject.toml",
    "README.md",
    "composer.json",
    "Gemfile",
    "go.mod",
  ];

  const allFiles = treeData.tree || [];

  const importantFiles = allFiles.filter((file) => {
    if (file.type !== "blob") return false;
    const name = file.path.split("/").pop();
    return IMPORTANT_FILES.includes(name);
  });

  // Also grab some source files if we have space
  const sourceFiles = allFiles
    .filter((file) => {
      if (file.type !== "blob") return false;
      const path = file.path.toLowerCase();
      return (
        (path.startsWith("src/") ||
          path.endsWith(".js") ||
          path.endsWith(".ts") ||
          path.endsWith(".py")) &&
        !importantFiles.includes(file)
      );
    })
    .slice(0, 5);

  const selectedFiles = [...importantFiles, ...sourceFiles].slice(0, 10);
  const fileContents = {};

  for (const f of selectedFiles) {
    try {
      const file = await ghGet(
        `/repos/${owner}/${repo}/contents/${f.path}`,
        token
      );
      const content = Buffer.from(file.content, file.encoding).toString();
      fileContents[f.path] = content;
    } catch {
      fileContents[f.path] = "";
    }
  }

  return { repoMeta, languages, files: fileContents };
}

function buildReadmePrompt(snapshot, repoUrl) {
  const { repoMeta, languages, files } = snapshot;

  const fileBlocks = Object.entries(files)
    .map(([path, c]) => `--- FILE: ${path} ---\n${c.slice(0, 2500)}\n`)
    .join("\n");

  return `
You are an expert engineering documentation writer.

Generate a structured JSON ONLY.

Repo: ${repoMeta.full_name}
Description: ${repoMeta.description}
Owner: ${repoMeta.owner?.login}
License: ${repoMeta.license?.name || "Not specified"}

Languages: ${Object.keys(languages).join(", ")}

FILES:
${fileBlocks}

TASK:
Return ONLY valid JSON.
The "readme_markdown" must be a comprehensive, professional README.md file content.
It MUST contain at least 8 sections, including but not limited to:
1. Title & Description (with badges if possible)
2. Features
3. Tech Stack
4. Installation / Getting Started
5. Usage
6. Environment Variables (if detected)
7. Contributing
8. License
9. Author / Acknowledgments

The "summary" should be a concise 2-3 sentence overview of what the project does.

JSON Structure:
{
  "summary": "...",
  "readme_markdown": "... FULL README MARKDOWN CONTENT HERE ...",
  "mermaid": "graph TD; ...",
  "tech_stack": ["React", "Node", ...],
  "detected_scripts": {},
  "notes": ""
}
`;
}

async function generateReadme(req, res) {
  try {
    const { repoUrl } = req.body;

    if (!repoUrl) {
      return res.status(400).json({ message: "repoUrl required" });
    }

    const parsed = parseRepoUrl(repoUrl);
    if (!parsed) {
      return res.status(400).json({ message: "Invalid repo URL" });
    }

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

    const snapshot = await fetchRepoSnapshot(
      parsed.owner,
      parsed.repo,
      GITHUB_TOKEN
    );
    const prompt = buildReadmePrompt(snapshot, repoUrl);

    const ai = await flashModel.generateContent(prompt);
    const raw = ai.response.text();

    let json;
    try {
      // Clean up potential markdown code blocks in response
      const cleanRaw = jsonRepair(
        raw
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim()
      );
      json = JSON.parse(cleanRaw);
    } catch (e) {
      console.warn(
        "Failed to parse JSON from AI, returning raw text as markdown"
      );
      json = {
        summary: "AI returned invalid JSON.",
        readme_markdown: raw,
        mermaid: "",
        tech_stack: [],
        detected_scripts: {},
        notes: "JSON parsing error, raw output returned.",
      };
    }

    // Inject real language data for the frontend graph
    json.languages = snapshot.languages;
    json.repo_details = {
      owner: snapshot.repoMeta.owner?.login,
      license: snapshot.repoMeta.license?.name,
      stars: snapshot.repoMeta.stargazers_count,
      forks: snapshot.repoMeta.forks_count,
    };

    return res.json({ ok: true, data: json });
  } catch (err) {
    console.error("README ERROR:", err.message);

    if (err.response) {
      const status = err.response.status;
      const data = err.response.data;

      if (status === 403 || status === 429) {
        return res.status(429).json({
          message:
            "GitHub API rate limit exceeded. Please add a GITHUB_TOKEN to your server .env file.",
          details: data,
        });
      }

      return res.status(status).json({
        message: "GitHub API Error",
        details: data,
      });
    }

    return res
      .status(500)
      .json({ message: "Failed to generate README", error: err.message });
  }
}

module.exports = { generateReadme };
