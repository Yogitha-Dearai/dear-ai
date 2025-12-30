require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 👉 ROUTES
const postsRoutes = require('./routes/posts.routes');
const commentsRoutes = require('./routes/comments.routes');
const likesRoutes = require('./routes/likes.routes');
const authRoutes = require('./routes/auth.routes');
const feedRoutes = require('./routes/feed.routes');
const aiRoutes = require('./routes/ai.routes');
const profileRoutes = require('./routes/profile.routes');
const visitorPersonaRoutes = require('./routes/visitorPersona.routes');

// 👉 USE ROUTES
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/likes', likesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/persona/visitor', visitorPersonaRoutes);

// Health route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Env-check route
app.get('/env-check', (req, res) => {
  res.json({
    node_env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || '3000'
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
