const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "SUPER_SECRET_KEY";

function auth(req, res, next) {
  const header = req.headers["authorization"] || req.headers["Authorization"];
  if (!header)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  // Accept formats: "Bearer <token>" or just the token
  const token = String(header).startsWith("Bearer ")
    ? header.slice(7).trim()
    : header.trim();

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

module.exports = auth;
