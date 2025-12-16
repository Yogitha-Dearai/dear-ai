const supabase = require('../db/supabase');

if (!supabase) {
  throw new Error('Supabase client not initialized');
}

const createPost = async (author_id, content) => {
  const { data, error } = await supabase
    .from('posts')
    .insert([{ author_id, content }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

const getPosts = async () => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

const getPostById = async (id) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
};
