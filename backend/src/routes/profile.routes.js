const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const profileController = require('../controllers/profile.controller');

router.post('/persona', auth, profileController.savePersona);
router.post('/persona/ai', auth, profileController.generatePersonaAI);

module.exports = router;
