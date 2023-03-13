const mongoose = require("mongoose");

const JobSchema = mongoose.Schema({
  language: {
    type: String,
    required: true,
    enum: ["cpp", "py", "js"],
  },
  filePath: {
    type: String,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  startedAt: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "success", "error"],
  },
  output: {
    type: String,
  },
});

const Job = mongoose.model("job", JobSchema);
module.exports = Job;
