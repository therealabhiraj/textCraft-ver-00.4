const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  image: {
    type: String, // Store Base64 encoded image
    required: true
  },
  prompt: {
    type: String,
    required: true
  }
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
