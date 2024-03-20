const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    seenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      created: { type: Date, default: Date.now },
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const MessageModel = mongoose.model("messages", MessageSchema);

module.exports = MessageModel;
