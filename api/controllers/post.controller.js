const PostModel = require("../model/PostModel.js");

const test = (req, res) => {
  res.json({
    message: "Api route is working!",
  });
};

const insertData = async (req, res, next) => {
  const { name } = req.body;

  try {
    // Save the new post
    const newPost = new PostModel({ name });
    await newPost.save();

    // Send the newly created post as a response
    res
      .status(201)
      .json({ message: "Post created successfully!", post: newPost });
  } catch (error) {
    next(error);
  }
};

const getPostData = async (req, res, next) => {
  try {
    const allData = await PostModel.find().sort({
      post_id: -1,
    });
    res.status(200).json(allData);
  } catch (error) {
    next(error);
  }
};

const getPostDataById = async (postId) => {
  try {
    const postData = await PostModel.findOne({ post_id: postId });

    if (!postData) {
      throw new Error("Post not found");
    }

    return postData;
  } catch (error) {
    throw error;
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

module.exports = {
  insertData,
  test,
  getPostData,
  getPostDataById,
  updatePostName,
};
