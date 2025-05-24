import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export const connectWebSocket = async (userId, onMessageReceived) => {
  const SOCKET_URL = import.meta.env.VITE_WS_URL || "http://localhost:8080/ws";
  const socket = new SockJS(`${SOCKET_URL}`); // Sử dụng SockJS để tạo kết nối WebSocket
  const stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  stompClient.onConnect = (frame) => {
    console.log("Connected to WebSocket:", frame);
    stompClient.subscribe(`/user/${userId}/call`, (message) => {
      const data = JSON.parse(message.body);
      console.log("Received message for user-------", userId, ":", data);
      onMessageReceived(data);
    });
  };

  stompClient.onStompError = (frame) => {
    console.error("STOMP Error:", frame);
  };

  stompClient.onDisconnect = () => {
    console.log("Disconnected from WebSocket");
  };

  // Thêm token xác thực nếu backend yêu cầu
  const token = localStorage.getItem("jwtToken"); // Lấy token từ localStorage
  if (token) {
    stompClient.connectHeaders = { Authorization: `Bearer ${token}` };
  }

  stompClient.activate();

  // Đợi kết nối thành công
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Không thể kết nối WebSocket sau 5 giây"));
    }, 5000);

    stompClient.onConnect = (frame) => {
      clearTimeout(timeout);
      console.log("WebSocket connected:", frame);
      resolve(stompClient);
    };

    stompClient.onStompError = (frame) => {
      clearTimeout(timeout);
      console.error("WebSocket connection error:", frame);
      reject(new Error("Lỗi kết nối WebSocket: " + frame));
    };
  });
};

export const disconnectWebSocket = (stompClient) => {
  if (stompClient && stompClient.connected) {
    stompClient.deactivate();
    console.log("WebSocket disconnected");
  }
};
