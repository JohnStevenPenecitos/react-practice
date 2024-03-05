const express = require("express");
// const insertData = require('../controllers/post.controller.js');

const {
  test,
  insertData,
  getPostData,
  getPostDataById,
  updatePostName,
} = require("../controllers/post.controller.js");

const {
  testComment,
  insertDataComment,
  getCommentsByPostId,
} = require("../controllers/comment.controller.js");

const router = express.Router();

router.get("/test-comment", testComment);

router.post("/insert-comment", insertDataComment);

router.get("/test", test);

router.post("/datainsert", insertData);

router.get("/dataget", getPostData);

router.put("/dataupdate/:postId", updatePostName);


// router.get("/:postId", async (req, res, next) => {
//   const postId = req.params.postId;

//   try {
//     const postData = await getPostDataById(postId);
//     const commentData = await getCommentsByPostId(post_id);

//     res.status(200).json(postData);
//     res.status(200).json(commentData);

//   } catch (error) {
//     if (error.message === "Post not found") {
//       return res.status(404).json({ message: error.message });
//     }
//     next(error);
//   }
// });

// router.get("/:postId", async (req, res, next) => {
//   const postId = req.params.postId;

//   const post_id = req.params.post_id;

//   try {
//     const postData = await getPostDataById(postId);
//     const commentData = await getCommentsByPostId(post_id);

//     res.status(200).json({ postData, commentData });
//   } catch (error) {
//     if (error.message === "Post not found") {
//       return res.status(404).json({ message: error.message });
//     }
//     next(error);
//   }
// });

router.get("/:postId", async (req, res, next) => {
  const postId = req.params.postId;

  try {
    const postData = await getPostDataById(postId);
    res.status(200).json(postData);
  } catch (error) {
    if (error.message === "Post not found") {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
});

router.get("/comment/:post_id", async (req, res, next) => {
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
});

module.exports = router;
