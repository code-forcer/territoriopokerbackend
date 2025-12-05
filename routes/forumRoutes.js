// routes/forumRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllThreads,
  getThread,
  createThread,
  addReply,
  deleteThread,
  getForumStats
} = require('../controllers/forum/forumController');
const { protect } = require('../middleware/auth');

// All forum routes require authentication
router.use(protect);

// Thread routes
router.get('/threads', getAllThreads);
router.get('/threads/:id', getThread);
router.post('/threads', createThread);
router.post('/threads/:id/reply', addReply);
router.delete('/threads/:id', deleteThread);

// Statistics
router.get('/stats', getForumStats);

module.exports = router;