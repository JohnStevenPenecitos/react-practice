const express = require("express");
// const insertData = require('../controllers/post.controller.js');

const { test, insertData, getPostData } = require("../controllers/post.controller.js");

const router = express.Router();

router.get("/test", test);

router.post("/datainsert", insertData);

router.get("/dataget", getPostData);


module.exports = router;
