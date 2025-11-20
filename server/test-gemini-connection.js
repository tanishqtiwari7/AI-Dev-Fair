require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ Error: GEMINI_API_KEY is missing in .env");
    return;
  }

  console.log("Using API Key:", apiKey.substring(0, 5) + "...");

  const genAI = new GoogleGenerativeAI(apiKey);

  // Try the specific model we configured
  const modelName = "gemini-2.5-flash";
  const model = genAI.getGenerativeModel({ model: modelName });
  console.log(`Testing model: ${modelName}...`);

  try {
    const result = await model.generateContent("Hello, are you working?");
    const response = await result.response;
    console.log("✅ Success! Response:", response.text());
  } catch (error) {
    console.error("\n❌ Model Test Failed:");
    console.error("Error message:", error.message);

    if (error.message.includes("404")) {
      console.log(
        "\n💡 Tip: The model name might be wrong or not available for your API key tier."
      );
      console.log(
        "Try changing 'gemini-1.5-flash-001' to 'gemini-pro' in Backend/ai/gemini.js"
      );
    }
  }
}

testModel();
