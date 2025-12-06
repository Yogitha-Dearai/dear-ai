const express = require('express');
const router = express.Router();

const commentsController = require('../controllers/comments.controller');

// Create a comment
router.post('/', commentsController.createComment);

// Get comments for a post
router.get('/post/:postId', commentsController.getCommentsByPost);

module.exports = router;
