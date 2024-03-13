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

// const getCommentsByPostId = async (post_id) => {
//   try {
//     const comments = await CommentModel.find({ postId: post_id }).sort({
//       comment_id: -1,
//     });
//     return comments;
//   } catch (error) {
//     throw error;
//   }
// };

// const getCommentsByPostId = async (req, res, next) => {
//   try {
//     const allData = await CommentModel.find({ postId: post_id })
//       .populate({
//         path: "commentBy",
//         model: UserModel,
//         select: "firstName lastName profilePhoto",
//       })
//       .sort({
//         createdAt: -1,
//       });

//     res.status(200).json(allData);
//   } catch (error) {
//     next(error);
//   }
// };

// const getCommentsByPostId = async (post_id) => {
//   try {
//     ;
//     const allData = await CommentModel.find({ postId: post_id })
//       .sort({
//         createdAt: -1,
//       });

//     res.status(200).json(allData);
//   } catch (error) {
//     next(error);
//   }
// };

// const getDataByPostId = async (req, res, next) => {
//   const post_id = req.params.post_id;
//   try {
//     const commentData = await getCommentsByPostId(post_id);
//     UserId
//     .populate({
//               path: "commentBy",
//               model: UserModel,
//               select: "firstName lastName profilePhoto",
//             })
//     res.status(200).json(commentData);
//   } catch (error) {
//     if (error.message === "Post not found") {
//       return res.status(404).json({ message: error.message });
//     }
//     next(error);
//   }
// };

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


module.exports = {
  testComment,
  insertDataComment,
  getCommentsByPostId,
  getDataByPostId,
};
