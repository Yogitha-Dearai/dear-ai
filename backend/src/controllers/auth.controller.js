const authService = require('../services/auth.service');

// Signup - create user (admin)
exports.signup = async (req, res) => {
  try {
    const { email, password, display_name } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    const { user, error } = await authService.signup(email, password, { display_name });
    if (error) return res.status(400).json({ error: error.message || error });

    // Optionally create profile row in public.profiles
    if (user && user.id) {
      await authService.ensureProfile(user.id, display_name || email);
    }

    return res.status(201).json({ user });
  } catch (err) {
    console.error('signup error', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Login - return access token & user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    const { session, error } = await authService.login(email, password);
    if (error) return res.status(400).json({ error: error.message || error });

    // session contains access_token, refresh_token, user
    return res.status(200).json(session);
  } catch (err) {
    console.error('login error', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
