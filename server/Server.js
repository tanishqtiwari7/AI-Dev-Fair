require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./connection");

const credentialsRoutes = require("./routes/Credentials");
const aiCodeRoutes = require("./routes/AiCode"); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

connectDB(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("DB Error:", err));


app.use("/", credentialsRoutes);
app.use("/api/ai/code", aiCodeRoutes); 

app.listen(PORT, () => {
  console.log(`Server running at: ${PORT}`);
});
