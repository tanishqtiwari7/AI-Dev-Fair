const express = require("express");
const auth = require("../middleware/Auth");
const rateLimit = require("express-rate-limit");
const { generateReadme } = require("../controllers/ReadmeController");

const router = express.Router();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
});

router.post("/generate", auth, limiter, generateReadme);

module.exports = router;
