const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Reply content is required'],
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const threadSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Thread title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Thread content is required'],
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Strategy & Tips',
      'Tournament Discussion',
      'Hand Analysis',
      'General Chat',
      'News & Updates'
    ]
  },
  replies: [replySchema],
  views: {
    type: Number,
    default: 0
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
threadSchema.index({ category: 1, createdAt: -1 });
threadSchema.index({ author: 1 });
threadSchema.index({ lastActivity: -1 });

// Virtual field
threadSchema.virtual('replyCount').get(function () {
  return this.replies.length;
});

// FINAL FIX: async middleware without next()
threadSchema.pre("save", async function () {
  if (this.isModified("replies")) {
    this.lastActivity = Date.now();
  }
});

module.exports = mongoose.model("Thread", threadSchema);
