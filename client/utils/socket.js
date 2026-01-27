// import { io } from "socket.io-client";

// export const socket = io(import.meta.env.VITE_SOCKET_URL, {
//   autoConnect: false,
// });


import { io } from "socket.io-client";

const auth = JSON.parse(localStorage.getItem("auth"));

export const socket = io(import.meta.env.VITE_API_URL, {
  transports: ["websocket"],
  auth: {
    token: auth?.token,
  },
});

if (auth?.user?._id) {
  socket.emit("join", auth.user._id);
}
