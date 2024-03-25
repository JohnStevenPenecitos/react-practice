const postRouter = require("./routes/post.route.js");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const http = require("http");
const path = require("path");
const socketIo = require("socket.io");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
dotenv.config();

const PORT = process.env.PORT || 3001;

// const __dirname = path.resolve();

app.use(express.json()); // to parse the incoming requests with JSON payloads (from req.body)
app.use(cookieParser());
app.use(
  cors({
    // origin: ["https://my-react-app-sandy-six.vercel.app"],
    origin: ["http://192.168.100.63:5173"],
    // origin: ["http://localhost:5173"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);

// app.use(express.static(path.join(__dirname, "/client/dist")));

app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    // origin: "http://localhost:5173", // Replace with your client's origin 
    origin: "http://192.168.100.63:5173", // Replace with your client's origin
    methods: ["GET", "POST"],
  },
});

// app.use(express.static(path.join(__dirname, "/client/dist")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
// });

// mongoose.connect("mongodb://localhost:27017/posts", {});

// mongoose.connect("mongodb://localhost:27017/posts");
mongoose.connect(process.env.MONGO_DB_URI_LOCAL);

// let lastDataUpdateTime = Date.now();

const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId && userId !== "undefined") {
    userSocketMap[userId] = { _id: userId, socketId: socket.id };
  }

  // Emit online users to all clients
  const onlineUsers = Object.values(userSocketMap).filter((user) => user._id);
  io.emit("getOnlineUsers", onlineUsers);

  console.log(userId);

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
    console.log("Received new like post:", data);

    io.emit("broadcastLike", data);
  });

  socket.on("newLike1", (data) => {
    console.log("Received new like specific post:", data);

    io.emit("broadcastLike1", data);
  });

  socket.on("removeLike", (data) => {
    console.log("Received remove like post:", data);

    io.emit("broadcastRemoveLike", data);
  });

  socket.on("removeLike1", (data) => {
    console.log("Received remove like specific post:", data);

    io.emit("broadcastRemoveLike1", data);
  });

  socket.on("commentReply", (data) => {
    console.log("Received comment reply:", data);

    io.emit("broadcastReply", data);
  });

  socket.on("newLikeComment", (data) => {
    console.log("Received add like comment:", data);

    io.emit("broadcastLikeComment", data);
  });

  socket.on("removeLikeComment", (data) => {
    console.log("Received remove like comment:", data);

    io.emit("broadcastRemoveLikeComment", data);
  });

  socket.on("initialMessage", (data) => {
    console.log("Received initial message:", data);

    io.emit("broadcastInitialMessage", data);
  });

  socket.on("newMessage", (data) => {
    console.log("Received new message:", data);

    io.emit("broadcastMessage", data);
  });

  socket.on("seenMessage", () => {
    io.emit("broadcastSeenMessage");
  });

  // Clean up the interval when the socket disconnects
  socket.on("disconnect", () => {
    if (userId in userSocketMap) {
      delete userSocketMap[userId]; // Remove the user from the userSocketMap
      io.emit("getOnlineUsers", onlineUsers);
    }

    console.log("Client disconnected:", socket.id);

    console.log("Client disconnected user:", userId);
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
