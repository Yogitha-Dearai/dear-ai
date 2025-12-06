// src/middleware/auth.middleware.js
const supabase = require('../db/supabase');

// Middleware: verify Bearer token, attach req.user (supabase auth user) and req.profile (profiles row)
module.exports = async function (req, res, next) {
  try {
    const hdr = req.headers.authorization || '';
    const token = hdr.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Missing auth token' });

    // Ask Supabase who this token belongs to
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data || !data.user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = data.user; // supabase auth user (contains id = auth_id)

    // fetch profile row for this auth user
    const { data: profiles, error: pErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('auth_id', req.user.id)
      .limit(1);

    if (pErr) {
      console.error('profile lookup error', pErr);
      return res.status(500).json({ error: 'Server error' });
    }

    if (!profiles || profiles.length === 0) {
      // no profile yet — create one (optional) or return 403
      return res.status(403).json({ error: 'Profile not found for user' });
    }

    req.profile = profiles[0]; // attach profile { id, auth_id, ... }
    next();
  } catch (err) {
    console.error('auth.middleware error', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
