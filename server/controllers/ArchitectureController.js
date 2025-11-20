const axios = require("axios");
const { flashModel } = require("../ai/gemini");

// ---- Utilities ----

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
    .replace(/\\(?!["\\/bfnrtu])/g, "\\\\")
    .replace(/“|”/g, '"')
    .replace(/‘|’/g, "'");
}

// ---- GitHub API Helper ----

async function ghGet(path, token) {
  const headers = {
    Accept: "application/vnd.github+json",
  };
  if (token) {
    headers.Authorization = `token ${token}`;
  }
  const res = await axios.get(`https://api.github.com${path}`, { headers });
  return res.data;
}

// ---- Core Logic ----

async function fetchRepoData(owner, repo, token) {
  // 1. Get Repo Meta & Default Branch
  const repoMeta = await ghGet(`/repos/${owner}/${repo}`, token);
  const defaultBranch = repoMeta.default_branch;

  // 2. Get Branch SHA (more robust than asking for tree by branch name)
  const branchInfo = await ghGet(
    `/repos/${owner}/${repo}/branches/${defaultBranch}`,
    token
  );
  const treeSha = branchInfo.commit.commit.tree.sha;

  // 3. Get Recursive Tree
  // Limit recursive depth or file count if needed, but GitHub API handles up to 100k items (truncated)
  // We will slice it later.
  const treeData = await ghGet(
    `/repos/${owner}/${repo}/git/trees/${treeSha}?recursive=1`,
    token
  );

  const allFiles = treeData.tree || [];

  // 4. Select Important Files for Context
  // We can't send everything. We pick:
  // - Config files (package.json, etc.)
  // - README
  // - A few source files to understand structure

  const IMPORTANT_FILES = [
    "package.json",
    "tsconfig.json",
    "jsconfig.json",
    "requirements.txt",
    "pyproject.toml",
    "setup.py",
    "Gemfile",
    "composer.json",
    "pom.xml",
    "build.gradle",
    "go.mod",
    "Cargo.toml",
    "README.md",
    "Dockerfile",
    "docker-compose.yml",
    "Makefile",
  ];

  const importantBlobs = allFiles.filter((f) => {
    if (f.type !== "blob") return false;
    const name = f.path.split("/").pop();
    return IMPORTANT_FILES.includes(name);
  });

  // Also pick some "structure" files (e.g. index.js, main.py, App.jsx)
  // or just the first few files in src/ to give a hint of coding style
  const sourceBlobs = allFiles
    .filter((f) => {
      if (f.type !== "blob") return false;
      const p = f.path.toLowerCase();
      return (
        (p.startsWith("src/") ||
          p.includes("controller") ||
          p.includes("model") ||
          p.includes("route")) &&
        (p.endsWith(".js") ||
          p.endsWith(".ts") ||
          p.endsWith(".py") ||
          p.endsWith(".java") ||
          p.endsWith(".go") ||
          p.endsWith(".jsx") ||
          p.endsWith(".tsx"))
      );
    })
    .slice(0, 8); // Limit to 8 source files

  // Combine and deduplicate
  const filesToFetch = [...new Set([...importantBlobs, ...sourceBlobs])].slice(
    0,
    15
  );

  // 5. Fetch Content
  const fileContents = {};
  for (const f of filesToFetch) {
    try {
      // Using raw content API or blob API.
      // contents API returns base64.
      const fileData = await ghGet(
        `/repos/${owner}/${repo}/contents/${f.path}`,
        token
      );
      const content = Buffer.from(fileData.content, fileData.encoding).toString(
        "utf-8"
      );
      // Truncate large files
      fileContents[f.path] = content.slice(0, 4000);
    } catch (e) {
      console.warn(`Failed to fetch content for ${f.path}`);
    }
  }

  return { repoMeta, tree: allFiles, files: fileContents };
}

function buildPrompt(repoMeta, tree, files) {
  // Create a simplified tree view (just paths)
  // Limit tree to top 300 items to save tokens
  const treeList = tree
    .filter((t) => t.type === "blob")
    .map((t) => t.path)
    .slice(0, 300)
    .join("\n");

  const fileBlocks = Object.entries(files)
    .map(([p, c]) => `----- FILE: ${p} -----\n${c}\n`)
    .join("\n");

  return `
You are a Senior Software Architect.
Analyze the following GitHub repository.

REPO: ${repoMeta.full_name}
DESC: ${repoMeta.description}

FILE STRUCTURE (Partial):
${treeList}

SELECTED FILE CONTENTS:
${fileBlocks}

TASK:
Provide a comprehensive architectural analysis in JSON format.

REQUIREMENTS:
1. Analyze the tech stack, design patterns, and structure.
2. Identify the "Layers" (e.g., Presentation, Business Logic, Data Access).
3. List "Key Components" and their responsibilities.
4. Describe the "Data Flow" (how data moves through the app).
5. Create a "Mermaid" diagram code (graph TD) representing the high-level architecture.
6. Identify "Potential Issues" (scalability, security, maintainability).
7. Write a concise "Summary".

OUTPUT FORMAT (JSON ONLY):
{
  "summary": "...",
  "layers": ["Layer 1", "Layer 2"],
  "key_components": ["Comp1: does X", "Comp2: does Y"],
  "data_flow": "Description of flow...",
  "potential_issues": ["Issue 1", "Issue 2"],
  "tree_mermaid": "graph TD; A[Client] --> B[Server]; ..."
}
`;
}

// ---- Controller Function ----

async function analyzeArchitecture(req, res) {
  try {
    const { repoUrl } = req.body;
    if (!repoUrl)
      return res.status(400).json({ message: "repoUrl is required" });

    const parsed = parseRepoUrl(repoUrl);
    if (!parsed) return res.status(400).json({ message: "Invalid GitHub URL" });

    const token = process.env.GITHUB_TOKEN;

    // 1. Fetch Data
    const { repoMeta, tree, files } = await fetchRepoData(
      parsed.owner,
      parsed.repo,
      token
    );

    // 2. Build Prompt
    const prompt = buildPrompt(repoMeta, tree, files);

    // 3. Generate AI Response
    const result = await flashModel.generateContent(prompt);
    const rawText = result.response.text();

    // 4. Parse JSON
    let json;
    try {
      const cleanJson = jsonRepair(
        rawText
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim()
      );
      json = JSON.parse(cleanJson);
    } catch (e) {
      console.error("JSON Parse Error:", e);
      // Fallback
      json = {
        summary: "AI analysis completed but returned invalid JSON.",
        layers: [],
        key_components: [],
        data_flow: rawText, // Return raw text so user sees something
        potential_issues: ["JSON Parsing Failed"],
        tree_mermaid: "",
      };
    }

    // 5. Add Metadata for Frontend
    json.repo_details = {
      owner: repoMeta.owner.login,
      name: repoMeta.name,
      stars: repoMeta.stargazers_count,
      forks: repoMeta.forks_count,
      description: repoMeta.description,
    };
    // Send a simplified tree for the frontend to display if needed
    json.tree_raw = tree
      .map((t) => t.path)
      .slice(0, 500)
      .join("\n");

    res.json({ ok: true, data: json });
  } catch (err) {
    console.error("Architecture Analysis Error:", err.message);

    if (err.response) {
      const status = err.response.status;
      if (status === 404)
        return res
          .status(404)
          .json({ message: "Repository not found or private." });
      if (status === 403 || status === 429)
        return res
          .status(429)
          .json({ message: "GitHub API rate limit exceeded." });
      if (status === 401)
        return res.status(401).json({ message: "Invalid GitHub Token." });
    }

    res.status(500).json({ message: "Analysis failed", error: err.message });
  }
}

module.exports = { analyzeArchitecture };
