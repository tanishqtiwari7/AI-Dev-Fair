// File: routes/AiCode.js (No significant changes needed)
const express = require("express");
const rateLimit = require("express-rate-limit");
const auth = require("../middleware/Auth");
const { handleSummarize } = require("../controllers/AICodeController");

const router = express.Router();

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/summarize", auth, limiter, async (req, res, next) => {
  try {
    return await handleSummarize(req, res, next); // Pass 'next' for cleaner error flow
  } catch (err) {
    next(err);
  }
});

module.exports = router;
