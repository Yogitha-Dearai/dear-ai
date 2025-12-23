const ai = require('../ai');
const supabase = require('../db/supabase');

// -----------------------------
// SAVE PERSONA (AUTO-TRIGGER AI)
// -----------------------------
exports.savePersona = async (req, res) => {
  try {
    const profileId = req.profile.id;
    const { answers } = req.body;

    if (!answers) {
      return res.status(400).json({ error: 'Missing persona answers' });
    }

    // 1️⃣ Save raw persona answers
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

    // 2️⃣ Auto-generate AI persona (NON-BLOCKING)
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
      // ❗ DO NOT FAIL USER FLOW IF AI FAILS
      console.error('Auto persona AI failed (non-blocking)', aiErr);
    }

    res.json({ success: true });
  } catch (err) {
    console.error('savePersona exception', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ----------------------------------
// MANUAL AI GENERATION (SAFE TO KEEP)
// ----------------------------------
exports.generatePersonaAI = async (req, res) => {
  try {
    const profileId = req.profile.id;

    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('persona_answers, persona_summary')
      .eq('id', profileId)
      .limit(1);

    if (error || !profiles || profiles.length === 0) {
      return res.status(400).json({ error: 'Profile not found' });
    }

    const profile = profiles[0];

    // prevent regeneration
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
