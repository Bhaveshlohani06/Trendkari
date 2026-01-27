import { useEffect } from "react";
import { socket } from "../utils/socket";
import { useAuth } from "./AuthContext";

const SocketProvider = ({ children }) => {
  const { auth } = useAuth(); // { token, user }

  useEffect(() => {
    if (auth?.token) {
      socket.auth = { token: auth.token };
      socket.connect();

      console.log("🔌 Socket connecting...");
    } else {
      socket.disconnect();
    }

    return () => {
      socket.disconnect();
    };
  }, [auth?.token]);

  return children;
};

export default SocketProvider;
