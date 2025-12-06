const likesService = require('../services/likes.service');

// Toggle Like (Clap)
exports.toggleLike = async (req, res) => {
  try {
    const { post_id } = req.body;
    const user_id = req.profile.id;    // TRUSTED user id from middleware

    if (!post_id) {
      return res.status(400).json({ error: 'post_id required' });
    }

    const result = await likesService.toggleLike(post_id, user_id);
    return res.status(200).json(result);

  } catch (err) {
    console.error('toggleLike error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Get Likes Count
exports.getLikesCount = async (req, res) => {
  try {
    const postId = req.params.postId;

    const result = await likesService.getLikesCount(postId);
    return res.status(200).json(result);

  } catch (err) {
    console.error('getLikesCount error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
