const express = require('express');
const router = express.Router();

const likesController = require('../controllers/likes.controller');

// Toggle like (Clap)
router.post('/toggle', likesController.toggleLike);

// Get likes count for a post
router.get('/count/:postId', likesController.getLikesCount);

module.exports = router;
