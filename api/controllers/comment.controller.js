const CommentModel = require("../model/CommentModel.js");

const testComment = (req, res) => {
  res.json({
    message: "Api comment route is working!",
  });
};

module.exports = testComment;
