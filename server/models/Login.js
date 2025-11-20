// models/Login.js
const mongoose = require("mongoose");

const CredentialsSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// Ensure an index on email for uniqueness
CredentialsSchema.index({ email: 1 }, { unique: true });

const Login = mongoose.model("Login", CredentialsSchema);
module.exports = Login;
