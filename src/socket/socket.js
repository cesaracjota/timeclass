import { io } from "socket.io-client";

const baseURL = import.meta.env.VITE_SOCKET_URL;

const socket = io(baseURL, {
    withCredentials: true,
    transports: ["websocket"],
});

export default socket;