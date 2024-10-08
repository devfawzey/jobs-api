const mongoose = require("mongoose")

const JobSchema = new mongoose.Schema({
 company: {
  type: String,
  required: [true, 'company must be provided'],
  maxLength: 50
 },
 position: {
  type: String,
  required: [true, 'position must be provided'],
  maxLength: 100
 },
 status: {
  type: String,
  enum: ["interview", 'declined', 'pending'],
  default: "pending"
 },
 createdBy: {
  type: mongoose.Types.ObjectId,
  ref: 'User',
  required: [true, 'user must be provided']
 }
}, { timestamps: true })

module.exports = mongoose.model("Job", JobSchema)