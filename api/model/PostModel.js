const mongoose = require("mongoose");
// const { ObjectId } = mongoose.Schema;

// const SequenceSchema = new mongoose.Schema({
//   _id: { type: String, required: true },
//   sequence_value: { type: Number, default: 1 },
// });

// const SequenceModel = mongoose.model("sequences", SequenceSchema);

// async function getNextSequenceValue(sequenceName) {
//   const sequenceDocument = await SequenceModel.findByIdAndUpdate(
//     sequenceName,
//     { $inc: { sequence_value: 1 } },
//     { new: true, upsert: true }
//   );

//   return sequenceDocument.sequence_value;
// }

// PostSchema.pre("save", async function (next) {
//   if (!this.post_id) {
//     this.post_id = await getNextSequenceValue("post_id");
//   }
//   next();
// });

const PostSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    image: {
      url: String,
      public_id: String,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  },
  { timestamps: true }
);

const PostModel = mongoose.model("posts", PostSchema);

module.exports = PostModel;
