const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const profileController = require('../controllers/profile.controller');

router.post('/persona', auth, profileController.savePersona);

module.exports = router;
