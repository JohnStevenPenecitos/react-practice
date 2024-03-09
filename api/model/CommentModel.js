const mongoose = require("mongoose");

const SequenceSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number, default: 1 },
});

const SequenceModel = mongoose.model("comm_sequences", SequenceSchema);

async function getNextSequenceValue(sequenceName) {
  const sequenceDocument = await SequenceModel.findByIdAndUpdate(
    sequenceName,
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );

  return sequenceDocument.sequence_value;
}

const CommentSchema = new mongoose.Schema(
  {
    comment_id: { type: Number },
    content: { type: String },
    // post: { type: mongoose.Schema.Types.ObjectId, ref: "posts" },
    // post_id: {  type: mongoose.Schema.Types.ObjectId, ref: "posts" }
    post_id: { type: Number }
  },
  { timestamps: true }
);

CommentSchema.pre("save", async function (next) {
  if (!this.comment_id) {
    this.comment_id = await getNextSequenceValue("comment_id");
  }
  next();
});

const CommentModel = mongoose.model("comments", CommentSchema);

module.exports = CommentModel;
