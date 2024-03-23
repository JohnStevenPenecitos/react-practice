const express = require("express");
// const insertData = require('../controllers/post.controller.js');

const {
  test,
  insertData,
  getPostData,
  // getPostDataById,
  updatePostName,
  getUserInfoByPostId,
  addLike,
  getPostLikeData,
  removeLike,
} = require("../controllers/post.controller.js");

const {
  testComment,
  insertDataComment,
  getDataByPostId,
  replyComment,
  getReplyCommentData,
  removeLikeComment,
  addLikeComment,
} = require("../controllers/comment.controller.js");

const {
  userSignUp,
  loginUser,
  logout,
  searchUser,
} = require("../controllers/user.controller.js");

const {
  initialSendMessageTo,
  sendMessageTo,
  markMessageAsSeen,
} = require("../controllers/message.controller.js");
const {
  getAllConversations,
} = require("../controllers/conversation.controller.js");

const router = express.Router();

//Testing Routes
router.get("/test-comment", testComment);

router.get("/test", test);

//User Routes
router.post("/signup", userSignUp);

router.post("/login-user", loginUser);

router.post("/logout", logout);

//Post Routes
router.post("/datainsert", insertData);

router.get("/dataget", getPostData);

router.put("/dataupdate/:postId", updatePostName);

router.get("/:postId", getUserInfoByPostId);

router.put("/addlike/:id", addLike);

router.put("/removelike/:id", removeLike);

router.get("/likes/:postId", getPostLikeData);

//Comment Routes
router.post("/insert-comment", insertDataComment);

router.get("/comment/:post_id", getDataByPostId);

router.put("/reply-comment/:id", replyComment);

router.get("/comment-replies/:commentId", getReplyCommentData);

router.put("/addlike-comment/:id", addLikeComment);

router.put("/removelike-comment/:id", removeLikeComment);

//Messages Routes
router.post("/search-user", searchUser);

router.post("/send-initial-message", initialSendMessageTo);

router.post("/conversations", getAllConversations);

router.post("/send-message", sendMessageTo);

router.put("/message-seen/:id", markMessageAsSeen);

module.exports = router;
