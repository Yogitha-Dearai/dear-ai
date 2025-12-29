const ai = require("../ai");

exports.refineText = async (req, res) => {
  try {
    const { text, mode } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Text is required" });
    }

    let result;

    if (mode === "draft") {
      result = await ai.draftPost(text);
    } else {
      result = await ai.refineText(text);
    }

    res.json({ refinedText: result.trim() });
  } catch (err) {
    console.error("AI error:", err);
    res.status(500).json({ error: "AI processing failed" });
  }
};
