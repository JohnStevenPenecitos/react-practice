const postRouter = require("./routes/post.route.js");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const http = require("http");
const { Server } = require("socket.io");

app.use(express.json());
app.use(
  cors({
    origin: ["https://my-react-app-sandy-six.vercel.app"],
    // origin: ["http://localhost:5173"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);

// const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: {
//     origin: "http://localhost:5173", // Replace with your client's origin
//     methods: ["GET", "POST"],
//   },
// });

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://my-react-app-sandy-six.vercel.app",
    // origin: "http://localhost:5173",

    methods: ["GET", "POST"],
    credentials: true,
  },
});
// const io = socketIo(server);

// io.on("connection", (socket) => {
//   console.log("Client connected");

//   // Listen for changes in the database and emit a message to connected clients
//   const postChangeStream = Post.watch();
//   postChangeStream.on("change", (change) => {
//     console.log("Change in the database:", change);
//     io.emit("postUpdated", { message: "A new post was added or updated." });
//   });

//   socket.on("disconnect", () => {
//     console.log("Client disconnected");
//   });
// });

// mongoose.connect("mongodb://localhost:27017/posts", {});

// mongoose.connect("mongodb://localhost:27017/posts");
mongoose.connect("mongodb+srv://mydb:Cyclops1@myreactapp.yyq6azh.mongodb.net/");

// app.listen(3000, () => {
//   console.log("Server is running on port 3000!");
// });

// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   // Emit the "dataChanged" event every 5 seconds (adjust the interval as needed)
//   const dataChangedInterval = setInterval(() => {
//     io.emit("dataChanged");
//   }, 5000);

//   socket.on("newPost", (data) => {
//     console.log("Received new post:", data);

//     // Broadcast the new post to all connected clients
//     io.emit("broadcastNewPost", data);
//   });

//   // Clean up the interval when the socket disconnects
//   socket.on("disconnect", () => {
//     clearInterval(dataChangedInterval);
//   });
// });

let lastDataUpdateTime = Date.now();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Emit the "dataChanged" event only when there are actual changes
  const emitDataChanged = () => {
    const currentTime = Date.now();

    // Simulate some condition that triggers a change (e.g., every 10 seconds)
    if (currentTime - lastDataUpdateTime > 10000) {
      lastDataUpdateTime = currentTime;

      // Emit the "dataChanged" event to all connected clients
      io.emit("dataChanged");
    }
  };

  // Set up an interval to check for changes and emit the event
  const dataChangedInterval = setInterval(() => {
    emitDataChanged();
  }, 5000); // 5 seconds in milliseconds

  socket.on("newPost", (data) => {
    console.log("Received new post:", data);

    // Broadcast the new post to all connected clients
    io.emit("broadcastNewPost", data);

    // Trigger an immediate check for changes and emit the event if needed
    emitDataChanged();
  });

  // Clean up the interval when the socket disconnects
  socket.on("disconnect", () => {
    clearInterval(dataChangedInterval);
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000!");
});

// server.listen(port, () => {
//   console.log(` Server running on port ${port}`);
// });

app.use("/api/user", postRouter);

module.exports = io;
