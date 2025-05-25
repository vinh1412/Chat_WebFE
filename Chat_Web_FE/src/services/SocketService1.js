import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { toast } from "react-toastify";

let stompClientInstance = null;

export const connectWebSocket = async (userId, onMessageReceived) => {
  if (stompClientInstance && stompClientInstance.connected) {
    console.log("Reusing existing WebSocket connection");
    return stompClientInstance;
  }

  const SOCKET_URL = import.meta.env.VITE_WS_URL || "http://localhost:8080/ws";
  const socket = new SockJS(SOCKET_URL);
  stompClientInstance = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    debug: (str) => {
      console.log("WebSocket Debug:", str);
    },
  });

  const token = localStorage.getItem("jwtToken");
  if (token) {
    stompClientInstance.connectHeaders = { Authorization: `Bearer ${token}` };
  }

  stompClientInstance.onConnect = (frame) => {
    console.log("Connected to WebSocket:", frame);
    stompClientInstance.subscribe(`/user/${userId}/call`, (message) => {
      const data = JSON.parse(message.body);
      console.log("Received message for user:", userId, ":", data);
      onMessageReceived(data);
    });
  };

  stompClientInstance.onStompError = (frame) => {
    console.error("STOMP Error:", frame);
    // Notify user about connection issue
    toast.error("Mất kết nối WebSocket. Đang thử kết nối lại...", {
      position: "top-center",
      autoClose: 3000,
    });
  };

  stompClientInstance.onWebSocketClose = () => {
    console.log("WebSocket closed. Attempting to reconnect...");
    toast.warn("Kết nối WebSocket bị đóng. Đang thử kết nối lại...", {
      position: "top-center",
      autoClose: 3000,
    });
  };

  stompClientInstance.activate();

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Không thể kết nối WebSocket sau 5 giây"));
    }, 5000);

    stompClientInstance.onConnect = (frame) => {
      clearTimeout(timeout);
      console.log("WebSocket connected:", frame);
      resolve(stompClientInstance);
    };

    stompClientInstance.onStompError = (frame) => {
      clearTimeout(timeout);
      console.error("WebSocket connection error:", frame);
      reject(new Error("Lỗi kết nối WebSocket: " + frame));
    };
  });
};

export const disconnectWebSocket = () => {
  if (stompClientInstance && stompClientInstance.connected) {
    stompClientInstance.deactivate();
    console.log("WebSocket disconnected");
    stompClientInstance = null;
  }
};

export const getStompClient = () => stompClientInstance;