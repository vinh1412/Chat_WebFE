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
import { connectWebSocket, disconnectWebSocket, subscribeToSendFriendRequest, subscribeFriendsToAcceptFriendRequest, subscribeFriendsToUnfriend } from "../../services/SocketService";

const LayoutDashboard = () => {
  const queryClient = useQueryClient();
  const { currentUser } = useDashboardContext();
  const client = useRef(null);
  const URL_WEB_SOCKET =
    import.meta.env.VITE_WS_URL || "http://localhost:8080/ws";
  useEffect(() => {
    // Khởi tạo tạo kết nối WebSocket
    connectWebSocket(() => {
      subscribeToSendFriendRequest(currentUser?.id, (message) => {
         if (message) {
              const data = message;
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
      });

      subscribeFriendsToAcceptFriendRequest(currentUser?.id, (message) => {
        if (message) {
              const data = message;
              console.log("Nhận được tin nhắn từ WebSocket accept:", message);

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
      });

      subscribeFriendsToUnfriend(currentUser?.id, (message) => {
        if (message) {
              const data = message;
              console.log("Nhận được tin nhắn từ WebSocket unfriend:", message);

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
      })
    });

    

    return () => {
      disconnectWebSocket();
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
