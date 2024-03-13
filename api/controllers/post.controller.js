// const CommentModel = require("../model/CommentModel.js");
const PostModel = require("../model/PostModel.js");
const UserModel = require("../model/UserModel.js");
const {
  getCommentsByPostId,
  // getDataByPostId,
} = require("./comment.controller.js");

const test = (req, res) => {
  res.json({
    message: "Api route is working!",
  });
};

const insertData = async (req, res, next) => {
  const { name, userId } = req.body;
  try {
    const newPost = new PostModel({ name, postedBy: userId });
    await newPost.save();

    res.status(201).json({
      message: "Post created successfully!",
      post: newPost,
      postedBy: userId,
    });
  } catch (error) {
    next(error);
  }
};

// const getPostData = async (req, res, next) => {
//   try {
//     const allData = await PostModel.find()
//       .populate({
//         path: "postedBy",
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

// const getPostData = async (req, res, next) => {
//   try {
//     const allPosts = await PostModel.find()
//       .populate({
//         path: "postedBy",
//         model: UserModel,
//         select: "firstName lastName profilePhoto",
//       })
//       .sort({
//         createdAt: -1,
//       });

//     const postsWithComments = await Promise.all(
//       allPosts.map(async (post) => {
//         const comments = await getCommentsByPostId(post._id);
//         return {
//           ...post.toObject(),
//           comments,
//         };
//       })
//     );

//     res.status(200).json(postsWithComments);
//   } catch (error) {
//     next(error);
//   }
// };

const getPostData = async (req, res, next) => {
  try {
    // Fetch all posts with user information
    const allPosts = await PostModel.find()
      .populate({
        path: "postedBy",
        model: UserModel,
        select: "firstName lastName profilePhoto",
      })
      .sort({
        createdAt: -1,
      });

    // Fetch comments and likes for each post
    const postsWithCommentsAndLikes = await Promise.all(
      allPosts.map(async (post) => {
        const comments = await getCommentsByPostId(post._id);
        const likesData = await getLikesByPostId(post.likes);
        return {
          ...post.toObject(),
          comments,
          likes: likesData,
        };
      })
    );

    res.status(200).json(postsWithCommentsAndLikes);
  } catch (error) {
    next(error);
  }
};

const getPostLikeData = async (req, res, next) => {
  try {
    const postId = req.params.postId;

    // Find the post by postId
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Fetch users who liked the post
    const usersWhoLiked = await UserModel.find({ _id: { $in: post.likes } })
      .select("firstName lastName profilePhoto")
      .exec();

    res.status(200).json({ likes: usersWhoLiked });
  } catch (error) {
    // Handle errors
    console.error("Error fetching liked users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getLikesByPostId = async (likesArray) => {
  try {
    // Fetch users who liked the post
    const usersWhoLiked = await UserModel.find({ _id: { $in: likesArray } })
      .select("firstName lastName profilePhoto")
      .exec();

    if (!usersWhoLiked) {
      throw new Error("Users who liked the post not found");
    }

    return usersWhoLiked;
  } catch (error) {
    throw error;
  }
};

// const getLikesByPostId = async (postId) => {
//   try {
//     const likeData = await PostModel.findOne({ _id: postId }).populate({
//       path: "likes",
//       model: UserModel,
//       select: "firstName lastName profilePhoto",
//     });
//     if (!likeData) {
//       throw new Error("Likes not found");
//     }

//     return likeData.likes; // Assuming you want to return only the likes array
//   } catch (error) {
//     throw error;
//   }
// };

const getPostDataById = async (postId) => {
  const postData = await PostModel.findOne({ _id: postId }).populate({
    path: "postedBy",
    model: UserModel,
    select: "firstName lastName profilePhoto",
  });
  if (!postData) {
    throw new Error("Post not found");
  }

  return postData;
};

const getUserInfoByPostId = async (req, res, next) => {
  try {
    const postId = req.params.postId;

    const userData = await getPostDataById(postId);
    const commentsData = await getCommentsByPostId(postId);
    res.status(200).json({ userData, commentsData });
  } catch (error) {
    if (error.message === "Post not found") {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

const updatePostName = async (req, res) => {
  const { postId } = req.params;
  const { name } = req.body;

  try {
    const updatedPost = await PostModel.findOneAndUpdate(
      { post_id: postId },
      { name },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json({ message: "Name updated successfully", updatedPost });
  } catch (error) {
    console.error("Error updating post name:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addLike = async (req, res, next) => {
  try {
    const post = await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likes: req.body.userId },
      },
      { new: true }
    );
    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .populate("postedBy", "firstName");

    res.status(200).json({
      success: true,
      post,
      posts,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  insertData,
  test,
  getPostData,
  getPostDataById,
  updatePostName,
  getUserInfoByPostId,
  getPostLikeData,
  addLike,
};
