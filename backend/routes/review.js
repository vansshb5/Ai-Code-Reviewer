const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");
const Review = require("../models/Review");
const auth = require("../middleware/auth");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// POST - review code (protected)
router.post("/", auth, async (req, res) => {
  const { code, language } = req.body;

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  try {
    const prompt = `
      You are an expert code reviewer. Review the following ${language || "code"} and respond ONLY with a valid JSON object, no extra text, no markdown, no backticks.
      Use this exact format:
      {
        "issues": ["issue 1", "issue 2"],
        "suggestions": ["suggestion 1", "suggestion 2"],
        "security": ["security concern 1"],
        "performance": ["performance tip 1"],
        "improved_code": "write the improved code here on a single line using \\n for line breaks",
        "summary": "a short 1-2 sentence overall summary"
      }

      Code to review:
      ${code}
    `;

    const result = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
    });

    const text = result.choices[0].message.content;
    const clean = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch (parseErr) {
      return res.status(500).json({ error: "JSON parse failed", raw: clean });
    }

    // Save to MongoDB with userId
    await Review.create({ userId: req.userId, code, language, result: parsed });

    res.json(parsed);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI review failed", details: err.message });
  }
});

// GET - fetch user's reviews only (protected)
router.get("/history", auth, async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// DELETE - delete a review (protected)
router.delete("/:id", auth, async (req, res) => {
  try {
    await Review.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete" });
  }
});

module.exports = router;