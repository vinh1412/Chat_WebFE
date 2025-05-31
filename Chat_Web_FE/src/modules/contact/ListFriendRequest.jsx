import React, {useEffect, useMemo, useRef} from "react";
import "../../assets/css/ListFriendRequest.css";
import useFriend from "../../hooks/useFriend";
import Loading from "../../components/common/Loading";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useDashboardContext } from "../../context/Dashboard_context";
import { useQueryClient } from "@tanstack/react-query";

const FriendRequests = () => {
  const queryClient = useQueryClient();

  const { currentUser } = useDashboardContext();
  const { sentRequests, isLoadingSent, receivedRequests, isLoadingRecive, acceptRequest, isLoadingAccepting, recallRequest, rejectRequest,  } = useFriend();

  const loading = useMemo(() => isLoadingSent || isLoadingRecive || isLoadingAccepting, [isLoadingSent, isLoadingRecive, isLoadingAccepting]);

  const sentReqs = useMemo(() => {
      if(isLoadingSent) return [];
      return sentRequests?.response || []; 
  }, [isLoadingSent, sentRequests]);

  const reciveReqs = useMemo(() => {
      if(isLoadingRecive) return [];
      return receivedRequests?.response || []; 
  }, [isLoadingRecive, receivedRequests]);

  // const client = useRef(null);
  // useEffect(() => {
  //   // Khởi tạo tạo kết nối WebSocket
  //   const socket = new SockJS("http://localhost:8080/ws"); 
  //     // Tạo một instance của Client từ @stomp/stompjs, để giao tiếp với server qua WebSocket.
  //     client.current = new Client({
  //       webSocketFactory: () => socket, // Sử dụng SockJS để tạo kết nối WebSocket
  //       reconnectDelay: 5000, // Thời gian chờ để kết nối lại sau khi mất kết nối
  //       debug: (str) => {
  //         console.log(str);
  //       },
  //       onConnect: () => {
  //         // Hàm được gọi khi kết nối thành công
  //         console.log("Connected to WebSocket");
  //         client.current.subscribe(`/friend/request/${currentUser?.id}`,
  //               (message) => {
  //                 if (message.body) {
  //                   const data = JSON.parse(message.body);
  //                   console.log("Nhận được tin nhắn từ WebSocket:", data);

  //                   // Cập nhật danh sách bạn bè trong cache
  //                   queryClient.setQueryData(['receivedRequests'], (oldData) => {
  //                     if (!oldData.response) return oldData;

  //                     // Kiểm tra xem request đã tồn tại trong danh sách hay chưa
  //                     const existingRequest = oldData.response.find(request => request.requestId === data.requestId);
  //                     if (existingRequest) {
  //                       return oldData;
  //                     }

  //                     return {...oldData, response: [...oldData.response, data] };
  //                   });
  //                 }
  //               }
  //         );
  //       },
  //       onStompError: (frame) => {
  //         // Hàm được gọi khi có lỗi trong giao thức STOMP
  //         console.error("Broker reported error: " + frame.headers["message"]);
  //               console.error("Additional details: " + frame.body);
  //       },
  //     });
        
  //     client.current.activate(); // Kích hoạt kết nối WebSocket, bắt đầu quá trình kết nối tới server.
        
  //     return () => {
  //       if (client.current && client.current.connected) {
  //         client.current.deactivate(); // Ngắt kết nối WebSocket nếu client đang ở trạng thái kết nối.
  //       }
  //     };
  // }, [client, currentUser?.id, queryClient]);  


  return (
    <div className="request-container">
      <h2 className="title">Lời mời kết bạn</h2>

      {/* --- Lời mời đã nhận --- */}
      <div className="section">
        <h4 className="section-title">
          Lời mời đã nhận ({reciveReqs.length})
        </h4>
        <div className="request">
          {reciveReqs.map((request, index) => (
            <div className="request-card" key={index}>
              <img src={request.avatar} alt="Avatar" className="avatar" />
              <div className="card-info">
                <div className="name-row">
                  <span className="name">{request.displayName}</span>
                  <div className="chat-icon" title="Nhắn tin">
                    💬
                  </div>
                </div>
                <span className="time">{request.time}</span>
                <div className="message-box">Xin chào mình là {request.displayName}. Kết bạn với mình nhé</div>
                <div className="action-buttons">
                  <button className="btn btn-decline" onClick={() => rejectRequest(request.requestId)}>Từ chối</button>
                  <button className="btn btn-accept" onClick={() => acceptRequest(request.requestId)}>Đồng ý</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Lời mời đã gửi --- */}
      <div className="section">
        <h4 className="section-title">Lời mời đã gửi ({sentReqs.length})</h4>
        <div className="sent-list">
          {sentReqs.map((request, index) => (
            <div className="sent-card" key={index}>
              <div className="sent-left">
                <img src={request.avatar} alt="Avatar" className="avatar" />
                <div className="sent-info">
                  <div className="name-row">
                    <span className="name">{request.displayName}</span>
                    <div className="chat-icon" title="Nhắn tin">
                      💬
                    </div>
                  </div>
                  <span className="time">Bạn đã gửi lời mời</span>
                  <button className="btn btn-cancel" onClick={() => recallRequest(request.requestId)}>Thu hồi lời mời</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Loading loading={loading} /> {/* Loading component to show loading state */}
    </div>
  );
};

export default FriendRequests;
