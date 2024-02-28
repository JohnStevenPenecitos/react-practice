const PostModel = require("../model/PostModel.js");

const test = (req, res) => {
  res.json({
    message: "Api route is working!",
  });
};

const insertData = async (req, res, next) => {
  const { name } = req.body;
  const newPost = new PostModel({ name });
  try {
    await newPost.save();
    res.status(201).json("Post created successfully!");
  } catch (error) {
    next(error);
  }
};

const getPostData = async (req, res, next) => {
  try {
    const allData = await PostModel.find();
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

module.exports = {
  insertData,
  test,
  getPostData,
  getPostDataById,
};
