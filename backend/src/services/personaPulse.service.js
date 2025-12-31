const supabase = require("../db/supabase");

/**
 * Persona Pulse
 * - Read-only
 * - No DB writes
 * - No AI calls
 * - Uses last 14 days of behavior
 */
async function getPersonaPulse(authId) {
  if (!authId) return null;

  const since = new Date();
  since.setDate(since.getDate() - 14);

  const { data: logs, error } = await supabase
    .from("persona_behavior_logs")
    .select("signal_type, signal_value, created_at")
    .eq("auth_id", authId)
    .gte("created_at", since.toISOString());

  if (error || !logs || logs.length === 0) {
    return {
      ai_reliance: "low",
      writing_confidence: "stable",
      recent_style_shift: null,
    };
  }

  const postCount = logs.filter(l => l.signal_type === "post_created").length;
  const aiUsedCount = logs.filter(l => l.signal_type === "ai_used").length;

  const ratio = postCount === 0 ? 0 : aiUsedCount / postCount;

  let ai_reliance = "low";
  if (ratio > 0.7) ai_reliance = "high";
  else if (ratio >= 0.3) ai_reliance = "medium";

  let writing_confidence = "stable";
  if (ratio < 0.3) writing_confidence = "growing";
  else if (ratio > 0.7) writing_confidence = "dependent";

  return {
    ai_reliance,
    writing_confidence,
    recent_style_shift: null, // reserved for later
  };
}

module.exports = {
  getPersonaPulse,
};
