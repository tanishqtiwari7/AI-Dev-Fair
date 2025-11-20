// controllers/CredentialsController.js
const LoginModel = require("../models/Login");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "SUPER_SECRET_KEY";

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

async function handleSignup(req, res) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  const trimmedEmail = String(email).trim().toLowerCase();
  if (!validateEmail(trimmedEmail)) {
    return res.status(400).json({ message: "Invalid email address." });
  }
  if (String(password).length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters." });
  }

  try {
    const existing = await LoginModel.findOne({ email: trimmedEmail });
    if (existing)
      return res.status(409).json({ message: "Email already in use." });

    const hashed = await bcrypt.hash(password, 10);
    const user = new LoginModel({ email: trimmedEmail, password: hashed });
    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.status(201).json({ message: "Signup successful.", token });
  } catch (err) {
    console.error("Signup error:", err);
    if (err && err.code === 11000)
      return res.status(409).json({ message: "Email already in use." });
    return res.status(500).json({ message: "Internal server error." });
  }
}

async function handleLogin(req, res) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const trimmedEmail = String(email).trim().toLowerCase();
    const user = await LoginModel.findOne({ email: trimmedEmail });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password." });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: "Invalid email or password." });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.status(200).json({ message: "Login successful.", token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
}

module.exports = { handleLogin, handleSignup };
