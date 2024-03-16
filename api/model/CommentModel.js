const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      require: true,
    },
    commentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts",
    },
    commlikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    comments: [
      {
        text: String,
        created: { type: Date, default: Date.now },
        replyBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
      },
    ],
  },
  { timestamps: true }
);

const CommentModel = mongoose.model("comments", CommentSchema);

module.exports = CommentModel;
