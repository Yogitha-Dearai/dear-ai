const express = require('express');
const router = express.Router();

const likesController = require('../controllers/likes.controller');
const auth = require('../middleware/auth.middleware');

// Toggle like (Clap)
router.post('/toggle', auth, likesController.toggleLike);

// Get likes count for a post
router.get('/count/:postId', likesController.getLikesCount);

module.exports = router;
