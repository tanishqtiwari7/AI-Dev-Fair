const express = require("express");
const auth = require("../middleware/Auth");
const rateLimit = require("express-rate-limit");
const { analyzeArchitecture } = require("../controllers/ArchitectureController");

const router = express.Router();

const limiter = rateLimit({
  windowMs: 60000,
  max: 10,
});

router.post("/analyze", auth, limiter, analyzeArchitecture);

module.exports = router;
