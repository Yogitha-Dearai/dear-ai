const express = require('express');
const router = express.Router();

const commentsController = require('../controllers/comments.controller');
const auth = require('../middleware/auth.middleware');

// Create a comment
router.post('/', auth, commentsController.createComment);

// Get comments for a post
router.get('/post/:postId', commentsController.getCommentsByPost);

module.exports = router;
