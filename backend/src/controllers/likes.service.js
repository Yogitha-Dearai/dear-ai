const supabase = require('../db/supabase');

// Toggle like: if exists -> remove, else -> insert. Return { liked: boolean, count: number }
exports.toggleLike = async (post_id, user_id) => {
  // check existing
  const { data: existing, error: selectErr } = await supabase
    .from('likes')
    .select('*')
    .match({ post_id, user_id })
    .limit(1);

  if (selectErr) {
    console.error('Supabase select like error:', selectErr);
    throw selectErr;
  }

  if (existing && existing.length > 0) {
    // already liked — remove
    const likeId = existing[0].id;
    const { error: delErr } = await supabase
      .from('likes')
      .delete()
      .eq('id', likeId);

    if (delErr) {
      console.error('Supabase delete like error:', delErr);
      throw delErr;
    }
    // get new count
    const { data: countData, error: countErr } = await supabase
      .from('likes')
      .select('id', { count: 'exact' })
      .eq('post_id', post_id);

    if (countErr) { throw countErr; }
    return { liked: false, count: countData.length || 0 };
  } else {
    // insert like
    const { data: inserted, error: insErr } = await supabase
      .from('likes')
      .insert([{ post_id, user_id }])
      .select()
      .single();

    if (insErr) {
      console.error('Supabase insert like error:', insErr);
      throw insErr;
    }

    const { data: countData, error: countErr } = await supabase
      .from('likes')
      .select('id', { count: 'exact' })
      .eq('post_id', post_id);

    if (countErr) { throw countErr; }
    return { liked: true, count: countData.length || 1 };
  }
};

// Get likes count
exports.getLikesCount = async (postId) => {
  const { data, error } = await supabase
    .from('likes')
    .select('id', { count: 'exact' })
    .eq('post_id', postId);

  if (error) {
    console.error('Supabase getLikesCount error:', error);
    throw error;
  }

  return { count: data.length || 0 };
};
