const CommentModel = require("../model/CommentModel.js");

const testComment = (req, res) => {
  res.json({
    message: "Api comment route is working!",
  });
};

const insertDataComment = async (req, res, next) => {
  const { content, post_id } = req.body;
  const newComment = new CommentModel({ content, post_id });
  try {
    await newComment.save();
    res.status(201).json("Comment created successfully!");
  } catch (error) {
    next(error);
  }
};

const getCommentsByPostId = async (post_id) => {
  try {
    const comments = await CommentModel.find({ post_id: post_id }).sort({
      comment_id: -1,
    });
    return comments;
  } catch (error) {
    throw error;
  }
};

module.exports = { testComment, insertDataComment, getCommentsByPostId };
