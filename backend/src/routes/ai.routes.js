const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const aiController = require("../controllers/ai.controller");

// Rephrase text (protected)
router.post("/refine", auth, aiController.refineText);

module.exports = router;
