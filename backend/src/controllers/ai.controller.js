const ai = require("../ai");

exports.refineText = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Text is required" });
    }

    const prompt = `
Rephrase the following thought more clearly and naturally.
Do not add new ideas. Do not make it longer.
Keep the user's tone.

Text:
"${text}"
`;

    const result = await ai.generateText(prompt);

    res.json({
      refinedText: result.trim(),
    });
  } catch (err) {
    console.error("AI refine error:", err);
    res.status(500).json({ error: "AI refine failed" });
  }
};
