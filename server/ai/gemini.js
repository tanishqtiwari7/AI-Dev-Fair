// ai/gemini.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error(" Missing GEMINI_API_KEY in .env");
}

const genAI = new GoogleGenerativeAI(apiKey);

const flashModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

module.exports = { flashModel };
