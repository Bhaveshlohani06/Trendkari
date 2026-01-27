import { Server } from "socket.io";

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    // User personal room
    socket.on("join-user", (userId) => {
        if (!userId) return;
      socket.join(`user:${userId}`);
    });

    // Post room (live likes/comments)
    socket.on("join-post", (postId) => {
      socket.join(`post:${postId}`);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
export default io;
