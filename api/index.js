const postRouter = require("./routes/post.route.js");

// const commentRouter = require("./routes/comment.route.js");


const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors(
  {
    origin: ["https://my-react-app-sandy-six.vercel.app"],
    // origin: ["http://localhost:5173"],

    methods: ["POST", "GET"],
    credentials: true
  }
));

// mongoose.connect("mongodb://localhost:27017/posts");
mongoose.connect("mongodb+srv://mydb:Cyclops1@myreactapp.yyq6azh.mongodb.net/");


app.listen(3000, () => {
  console.log('Server is running on port 3000!');
});


app.use('/api/user', postRouter);


