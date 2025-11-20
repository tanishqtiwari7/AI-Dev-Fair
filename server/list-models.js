require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Missing GEMINI_API_KEY");
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    // Note: The SDK doesn't expose listModels directly on genAI instance in all versions,
    // but we can try to infer or just test a few common ones.
    // Actually, for the Node SDK, we might not have a direct listModels helper easily accessible
    // without using the model manager if available, but let's try a different approach.
    // We will try to hit the REST API directly to list models if the SDK doesn't make it obvious.

    // But wait, let's just try 'gemini-pro' first as a fallback in the main file,
    // or we can try to fetch the models list via fetch/axios to be sure.

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    const data = await response.json();

    if (data.models) {
      console.log("Available Models:");
      data.models.forEach((m) => {
        if (
          m.supportedGenerationMethods &&
          m.supportedGenerationMethods.includes("generateContent")
        ) {
          console.log(`- ${m.name.replace("models/", "")}`);
        }
      });
    } else {
      console.log("Could not list models:", data);
    }
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();
