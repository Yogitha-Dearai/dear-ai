const postsService = require('../services/posts.service');
const supabase = require('../db/supabase');

// GET /api/posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await postsService.getPosts();
    res.status(200).json(posts);
  } catch (err) {
    console.error('getPosts error:', err);
    res.status(500).json({ error: err.message });
  }
};

// GET /api/posts/:id
exports.getPostById = async (req, res) => {
  try {
    const post = await postsService.getPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/posts
exports.createPost = async (req, res) => {
  try {
    const { content, mode } = req.body;
    const author_id = req.profile.id; // from auth middleware

    const post = await postsService.createPost(author_id, content);

    // 🔹 Day 24 – Step 2: log persona behavior (post creation)
(async () => {
  try {
    await supabase.from('persona_behavior_logs').insert({
      auth_id: req.user.id,
      signal_type: 'post_created',
      signal_value: mode || 'unknown',
    });
  } catch (e) {
    // intentionally ignored (non-blocking)
  }
})();


    res.status(201).json(post);
  } catch (err) {
    console.error('createPost error:', err);
    res.status(500).json({ error: err.message });
  }
};
