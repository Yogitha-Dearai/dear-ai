const express = require("express");
const requireAuth = require("../middleware/auth.middleware");
const { getVisitorPersona } = require("../services/visitorPersona.service");

const router = express.Router();

router.get("/:userId", requireAuth, async (req, res) => {
  try {
    const snapshot = await getVisitorPersona({
      ownerId: req.params.userId,
      viewerId: req.user.id,
    });

    res.json(snapshot);
  } catch (err) {
    console.error("Visitor persona error:", err);
    res.status(500).json({ error: "Failed to load visitor persona" });
  }
});

module.exports = router;
