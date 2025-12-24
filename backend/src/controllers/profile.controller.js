const ai = require('../ai');
const supabase = require('../db/supabase');

// 🔒 Hardcoded AI friend names (can edit anytime)
const AI_NAMES = [
  // Female / Neutral
  'Riya', 'Siya', 'Mira', 'Maya', 'Tara',
  'Rose', 'Lily', 'Doly', 'Ella', 'Eve',
  // Male / Neutral
  'Arya', 'Adam', 'Ved', 'Dev', 'Neel',
  'Alex', 'Leo', 'Mike', 'Ryan', 'Jade',
];

// Helper: assign AI name ONCE
async function ensureAiName(profileId) {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('ai_name')
    .eq('id', profileId)
    .limit(1);

  if (error || !profiles || !profiles[0]) return;

  if (!profiles[0].ai_name) {
    const randomName =
      AI_NAMES[Math.floor(Math.random() * AI_NAMES.length)];

    await supabase
      .from('profiles')
      .update({
        ai_name: randomName,
        updated_at: new Date(),
      })
      .eq('id', profileId);
  }
}

// -----------------------------
// SAVE PERSONA (AUTO AI + NAME)
// -----------------------------
exports.savePersona = async (req, res) => {
  try {
    const profileId = req.profile.id;
    const { answers } = req.body;

    if (!answers) {
      return res.status(400).json({ error: 'Missing persona answers' });
    }

    // Ensure AI name exists (safe to call multiple times)
    await ensureAiName(profileId);

    // Save persona answers
    const { error } = await supabase
      .from('profiles')
      .update({
        persona_answers: answers,
        persona_completed: true,
        updated_at: new Date(),
      })
      .eq('id', profileId);

    if (error) {
      console.error('savePersona error', error);
      return res.status(500).json({ error: 'Could not save persona' });
    }

    // Auto-generate AI persona (non-blocking)
    try {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('persona_answers, persona_summary')
        .eq('id', profileId)
        .limit(1);

      if (
        profiles &&
        profiles[0] &&
        profiles[0].persona_answers &&
        !profiles[0].persona_summary
      ) {
        const aiResult = await ai.generatePersona(
          profiles[0].persona_answers
        );

        await supabase
          .from('profiles')
          .update({
            persona_summary: aiResult.summary,
            persona_traits: aiResult.traits,
            updated_at: new Date(),
          })
          .eq('id', profileId);
      }
    } catch (aiErr) {
      console.error('Auto persona AI failed (non-blocking)', aiErr);
    }

    res.json({ success: true });
  } catch (err) {
    console.error('savePersona exception', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ----------------------------------
// MANUAL AI GENERATION (KEEP)
// ----------------------------------
exports.generatePersonaAI = async (req, res) => {
  try {
    const profileId = req.profile.id;

    // Ensure AI name exists here too (extra safety)
    await ensureAiName(profileId);

    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('persona_answers, persona_summary')
      .eq('id', profileId)
      .limit(1);

    if (error || !profiles || profiles.length === 0) {
      return res.status(400).json({ error: 'Profile not found' });
    }

    const profile = profiles[0];

    if (profile.persona_summary) {
      return res.json({ message: 'Persona already generated' });
    }

    if (!profile.persona_answers) {
      return res.status(400).json({ error: 'Persona answers missing' });
    }

    const aiResult = await ai.generatePersona(profile.persona_answers);

    const { error: uErr } = await supabase
      .from('profiles')
      .update({
        persona_summary: aiResult.summary,
        persona_traits: aiResult.traits,
        updated_at: new Date(),
      })
      .eq('id', profileId);

    if (uErr) {
      console.error('persona save error', uErr);
      return res.status(500).json({ error: 'Failed to save persona AI' });
    }

    res.json({ success: true, persona: aiResult });
  } catch (err) {
    console.error('generatePersonaAI error', err);
    res.status(500).json({ error: 'AI generation failed' });
  }
};
exports.getMe = async (req, res) => {
  try {
    const profileId = req.profile.id;

    // 🔥 ENSURE AI NAME HERE (this was missing)
    await ensureAiName(profileId);

    // Fetch fresh profile (after possible update)
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select(
        'id, ai_name, persona_completed, persona_summary, persona_traits'
      )
      .eq('id', profileId)
      .limit(1);

    if (error || !profiles || !profiles[0]) {
      return res.status(400).json({ error: 'Profile not found' });
    }

    res.json(profiles[0]);
  } catch (err) {
    console.error('getMe error', err);
    res.status(500).json({ error: 'Server error' });
  }
};
