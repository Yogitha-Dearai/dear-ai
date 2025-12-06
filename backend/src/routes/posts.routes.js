const express = require('express');
const router = express.Router();

const postsController = require('../controllers/posts.controller');
const auth = require('../middleware/auth.middleware');

// Create a post (Stamp) — protected
router.post('/', auth, postsController.createPost);

// Get all posts (Feed)
router.get('/', postsController.getPosts);

// Get a single post by ID
router.get('/:id', postsController.getPostById);

module.exports = router;
