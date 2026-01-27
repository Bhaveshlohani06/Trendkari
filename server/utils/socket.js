// import { Server } from "socket.io";

// let io;

// export const initSocket = (httpServer) => {
//   io = new Server(httpServer, {
//     cors: {
//       origin: "*",
//       credentials: true,
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log("🔌 Socket connected:", socket.id);

//     // User personal room
//     socket.on("join-user", (userId) => {
//         if (!userId) return;
//       socket.join(`user:${userId}`);
//     });

//     // Post room (live likes/comments)
//     socket.on("join-post", (postId) => {
//       socket.join(`post:${postId}`);
//     });

//     socket.on("disconnect", () => {
//       console.log("❌ Socket disconnected:", socket.id);
//     });
//   });

//   return io;
// };

// export const getIO = () => {
//   if (!io) {
//     throw new Error("Socket.io not initialized");
//   }
//   return io;
// };
// export default io;


import { Server } from "socket.io";
import jwt from "jsonwebtoken";

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://www.trendkari.in",
        "https://trendkari.in",
      ],
      credentials: true,
    },
  });

  // 🔐 AUTH MIDDLEWARE
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Unauthorized"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded._id;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.userId);

    // 🎯 PRIVATE USER ROOM
    socket.join(`user:${socket.userId}`);

    // 🔵 JOIN POST ROOM (likes/comments)
    socket.on("join-post", (postId) => {
      if (!postId) return;
      socket.join(`post:${postId}`);
      console.log(`📌 Joined post:${postId}`);
    });

    socket.on("leave-post", (postId) => {
      socket.leave(`post:${postId}`);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.userId);
    });
  });

  return io;
};

export const getIO = () => io;
