import io from "socket.io-client";

const socket = io("http://localhost:3005", {
  autoConnect: false,
  reconnectionAttempts: 3,
});

socket.on("connect_error", (err) => {
  console.warn("[socket] connect error:", err.message);
});

export default socket;
