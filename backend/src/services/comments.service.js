const supabase = require('../db/supabase');

// Create comment
exports.createComment = async (post_id, author_id, content) => {
  const { data, error } = await supabase
    .from('comments')
    .insert([{ post_id, author_id, content }])
    .select()
    .single();

  if (error) {
    console.error('Supabase createComment error:', error);
    throw error;
  }
  return data;
};

// Get comments for a post
exports.getCommentsByPost = async (postId) => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Supabase getCommentsByPost error:', error);
    throw error;
  }
  return data;
};
