const commentsService = require('../services/comments.service');

// Create a comment (Respond)
exports.createComment = async (req, res) => {
  try {
    const { post_id, author_id, content } = req.body;
    if (!post_id || !author_id || !content) {
      return res.status(400).json({ error: 'post_id, author_id and content required' });
    }

    const result = await commentsService.createComment(post_id, author_id, content);
    return res.status(201).json(result);
  } catch (err) {
    console.error('createComment error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Get comments for a post
exports.getCommentsByPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const result = await commentsService.getCommentsByPost(postId);
    return res.status(200).json(result);
  } catch (err) {
    console.error('getCommentsByPost error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
