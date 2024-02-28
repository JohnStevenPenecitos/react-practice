const express = require("express");
// const insertData = require('../controllers/post.controller.js');

const {
  test,
  insertData,
  getPostData,
  getPostDataById,
} = require("../controllers/post.controller.js");


const testComment = require("../controllers/comment.controller.js");

const router = express.Router();

router.get("/test-comment", testComment);

router.get("/test", test);

router.post("/datainsert", insertData);

router.get("/dataget", getPostData);

router.get("/:postId", async (req, res, next) => {
    const postId = req.params.postId;
  
    try {
      const postData = await getPostDataById(postId);
      res.status(200).json(postData);
    } catch (error) {
      if (error.message === 'Post not found') {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  });


// router.get("/:postId", async (req, res, next) => {
//   const postId = req.params.postId;

//   try {
//     const postData = await getPostDataById(postId);
//     res.status(200).json(postData);
//   } catch (error) {
//     if (error.message === "Post not found") {
//       return res.status(404).json({ message: error.message });
//     }
//     next(error);
//   }
// });

module.exports = router;
