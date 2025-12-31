const ai = require("../ai");
const supabase = require("../db/supabase");
const { getPersonaPulse } = require("../services/personaPulse.service");

/**
 * Convert human-readable persona traits (array of adjectives)
 * into structured traits that AI can reliably use.
 */
function normalizeTraits(rawTraits = []) {
  const traits = {
    expression: "reserved",
    thinking: "practical",
    energy: "calm",
    social: "private",
    growth: "stability",
  };

  const text = rawTraits.join(" ").toLowerCase();

  if (text.includes("dynamic") || text.includes("expressive")) {
    traits.expression = "expressive";
  }

  if (text.includes("reflective") || text.includes("introspective")) {
    traits.thinking = "reflective";
  }

  if (
    text.includes("ambitious") ||
    text.includes("driven") ||
    text.includes("strong-willed")
  ) {
    traits.energy = "driven";
  }

  if (text.includes("open") || text.includes("social")) {
    traits.social = "open";
  }

  if (
    text.includes("growth") ||
    text.includes("experiment") ||
    text.includes("learning")
  ) {
    traits.growth = "experiment";
  }

  return traits;
}

/**
 * Convert structured traits into tone guidance for AI
 */
function buildToneGuide(traits = {}) {
  const guide = [];

  if (traits.expression === "expressive") {
    guide.push("Write with warmth and emotional depth.");
  } else {
    guide.push("Keep the writing concise and understated.");
  }

  if (traits.thinking === "reflective") {
    guide.push("Include introspection and thoughtful reflection.");
  } else {
    guide.push("Be grounded and practical.");
  }

  if (traits.energy === "driven") {
    guide.push("Use forward-looking and purposeful language.");
  } else {
    guide.push("Maintain a calm and steady tone.");
  }

  if (traits.social === "open") {
    guide.push("Use inclusive language that invites connection.");
  } else {
    guide.push("Keep the focus inward and personal.");
  }

  if (traits.growth === "experiment") {
    guide.push("Lean into curiosity and growth.");
  } else {
    guide.push("Emphasize balance and stability.");
  }

  return guide.join(" ");
}

/**
 * AI endpoint:
 * - refine → improves user-written text (NO persona)
 * - draft  → generates new content using persona
 */
exports.refineText = async (req, res) => {
  try {
    const { text, mode } = req.body;
    const profileId = req.profile.id;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Text is required" });
    }

    // ✍️ REFINE MODE (NO persona influence)
  if (mode !== "draft") {
  const refined = await ai.refineText(text);
  
// Day 24 – Step 4.1: log refine ONLY if explicitly triggered
if (req.body.explicit_refine === true) {
  (async () => {
    try {
      await supabase.from('persona_behavior_logs').insert({
        auth_id: req.user.id,
        signal_type: 'ai_used',
        signal_value: 'refine',
      });
    } catch (_) {}
  })();
}

  return res.json({ refinedText: refined.trim() });
  }


    // 🤖 DRAFT MODE (WITH persona influence)
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("persona_traits")
      .eq("id", profileId)
      .limit(1);

    if (error || !profiles || !profiles[0]) {
      return res.status(400).json({ error: "Profile not found" });
    }

    const rawTraits = profiles[0].persona_traits || [];
    const normalizedTraits = normalizeTraits(rawTraits);
    const toneGuide = buildToneGuide(normalizedTraits);

    // 🟢 Day 25: apply persona pulse (soft influence)
    const pulse = await getPersonaPulse(req.user.id);

    let pulseHint = "";
    if (pulse?.writing_confidence === "growing") {
    pulseHint = "Let the user’s own voice lead. Be subtle and restrained.";
    } else if (pulse?.ai_reliance === "high") {
    pulseHint = "Offer structure, but avoid over-polishing or dominating the voice.";
    }

    const prompt = `
Write a thoughtful, human social post based on the topic below.
${toneGuide}
${pulseHint}
Use natural paragraphs.
Do NOT mention AI or tools.

Topic:
"${text}"
`;

    const drafted = await ai.draftPost(prompt);

    // Day 24 – Step 3.2: log Ask Doly usage (fire-and-forget)
(async () => {
  try {
    await supabase.from('persona_behavior_logs').insert({
      auth_id: req.user.id,
      signal_type: 'ai_used',
      signal_value: 'ask_doly',
    });
  } catch (_) {}
})();

    res.json({ refinedText: drafted.trim() });
  } catch (err) {
    console.error("AI controller error:", err);
    res.status(500).json({ error: "AI processing failed" });
  }
};
