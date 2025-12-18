// src/middleware/auth.middleware.js
const supabase = require('../db/supabase');

// Middleware: verify Bearer token, attach req.user (supabase auth user)
// and ensure req.profile (profiles row) exists
module.exports = async function (req, res, next) {
  try {
    const hdr = req.headers.authorization || '';
    const token = hdr.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Missing auth token' });
    }

    // Verify token with Supabase
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data || !data.user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = data.user; // Supabase auth user (auth_id)

    // Try to fetch profile
    const { data: profiles, error: pErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('auth_id', req.user.id)
      .limit(1);

    if (pErr) {
      console.error('profile lookup error', pErr);
      return res.status(500).json({ error: 'Server error' });
    }

    // If profile does NOT exist → auto-create it
    if (!profiles || profiles.length === 0) {
      const { data: newProfiles, error: cErr } = await supabase
        .from('profiles')
        .insert({
          auth_id: req.user.id,
          created_at: new Date(),
        })
        .select()
        .limit(1);

      if (cErr || !newProfiles || newProfiles.length === 0) {
        console.error('profile create error', cErr);
        return res.status(500).json({ error: 'Could not create profile' });
      }

      req.profile = newProfiles[0];
      return next();
    }

    // Profile exists
    req.profile = profiles[0];
    next();
  } catch (err) {
    console.error('auth.middleware error', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
