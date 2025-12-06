const postsService = require('../services/posts.service');

// Create Post (Stamp)
exports.createPost = async (req, res) => {
  try {
    // author comes from middleware - trusted
    const author_id = req.profile.id;
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'content required' });

    const result = await postsService.createPost(author_id, content);
    return res.status(201).json(result);

  } catch (err) {
    console.error('createPost error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Get all posts (Feed)
exports.getPosts = async (req, res) => {
  try {
    const result = await postsService.getPosts();
    return res.status(200).json(result);

  } catch (err) {
    console.error('getPosts error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Get one post by ID
exports.getPostById = async (req, res) => {
  try {
    const postId = req.params.id;

    const result = await postsService.getPostById(postId);
    if (!result) {
      return res.status(404).json({ error: 'Post not found' });
    }

    return res.status(200).json(result);

  } catch (err) {
    console.error('getPostById error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
