const supabase = require('../db/supabase');

// 🔒 Hardcoded AI friend names (editable anytime)
const AI_NAMES = [
   // Female / Neutral
  'Riya', 'Siya', 'Mira', 'Maya', 'Tara',
  'Rose', 'Lily', 'Doly', 'Ella', 'Eve',
  // Male / Neutral
  'Arya', 'Adam', 'Ved', 'Dev', 'Neel',
  'Alex', 'Leo', 'Mike', 'Ryan', 'Jade',
];

module.exports = async function (req, res, next) {
  try {
    const hdr = req.headers.authorization || '';
    const token = hdr.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Missing auth token' });
    }

    // 1️⃣ Verify token
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data || !data.user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = data.user;

    // 2️⃣ Fetch profile
    const { data: profiles, error: pErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('auth_id', req.user.id)
      .limit(1);

    if (pErr || !profiles || profiles.length === 0) {
      return res.status(403).json({ error: 'Profile not found for user' });
    }

    const profile = profiles[0];

    // 3️⃣ ASSIGN AI NAME ONCE (HERE IS THE FIX)
    if (!profile.ai_name) {
      const randomName =
        AI_NAMES[Math.floor(Math.random() * AI_NAMES.length)];

      await supabase
        .from('profiles')
        .update({
          ai_name: randomName,
          updated_at: new Date(),
        })
        .eq('id', profile.id);

      profile.ai_name = randomName; // keep req.profile consistent
    }

    req.profile = profile;
    next();
  } catch (err) {
    console.error('auth.middleware error', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
