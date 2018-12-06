const mongoose = require("mongoose");

const articleSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  target: { type: String }, //"ISS" ou "CSP"
  title: { type: String },
  content: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});

module.exports = mongoose.model("Article", articleSchema);
