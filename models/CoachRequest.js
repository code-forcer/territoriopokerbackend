// models/CoachRequest.js
const mongoose = require("mongoose");

const coachRequestSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  coach: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Coache", 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  requesterName: {
    type: String,
    required: true
  },
  requesterEmail: {
    type: String,
    required: true
  },
  requesterPhone: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("CoachRequest", coachRequestSchema);