const CommentModel = require("../model/CommentModel.js");
const PostModel = require("../model/PostModel.js");
const UserModel = require("../model/UserModel.js");

const testComment = (req, res) => {
  res.json({
    message: "Api comment route is working!",
  });
};

const insertDataComment = async (req, res, next) => {
  const { content, post_id, userId } = req.body;
  const newComment = new CommentModel({
    content,
    postId: post_id,
    commentBy: userId,
  });
  try {
    await newComment.save();
    // res.status(201).json("Comment created successfully!");
    res.status(201).json({
      message: "Comment created successfully!",
      comment: newComment,
      commBy: userId,
    });
  } catch (error) {
    next(error);
  }
};

const getCommentsByPostId = async (post_id) => {
  try {
    const allData = await CommentModel.find({ postId: post_id })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "commentBy",
        model: UserModel,
        select: "firstName lastName profilePhoto",
      })
      .populate({
        path: "comments.replyBy",
        model: UserModel,
        select: "firstName lastName profilePhoto",
      });

    return allData;
  } catch (error) {
    throw error;
  }
};

const getDataByPostId = async (req, res, next) => {
  const post_id = req.params.post_id;
  try {
    const commentData = await getCommentsByPostId(post_id);
    res.status(200).json(commentData);
  } catch (error) {
    if (error.message === "Post not found") {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

const replyComment = async (req, res, next) => {
  try {
    // Extract data from request body
    const { text, userId } = req.body;

    // Generate a new comment object
    const newComment = {
      text: text,
      created: new Date(),
      replyBy: userId,
    };

    // Find the document by ID and update the comments array
    const commentReply = await CommentModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: { comments: newComment },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      commentReply,
    });
  } catch (error) {
    next(error);
  }
};

const getReplyCommentData = async (req, res, next) => {
  try {
    const commentId = req.params.commentId;

    const comment = await CommentModel.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    const replyComments = comment.comments.map((comment) => ({
      userId: comment.replyBy,
      text: comment.text,
      created: comment.created,
    }));

    const flattenedReplyComments = replyComments.flat();

    const uniqueUserIds = [
      ...new Set(flattenedReplyComments.map((comment) => comment.userId)),
    ];

    const usersWhoReplied = await UserModel.find({
      _id: { $in: uniqueUserIds },
    }).select("firstName lastName profilePhoto");

    const replyData = flattenedReplyComments.map((comment) => {
      const user = usersWhoReplied.find((user) =>
        user._id.equals(comment.userId)
      );
      return {
        user,
        text: comment.text,
        created: comment.created,
      };
    });

    res.status(200).json({ replyData });
  } catch (error) {
    console.error("Error fetching replied users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addLikeComment = async (req, res, next) => {
  try {
    const comment = await CommentModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { commlikes: req.body.userId },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      comment,
    });
  } catch (error) {
    next(error);
  }
};

const removeLikeComment = async (req, res, next) => {
  try {
    const comment = await CommentModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { commlikes: req.body.userId },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      comment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  testComment,
  insertDataComment,
  getCommentsByPostId,
  getDataByPostId,
  replyComment,
  getReplyCommentData,
  addLikeComment,
  removeLikeComment,
};
