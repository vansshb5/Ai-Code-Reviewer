const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const reviewRoute = require("./routes/review");
const authRoute = require("./routes/auth");

const app = express();

app.use(cors({
  origin: "*"
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
const https = require("https");
setInterval(() => {
  https.get("https://ai-code-reviewer-sng5.onrender.com", (res) => {
    console.log("Keep alive ping:", res.statusCode);
  }).on("error", (err) => {
    console.log("Ping error:", err.message);
  });
}, 14 * 60 * 1000);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});