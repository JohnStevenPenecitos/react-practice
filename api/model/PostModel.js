const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  name: {
    type: String,
  },
});

// Define the model
const PostModel = mongoose.model("posts", PostSchema);

// Export the model
module.exports = PostModel;

