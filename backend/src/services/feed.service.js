const supabase = require('../db/supabase');

exports.getFeed = async (myProfileId) => {
  // 1) Get all posts
  const { data: posts, error: postsErr } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (postsErr) throw postsErr;
  if (!posts || posts.length === 0) return [];

  // Extract post IDs
  const postIds = posts.map(p => p.id);

  // 2) Get author profiles for all posts
  const authorIds = posts.map(p => p.author_id);

  const { data: authors, error: authorErr } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_url')
    .in('id', authorIds);

  if (authorErr) throw authorErr;

  // Convert array → map for fast lookup
  const authorMap = {};
  for (const a of authors) authorMap[a.id] = a;

  // 3) Get like counts
  const { data: likeCountRows, error: likeCountErr } = await supabase
    .from('likes')
    .select('post_id')
    .in('post_id', postIds);

  if (likeCountErr) throw likeCountErr;

  const likeCountMap = {};
  for (const row of likeCountRows) {
    likeCountMap[row.post_id] = (likeCountMap[row.post_id] || 0) + 1;
  }

  // 4) Get comment counts
  const { data: commentRows, error: commentErr } = await supabase
    .from('comments')
    .select('post_id')
    .in('post_id', postIds);

  if (commentErr) throw commentErr;

  const commentCountMap = {};
  for (const row of commentRows) {
    commentCountMap[row.post_id] = (commentCountMap[row.post_id] || 0) + 1;
  }

  // 5) Which posts did I like?
  const { data: myLikeRows, error: myLikesErr } = await supabase
    .from('likes')
    .select('post_id')
    .eq('user_id', myProfileId);

  if (myLikesErr) throw myLikesErr;

  const myLikedSet = new Set(myLikeRows.map(r => r.post_id));

  // 6) Construct clean feed items
  const feed = posts.map(post => ({
    id: post.id,
    content: post.content,
    created_at: post.created_at,

    author: authorMap[post.author_id] || null,

    counts: {
      likes: likeCountMap[post.id] || 0,
      comments: commentCountMap[post.id] || 0
    },

    likedByMe: myLikedSet.has(post.id)
  }));

  return feed;
};
