const postRouter = require("./routes/post.route.js");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const http = require("http");
// const { Server } = require("socket.io");
const socketIo = require("socket.io");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
dotenv.config();

const PORT = process.env.PORT || 3001;

app.use(express.json()); // to parse the incoming requests with JSON payloads (from req.body)
app.use(cookieParser());
app.use(
  cors({
    // origin: ["https://my-react-app-sandy-six.vercel.app"],
    // origin: ["http://localhost:5173"],
    // methods: ["POST", "GET", "PUT", "DELETE"],
    // credentials: true,
  })
);

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Replace with your client's origin
    methods: ["GET", "POST"],
  },
});

// mongoose.connect("mongodb://localhost:27017/posts", {});

// mongoose.connect("mongodb://localhost:27017/posts");
mongoose.connect(process.env.MONGO_DB_URI_LOCAL);

// let lastDataUpdateTime = Date.now();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Emit the "dataChanged" event only when there are actual changes
  // const emitDataChanged = () => {
  //   const currentTime = Date.now();

  //   // Simulate some condition that triggers a change (e.g., every 10 seconds)
  //   if (currentTime - lastDataUpdateTime > 10000) {
  //     lastDataUpdateTime = currentTime;

  //     // Emit the "dataChanged" event to all connected clients
  //     io.emit("dataChanged");
  //   }
  // };

  // const dataChangedInterval = setInterval(() => {
  //   emitDataChanged();
  // }, 1000); // 5 seconds in milliseconds

  socket.on("newPost", (data) => {
    console.log("Received new post:", data);

    io.emit("broadcastNewPost", data);
  });

  socket.on("newComment", (data) => {
    console.log("Received new comment:", data);

    io.emit("broadcastComment", data);
  });

  socket.on("newLike", (data) => {
    console.log("Received new like:", data);

    io.emit("broadcastLike", data);

    // emitDataChanged();
  });

  socket.on("newLike1", (data) => {
    console.log("Received new like:", data);

    io.emit("broadcastLike1", data);

    // emitDataChanged();
  });

  // Clean up the interval when the socket disconnects
  socket.on("disconnect", () => {
    // clearInterval(dataChangedInterval);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// app.listen(3000, () => {
//   console.log("Server is running on port 3000!");
// });

// server.listen(port, () => {
//   console.log(` Server running on port ${port}`);
// });

app.use("/api/user", postRouter);

// module.exports = io;
