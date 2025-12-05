const mongoose = require("mongoose");

const coacheSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  reason: { type: String, required: true },
  skills: { type: String, required: true },
  team: { type: String, required: true },
  hoursPerWeek: { type: Number, required: true },
  availability: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Coache", coacheSchema);