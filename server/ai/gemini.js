const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("Missing GEMINI_API_KEY in .env. AI features will fail.");
}

const genAI = new GoogleGenerativeAI(apiKey);

module.exports = {
  flashModel: genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  }),
};
