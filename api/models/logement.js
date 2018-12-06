const mongoose = require("mongoose");

const logementSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  price: { type: Number, required: true },
  logementImage: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, required: false }
});

module.exports = mongoose.model("Logement", logementSchema);
