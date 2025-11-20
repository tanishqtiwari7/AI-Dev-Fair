const axios = require("axios");

let flashModel = null;
try {
  // Fix: Correct relative path to the ai/gemini module
  const gm = require("../ai/gemini");
  flashModel = gm && gm.flashModel ? gm.flashModel : null;
} catch (e) {
  if (e.code !== "MODULE_NOT_FOUND") {
    console.error("Error loading local Gemini adapter:", e.message);
  }
  flashModel = null;
}

async function handleSummarize(req, res, next) {
  try {
    const { code } = req.body || {};

    if (!code || typeof code !== "string" || code.trim().length === 0) {
      return res.status(400).json({ message: "Code is required." });
    }

    const prompt = `You are an expert code reviewer.\n\nPerform the following on the provided code:\n1) Summarize the code in simple words.\n2) Explain what it does step-by-step.\n3) Highlight potential bugs or issues.\n4) Suggest improvements.\n5) Rate code quality out of 10.\n\nCODE:\n${code}\n\nSummary:`;
    let summary = null;

    if (flashModel && typeof flashModel.generateContent === "function") {
      console.log("AICodeController: using local flashModel adapter (SDK)");

      const result = await flashModel.generateContent(prompt);

      // Fix: Correct way to get text from Google Generative AI SDK response
      summary = result.response.text();

      return res.json({ summary });
    }

    // const GEMINI_ENDPOINT = process.env.GEMINI_ENDPOINT;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      console.error("AICodeController: AI backend not configured.");

      const err = new Error(
        "AI backend not configured. Set local adapter or GEMINI_API_KEY."
      );
      err.status = 500;
      return next(err);
    }

    console.log("AICodeController: calling remote Gemini endpoint");

    const payload = {
      prompt,
      max_output_tokens: 800,
      temperature: 0.2,
    };

    // const urlWithKey = `${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`;

    const response = await axios.post(urlWithKey, payload, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });

    if (response.status >= 400) {
      const apiError = new Error(
        `Remote AI API returned status ${response.status}`
      );
      apiError.data = response.data;
      throw apiError;
    }

    const data = response.data || {};

    summary =
      data.output_text ||
      (data.choices && data.choices[0] && data.choices[0].text) ||
      (data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content?.parts[0]?.text) ||
      JSON.stringify(data);

    return res.json({ summary });
  } catch (err) {
    console.error(
      "AICodeController.handleSummarize error:",
      err.response?.data || err.message || err
    );

    if (axios.isAxiosError(err)) {
      if (err.code === "ENOTFOUND" || err.message?.includes("ENOTFOUND")) {
        return res.status(502).json({
          message: "AI provider host not found (check GEMINI_ENDPOINT).",
        });
      }

      if (err.response) {
        return res.status(502).json({
          message: "Remote AI summarization failed.",
          detail:
            err.response.data?.error?.message ||
            `Status ${err.response.status}`,
        });
      }
    }

    return res.status(502).json({
      message: "AI summarization failed.",
      error: err.message || "Unknown error",
    });
  }
}

module.exports = { handleSummarize };
