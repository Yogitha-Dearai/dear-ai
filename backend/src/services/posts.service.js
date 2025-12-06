const supabase = require('../db/supabase');

// CREATE a post (Stamp)
exports.createPost = async (author_id, content) => {
  const { data, error } = await supabase
    .from('posts')
    .insert([{ author_id, content }])
    .select()
    .single();

  if (error) {
    console.error('Supabase createPost error:', error);
    throw error;
  }

  return data;
};

// GET all posts (Feed)
exports.getPosts = async () => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase getPosts error:', error);
    throw error;
  }

  return data;
};

// GET single post by ID
exports.getPostById = async (id) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Supabase getPostById error:', error);
    return null;
  }

  return data;
};
