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

// ---- Controller Functions ----

// 1. Get Tree
async function getTree(req, res) {
  try {
    const { repoUrl } = req.body;
    if (!repoUrl)
      return res.status(400).json({ message: "repoUrl is required" });

    const parsed = parseRepoUrl(repoUrl);
    if (!parsed) return res.status(400).json({ message: "Invalid GitHub URL" });

    const token = process.env.GITHUB_TOKEN;

    // Get default branch
    const repoMeta = await ghGet(
      `/repos/${parsed.owner}/${parsed.repo}`,
      token
    );
    const defaultBranch = repoMeta.default_branch;

    // Get Branch SHA
    const branchInfo = await ghGet(
      `/repos/${parsed.owner}/${parsed.repo}/branches/${defaultBranch}`,
      token
    );
    const treeSha = branchInfo.commit.commit.tree.sha;

    // Get Recursive Tree
    const treeData = await ghGet(
      `/repos/${parsed.owner}/${parsed.repo}/git/trees/${treeSha}?recursive=1`,
      token
    );

    // Filter to blobs only for simplicity in this explorer
    const tree = (treeData.tree || [])
      .filter((item) => item.type === "blob")
      .map((item) => ({ path: item.path, type: item.type, url: item.url }));

    res.json({ tree });
  } catch (err) {
    console.error("Explorer Tree Error:", err.message);
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
    res
      .status(500)
      .json({ message: "Failed to fetch tree", error: err.message });
  }
}

// 2. Get Content
async function getContent(req, res) {
  try {
    const { repoUrl, path } = req.body;
    if (!repoUrl || !path)
      return res.status(400).json({ message: "repoUrl and path required" });

    const parsed = parseRepoUrl(repoUrl);
    const token = process.env.GITHUB_TOKEN;

    // Fetch content
    const fileData = await ghGet(
      `/repos/${parsed.owner}/${parsed.repo}/contents/${path}`,
      token
    );

    // Decode Base64
    const content = Buffer.from(fileData.content, fileData.encoding).toString(
      "utf-8"
    );

    res.json({ content });
  } catch (err) {
    console.error("Explorer Content Error:", err.message);
    res
      .status(500)
      .json({ message: "Failed to fetch content", error: err.message });
  }
}

// 3. AI Search
async function searchRepo(req, res) {
  try {
    const { repoUrl, query } = req.body;
    if (!repoUrl || !query)
      return res.status(400).json({ message: "repoUrl and query required" });

    const parsed = parseRepoUrl(repoUrl);
    const token = process.env.GITHUB_TOKEN;

    // Fetch context: Tree + README
    const repoMeta = await ghGet(
      `/repos/${parsed.owner}/${parsed.repo}`,
      token
    );
    const defaultBranch = repoMeta.default_branch;
    const branchInfo = await ghGet(
      `/repos/${parsed.owner}/${parsed.repo}/branches/${defaultBranch}`,
      token
    );
    const treeSha = branchInfo.commit.commit.tree.sha;
    const treeData = await ghGet(
      `/repos/${parsed.owner}/${parsed.repo}/git/trees/${treeSha}?recursive=1`,
      token
    );

    const fileList = (treeData.tree || [])
      .filter((t) => t.type === "blob")
      .map((t) => t.path)
      .slice(0, 300) // Limit context
      .join("\n");

    let readme = "";
    try {
      const r = await ghGet(
        `/repos/${parsed.owner}/${parsed.repo}/readme`,
        token
      );
      readme = Buffer.from(r.content, r.encoding)
        .toString("utf-8")
        .slice(0, 2000);
    } catch (e) {
      // No readme found
    }

    const prompt = `
You are a Codebase Explorer Assistant.
User Query: "${query}"

REPO: ${parsed.owner}/${parsed.repo}
DESC: ${repoMeta.description}

FILE STRUCTURE (Partial):
${fileList}

README (Partial):
${readme}

TASK:
Answer the user's question based on the file structure and README.
If they ask where code is located, point to specific files.
If they ask about functionality, infer from file names and README.
Keep the answer concise and helpful.
`;

    const result = await flashModel.generateContent(prompt);
    const text = result.response.text();

    res.json({ result: text });
  } catch (err) {
    console.error("Explorer Search Error:", err.message);
    res.status(500).json({ message: "Search failed", error: err.message });
  }
}

module.exports = { getTree, getContent, searchRepo };
