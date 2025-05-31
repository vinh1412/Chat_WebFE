import React, { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

import Modal from "../../components/modal/Modal";
import DashboardSideBar from "../../modules/dashboard/DashboardSideBar";
import DashboardOptionList from "../../modules/dashboard/DashboardOptionList";
import Overlay from "../common/Overlay";
import { useQueryClient } from "@tanstack/react-query";
import { useDashboardContext } from "../../context/Dashboard_context";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { toast as showToast } from "react-toastify";

const LayoutDashboard = () => {
  const queryClient = useQueryClient();
  const { currentUser } = useDashboardContext();
  const client = useRef(null);
  const URL_WEB_SOCKET =
    import.meta.env.VITE_WS_URL || "http://localhost:8080/ws";
  useEffect(() => {
    // Khởi tạo tạo kết nối WebSocket
    const socket = new SockJS(URL_WEB_SOCKET);
    // Tạo một instance của Client từ @stomp/stompjs, để giao tiếp với server qua WebSocket.
    client.current = new Client({
      webSocketFactory: () => socket, // Sử dụng SockJS để tạo kết nối WebSocket
      reconnectDelay: 5000, // Thời gian chờ để kết nối lại sau khi mất kết nối
      debug: (str) => {
        console.log(str);
      },
      onConnect: () => {
        // Hàm được gọi khi kết nối thành công
        console.log("Connected to WebSocket");
        client.current.subscribe(
          `/friend/request/${currentUser?.id}`,
          (message) => {
            if (message.body) {
              const data = JSON.parse(message.body);
              console.log("Nhận được tin nhắn từ WebSocket request:", data);

              // Cập nhật danh sách request trong cache
              queryClient.setQueryData(["receivedRequests"], (oldData) => {
                showToast.success("Bạn nhận được một yêu cầu kết bạn mới!", {
                  position: "top-center",
                  autoClose: 2000,
                });
                if (!Array.isArray(oldData.response)) {
                  return { ...oldData, response: [data] };
                }

                if (Array.isArray(oldData.response)) {
                  // Kiểm tra xem request đã tồn tại trong danh sách hay chưa
                  const existingRequest = oldData.response.find(
                    (request) => request.requestId === data.requestId
                  );
                  if (existingRequest) {
                    return oldData;
                  }
                }
                return { ...oldData, response: [...oldData.response, data] };
              });
            }
          }
        );

        client.current.subscribe(
          `/friend/accept/${currentUser?.id}`,
          (message) => {
            if (message.body) {
              const data = JSON.parse(message.body);
              console.log("Nhận được tin nhắn từ WebSocket:", data);

              // Cập nhật danh sách bạn bè trong cache
              queryClient.setQueryData(["friendList"], (oldData) => {
                if (!oldData.response) return oldData;

                // Kiểm tra xem người dùng đã có trong danh sách bạn bè chưa
                const existingFriend = oldData.response.find(
                  (friend) => friend.userId === data.userId
                );
                if (existingFriend) {
                  return oldData;
                }

                return { ...oldData, response: [...oldData.response, data] };
              });
              queryClient.invalidateQueries(["sentRequests"]); //  cập nhật lại danh sách yêu cầu đã gửi
              queryClient.invalidateQueries(["receivedRequests"]); //  cập nhật lại danh sách yêu cầu đã nhận

              // You can also display some notification if needed
              console.log("Friend request accepted:", data);
            }
          }
        );

        client.current.subscribe(
          `/friend/unfriend/${currentUser?.id}`,
          (message) => {
            if (message.body) {
              const data = JSON.parse(message.body);
              console.log("Nhận được tin nhắn từ WebSocket unfriend:", data);

              // Cập nhật danh sách bạn bè trong cache
              queryClient.setQueryData(["friendList"], (oldData) => {
                if (!oldData.response) return oldData;

                const friends = oldData.response.filter(
                  (friend) => friend.userId !== data.userId
                );
                if (friends.length === oldData.response.length) {
                  return oldData;
                }

                return { ...oldData, response: friends };
              });
            }
          }
        );
      },
      onStompError: (frame) => {
        // Hàm được gọi khi có lỗi trong giao thức STOMP
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
    });

    client.current.activate(); // Kích hoạt kết nối WebSocket, bắt đầu quá trình kết nối tới server.

    return () => {
      if (client.current && client.current.connected) {
        client.current.deactivate(); // Ngắt kết nối WebSocket nếu client đang ở trạng thái kết nối.
      }
    };
  }, [client, currentUser?.id, queryClient]);
  return (
    <>
      <Modal />
      {/* Layout chung */}
      <Container
        fluid
        className="vh-100 min-vh-100 overflow-hidden bg-light p-0"
      >
        <Row className="g-0">
          <Col xs="auto">
            <DashboardSideBar />
          </Col>

          <Col xs="auto">
            {/* Chứa list conservation và list option contact */}
            <DashboardOptionList />
          </Col>

          {/* Hiển thị các element con của layout (vd: DashboardPage) */}
          <Col className="flex-grow-1 vh-100 min-vh-100 overflow-auto">
            <Outlet />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default LayoutDashboard;
