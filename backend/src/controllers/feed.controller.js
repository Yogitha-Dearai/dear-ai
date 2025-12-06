const feedService = require('../services/feed.service');

exports.getFeed = async (req, res) => {
  try {
    const profileId = req.profile.id;   // logged-in user's profile ID

    const feed = await feedService.getFeed(profileId);

    return res.status(200).json(feed);

  } catch (err) {
    console.error("getFeed error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
