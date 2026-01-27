// import { io } from "socket.io-client";

// export const socket = io(import.meta.env.VITE_SOCKET_URL, {
//   autoConnect: false,
// });


import { io } from "socket.io-client";

const BACKEND_URL =
  import.meta.env.VITE_PRO_BASE_URL || "http://localhost:8080";

export const socket = io(BACKEND_URL, {
  transports: ["websocket"],
  autoConnect: false,
});
