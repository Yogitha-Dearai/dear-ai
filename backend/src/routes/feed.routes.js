const express = require('express');
const router = express.Router();

const feedController = require('../controllers/feed.controller');
const auth = require('../middleware/auth.middleware');

// Feed = must be logged in
router.get('/', auth, feedController.getFeed);

module.exports = router;
