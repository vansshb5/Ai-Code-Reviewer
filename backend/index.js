const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const reviewRoute = require("./routes/review");
const authRoute = require("./routes/auth");

const app = express();
app.use(cors({
  origin: ["https://ai-code-reviewer-app.vercel.app", "http://localhost:5173"],
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/review", reviewRoute);
app.use("/api/auth", authRoute);

app.get("/", (req, res) => {
  res.send("AI Code Reviewer API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});