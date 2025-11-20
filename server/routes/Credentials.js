const express = require("express");
const {
  handleLogin,
  handleSignup,
} = require("../controllers/CredentialsController");
const auth = require("../middleware/Auth");

const router = express.Router();

router.post("/login", async (req, res, next) => {
  try {
    return await handleLogin(req, res);
  } catch (err) {
    next(err);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    return await handleSignup(req, res);
  } catch (err) {
    next(err);
  }
});

router.get("/profile", auth, (req, res) => {
  res.json({ message: "Protected route OK", user: req.user });
});

module.exports = router;
