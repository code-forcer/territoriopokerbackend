// controllers/forum/forumController.js
const Thread = require('../../models/Thread');
const Reply = require('../../models/Reply');
const User = require('../../models/User');
const asyncHandler = require('../../middleware/asyncHandler');
const ErrorResponse = require('../../middleware/errorHandler');

// @desc    Get all threads
// @route   GET /api/forum/threads
// @access  Private
exports.getAllThreads = asyncHandler(async (req, res, next) => {
  const { category, sort = '-lastActivity', page = 1, limit = 20 } = req.query;

  const query = category ? { category } : {};

  const threads = await Thread.find(query)
    .populate('author', 'fullName avatar')
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const count = await Thread.countDocuments(query);

  res.status(200).json({
    success: true,
    data: threads,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      pages: Math.ceil(count / limit)
    }
  });
});

// @desc    Get single thread
// @route   GET /api/forum/threads/:id
// @access  Private
exports.getThread = asyncHandler(async (req, res, next) => {
  const thread = await Thread.findById(req.params.id)
    .populate('author', 'fullName avatar')
    .populate('replies.author', 'fullName avatar');

  if (!thread) {
    return next(new ErrorResponse(`Thread not found with id of ${req.params.id}`, 404));
  }

  // Increment views
  thread.views += 1;
  await thread.save();

  res.status(200).json({
    success: true,
    data: thread
  });
});

// @desc    Create new thread
// @route   POST /api/forum/threads
// @access  Private
exports.createThread = asyncHandler(async (req, res, next) => {
  const { title, content, category } = req.body;

  const thread = await Thread.create({
    title,
    content,
    category,
    author: req.user.id
  });

  res.status(201).json({
    success: true,
    data: thread
  });
});
// @desc    Add reply to thread
// @route   POST /api/forum/threads/:id/reply
// @access  Private
exports.addReply = asyncHandler(async (req, res, next) => {
  const thread = await Thread.findById(req.params.id);

  if (!thread) {
    return next(new ErrorResponse(`Thread not found with id of ${req.params.id}`, 404));
  }

  if (thread.isLocked) {
    return next(new ErrorResponse('This thread is locked', 403));
  }

  const reply = {
    content: req.body.content,
    author: req.user.id,  // This saves the user's ID (not the name)
  };

  thread.replies.push(reply);
  await thread.save();

  // Populate both thread's author and reply's author field
  await thread.populate('author', 'fullName avatar');  // Adjusted to 'fullName'
  await thread.populate('replies.author', 'fullName avatar');  // Adjusted to 'fullName'

  res.status(201).json({
    success: true,
    data: thread,
  });
});


// @desc    Delete thread
// @route   DELETE /api/forum/threads/:id
// @access  Private
exports.deleteThread = asyncHandler(async (req, res, next) => {
  const thread = await Thread.findById(req.params.id);

  if (!thread) {
    return next(new ErrorResponse(`Thread not found with id of ${req.params.id}`, 404));
  }

  // Check if user is thread author or admin
  if (thread.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to delete this thread', 403));
  }

  await thread.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});
// @desc    Get forum statistics
// @route   GET /api/forum/stats
// @access  Private
exports.getForumStats = asyncHandler(async (req, res, next) => {
  const threadCount = await Thread.countDocuments();
  
  // Count the total number of replies across all threads
  const replyCount = await Thread.aggregate([
    { $unwind: "$replies" },
    { $count: "totalReplies" }
  ]);

  const userCount = await User.countDocuments();

  // If there are no replies, set replyCount to 0
  const totalReplies = replyCount.length > 0 ? replyCount[0].totalReplies : 0;

  const stats = {
    totalThreads: threadCount,
    totalReplies: totalReplies,
    totalUsers: userCount,
  };

  res.status(200).json({
    success: true,
    data: stats,
  });
});
