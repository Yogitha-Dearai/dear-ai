// auth.service.js
const supabase = require('../db/supabase');

// SIGNUP using admin API (requires service_role key)
exports.signup = async (email, password, metadata = {}) => {
  try {
    // use admin createUser to avoid email confirmation flow in early dev
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: metadata,
      email_confirm: true  // auto-confirm during dev; remove for production if you want verification
    });

    if (error) return { error };
    return { user: data };
  } catch (err) {
    return { error: err };
  }
};

// Ensure a public.profile exists for the user (call after signup)
exports.ensureProfile = async (auth_id, display_name) => {
  try {
    // check existing
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('auth_id', auth_id)
      .limit(1);

    if (existing && existing.length > 0) return existing[0];

    const { data, error } = await supabase
      .from('profiles')
      .insert([{ auth_id, display_name, email: null }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('ensureProfile error', err);
    throw err;
  }
};

// LOGIN using signInWithPassword (returns session)
exports.login = async (email, password) => {
  try {
    // This will return a session (access_token, refresh_token, user) when successful
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) return { error };
    return { session: data };
  } catch (err) {
    return { error: err };
  }
};
