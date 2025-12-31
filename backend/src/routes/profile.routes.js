const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const profileController = require('../controllers/profile.controller');
const { getPersonaPulse } = require('../services/personaPulse.service');

// Existing routes
router.get('/me', auth, profileController.getMe);
router.post('/persona', auth, profileController.savePersona);
router.post('/persona/ai', auth, profileController.generatePersonaAI);

// 🟢 Day 25: Persona Pulse (read-only)
router.get('/pulse', auth, async (req, res) => {
  try {
    const pulse = await getPersonaPulse(req.user.id);
    res.json(pulse);
  } catch (err) {
    console.error('persona pulse error:', err);
    res.status(500).json({ error: 'Failed to load persona pulse' });
  }
});

module.exports = router;
