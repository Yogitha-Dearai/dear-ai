// src/services/visitorPersona.service.js

const supabase = require("../db/supabase");

/**
 * Visitor-facing persona snapshot.
 * NO AI calls
 * NO DB writes
 * PURE derivation
 */
async function getVisitorPersona({ ownerId, viewerId }) {
  // 1. Fetch profile owner's persona traits
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("persona_traits")
    .eq("auth_id", ownerId)
    .single();

  if (error || !profile || !profile.persona_traits) {
    return null;
  }

  const traits = profile.persona_traits;

  // 2. Derive soft visitor-facing signals
  const tone = deriveTone(traits);
  const socialEnergy = deriveSocialEnergy(traits);
  const interactionStyle = deriveInteractionStyle(traits);
  const visitorNudge = deriveVisitorNudge(traits);

  // 3. Compatibility (optional, safe)
  const compatibilityScore = await deriveCompatibility(viewerId);

  return {
    tone,
    social_energy: socialEnergy,
    interaction_style: interactionStyle,
    compatibility_score: compatibilityScore,
    visitor_nudge: visitorNudge,
  };
}

/* ---------------- DERIVATION LOGIC ---------------- */

function deriveTone(traits) {
  if (traits.empathy > 7) return "Warm · Reflective";
  if (traits.logic > 7) return "Thoughtful · Structured";
  if (traits.playfulness > 7) return "Light · Expressive";
  return "Calm · Balanced";
}

function deriveSocialEnergy(traits) {
  if (traits.introversion > 7) return "Low";
  if (traits.extroversion > 7) return "High";
  return "Medium";
}

function deriveInteractionStyle(traits) {
  if (traits.depth > 7) return "Prefers thoughtful replies";
  if (traits.brevity > 7) return "Likes concise interaction";
  return "Balanced conversational style";
}

function deriveVisitorNudge(traits) {
  const values = traits.values;

  // If values is not an array, do nothing (safe exit)
  if (!Array.isArray(values)) return null;

  if (values.includes("honesty")) {
    return "Sincere replies work best here.";
  }

  if (values.includes("patience")) {
    return "They open up slowly. Stay patient.";
  }

  return null;
}

/* ---------------- COMPATIBILITY (SAFE & CHEAP) ---------------- */

async function deriveCompatibility(viewerId) {
  if (!viewerId) return null;

  const { data: viewer } = await supabase
    .from("profiles")
    .select("persona_traits")
    .eq("auth_id", viewerId)
    .single();

  if (!viewer || !viewer.persona_traits) return null;

  return roughSimilarity(viewer.persona_traits);
}

function roughSimilarity(traits) {
  let score = 0;
  let count = 0;

  for (const key in traits) {
    if (typeof traits[key] === "number") {
      score += traits[key];
      count++;
    }
  }

  if (count === 0) return null;

  // Normalize to 35–95 range
  const avg = score / count;
  return Math.min(95, Math.max(35, Math.round(avg * 10)));
}

/* ---------------- EXPORT ---------------- */

module.exports = {
  getVisitorPersona,
};
