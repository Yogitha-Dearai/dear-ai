const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn('Supabase keys not set. Supabase client disabled for now.');
  module.exports = null;
} else {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  module.exports = supabase;
}
