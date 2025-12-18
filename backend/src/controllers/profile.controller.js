const supabase = require('../db/supabase');

exports.savePersona = async (req, res) => {
  try {
    const profileId = req.profile.id;
    const { answers } = req.body;

    if (!answers) {
      return res.status(400).json({ error: 'Missing persona answers' });
    }

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

    res.json({ success: true });
  } catch (err) {
    console.error('savePersona exception', err);
    res.status(500).json({ error: 'Server error' });
  }
};
