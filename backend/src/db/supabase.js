const { createClient } = require("@supabase/supabase-js");

console.log("Loaded ENV:", {
  url: process.env.SUPABASE_URL,
  anon: process.env.SUPABASE_ANON_KEY?.slice(0, 5),
  service: process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 5),
});

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Supabase NOT initialized. Missing keys.");
  console.error("SUPABASE_URL:", SUPABASE_URL);
  console.error("SUPABASE_KEY:", SUPABASE_KEY);
  module.exports = null;
} else {
  console.log("✅ Supabase client initialized!");
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  module.exports = supabase;
}
