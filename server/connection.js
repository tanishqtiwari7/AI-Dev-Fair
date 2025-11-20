const mongoose = require("mongoose");

async function connectDB(url) {
  if (!url) throw new Error("MongoDB connection URL is required");
  try {
    // Use recommended mongoose connection options
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return mongoose;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

module.exports = { connectDB };
