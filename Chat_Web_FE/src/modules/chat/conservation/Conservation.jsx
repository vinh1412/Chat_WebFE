import React, { useState, useMemo, useEffect, useRef } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import useMessage from "../../../hooks/useMessage";
import { useDashboardContext } from "../../../context/Dashboard_context";
import formatTime from "../../../utils/FormatTime";
import "../../../assets/css/ConservationStyle.css";
import ConversationDetail from "./ConservationDetail";
import { useSelector } from "react-redux";

import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { toast } from "react-toastify";
import MessageActionsDropdown from "../../message/MessageActionsDropdown";

const Conservation = ({
  onShowDetail,
  onHideDetail,
  showDetail,
  selectedConversation,
}) => {
  // tự động scroll xuống cuối khi có tin nhắn mới
  const bottomRef = React.useRef(null);

  // lấy danh sách tin nhắn theo conversationId
  const {
    messages,
    isLoadingAllMessages,
    recallMessage,
    deleteForUserMessage,
  } = useMessage(selectedConversation.id);

  const messagesMemo = useMemo(() => {
    if (!messages) return [];
    return messages;
  }, [messages]);

  // Lấy currentUser từ context
  const { currentUser } = useDashboardContext();

  const [newMessage, setNewMessage] = useState("");
  const [localMessages, setLocalMessages] = useState([]); // State để lưu trữ tin nhắn
  const [hoveredMessageId, setHoveredMessageId] = useState(null); // Track which message is being hovered
  const [showActionsFor, setShowActionsFor] = useState(null); // Track which message actions are visible

  // Ref để lưu trữ các phần tử tin nhắn và kích thước của chúng
  const messageRefs = useRef({});

  useEffect(() => {
    if (messagesMemo.response) {
      // Lọc các tin nhắn để không hiển thị những tin nhắn đã bị xóa cho người dùng hiện tại
      const filteredMessages = messagesMemo.response.filter((msg) => {
        // Nếu deletedByUserIds tồn tại và chứa ID của người dùng hiện tại, không hiển thị tin nhắn này

        return !(
          msg.deletedByUserIds && msg.deletedByUserIds.includes(currentUser.id)
        );
      });

      // tự động sort tin nhắn hiển thị tin nhắn nằm ở duới cùng
      const result = filteredMessages.sort((a, b) => {
        return new Date(a.timestamp) - new Date(b.timestamp);
      });

      setLocalMessages(result); // Cập nhật localMessages từ messagesMemo
    }
  }, [messagesMemo.response, currentUser.id]);

  // Tự động cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [localMessages]);

  // connect websocket
  const client = React.useRef(null);

  useEffect(() => {
    // Khởi tạo tạo kết nối WebSocket
    const socket = new SockJS("http://localhost:8080/ws"); // Thay thế bằng URL WebSocket của bạn
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
          `/chat/message/single/${selectedConversation.id}`, //Đăng ký vào một kênh (topic) cụ thể,
          // để nhận tin nhắn từ server liên quan đến cuộc trò chuyện này
          (message) => {
            const newMessage = JSON.parse(message.body); // Chuyển đổi tin nhắn từ JSON string sang object
            console.log("Raw WebSocket message:", message.body);
            console.log("Parsed message:", newMessage);
            console.log("Message ID:", newMessage.id || newMessage._id);
            console.log("Is recalled:", newMessage.recalled);

            if (
              newMessage.deletedByUserIds &&
              newMessage.deletedByUserIds.length > 0
            ) {
              // Chỉ xử lý nếu người dùng hiện tại có trong danh sách deletedByUserIds
              if (newMessage.deletedByUserIds.includes(currentUser.id)) {
                console.log(
                  "Removing deleted message from state:",
                  newMessage.id
                );
                setLocalMessages((prevMessages) =>
                  prevMessages.filter(
                    (msg) =>
                      String(msg.id || msg._id) !==
                      String(newMessage.id || newMessage._id)
                  )
                );
              }
              return;
            }

            // Kiểm tra nếu là tin nhắn đã thu hồi
            if (newMessage.recalled === true) {
              console.log("Received a recalled message:", newMessage);

              // In ra ID tin nhắn cần thu hồi
              const recalledMsgId = String(newMessage.id || newMessage._id);
              // Cập nhật tin nhắn trong state để hiển thị là đã thu hồi
              setLocalMessages((prevMessages) => {
                console.log(
                  "Current message IDs:",
                  prevMessages.map((m) => String(m.id || m._id))
                );
                return prevMessages.map((msg) => {
                  const msgId = String(msg.id || msg._id);
                  // Nếu tìm thấy tin nhắn cần thu hồi
                  if (msgId === recalledMsgId) {
                    console.log("Found message to recall:", msg);
                    return { ...msg, recalled: true }; // Cập nhật thuộc tính recalled: true cho tin nhắn đó, giữ nguyên các thuộc tính khác
                  }
                  return msg; // Trả về mảng mới để cập nhật state
                });
              });
            } else {
              // Kiểm tra xem tin nhắn đã tồn tại trong localMessages chưa
              const messageId = newMessage.id || newMessage._id;
              const isDeletedForCurrentUser =
                newMessage.deletedByUserIds &&
                newMessage.deletedByUserIds.includes(currentUser.id);

              // Kiểm tra xem tin nhắn này đã tồn tại trong state chưa
              const existingMessageIndex = localMessages.findIndex(
                (msg) => String(msg.id || msg._id) === messageId
              );
              if (existingMessageIndex !== -1) {
                // Tin nhắn đã tồn tại trong state - cần cập nhật hoặc xóa
                if (isDeletedForCurrentUser) {
                  // Tin nhắn đã bị xóa cho người dùng hiện tại - xóa khỏi state
                  console.log(
                    "Removing deleted message from state:",
                    messageId
                  );
                  setLocalMessages((prevMessages) =>
                    prevMessages.filter(
                      (msg) => String(msg.id || msg._id) !== messageId
                    )
                  );
                } else {
                  // Cập nhật tin nhắn với thuộc tính mới
                  console.log("Updating existing message:", messageId);
                  setLocalMessages((prevMessages) => {
                    const updatedMessages = [...prevMessages];
                    updatedMessages[existingMessageIndex] = {
                      ...updatedMessages[existingMessageIndex],
                      ...newMessage,
                    };
                    return updatedMessages;
                  });
                }
              } else {
                // Đây là tin nhắn mới
                if (!isDeletedForCurrentUser) {
                  console.log("Adding new message to local state:", newMessage);
                  setLocalMessages((prev) => [...prev, newMessage]);
                } else {
                  console.log(
                    "Message was deleted for user, not adding to local state:",
                    messageId
                  );
                }
              }
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
  }, [selectedConversation.id]);

  // Handlers for message reactions/actions
  const handleReaction = (messageId, reaction) => {
    console.log(`Reaction ${reaction} on message ${messageId}`);
    // Implement reaction logic here
    toast.success(`Đã thêm biểu cảm: ${reaction}`, {
      position: "top-center",
      autoClose: 1000,
    });
  };

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    toast.info("Đã sao chép tin nhắn", {
      position: "top-center",
      autoClose: 1000,
    });
  };

  const handleForwardMessage = (message) => {
    console.log("Forwarding message:", message);
    // Implement forward logic here
    toast.info("Tính năng chuyển tiếp đang được phát triển", {
      position: "top-center",
      autoClose: 1000,
    });
  };

  const handleOpenAddModel = (messageId) => {
    console.log("Deleting message:", messageId);
    // Implement delete logic here
    toast.info("Tính năng xóa tin nhắn đang được phát triển", {
      position: "top-center",
      autoClose: 1000,
    });
  };

  // Toggle message actions visibility
  const toggleMessageActions = (messageId) => {
    if (showActionsFor === messageId) {
      setShowActionsFor(null); // Hide if already showing
    } else {
      setShowActionsFor(messageId); // Show for this message
    }
  };

  // Hàm gửi tin nhắn
  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !selectedConversation.id) {
      alert("Vui lòng chọn cuộc trò chuyện và nhập tin nhắn");
      return;
    }

    try {
      const request = {
        conversationId: selectedConversation.id,
        senderId: currentUser.id,
        content: newMessage,
        messageType: "TEXT",
      };

      if (!client.current || !client.current.connected) {
        toast.error("WebSocket không kết nối. Vui lòng thử lại sau.", {
          position: "top-center",
          autoClose: 3000,
        });
        return;
      }

      // Gửi tin nhắn qua WebSocket
      client.current.publish({
        destination: "/app/chat/send",
        body: JSON.stringify(request),
      });

      setNewMessage("");
    } catch (error) {
      console.error("Conservation send message error:", error.message);
      alert("Gửi tin nhắn thất bại: " + error.message);
    }
  };

  // Hàm gửi hình ảnh
  const handleSendImage = (file) => {
    const newMsg = {
      id: Date.now(),
      type: "image",
      content: URL.createObjectURL(file),
      sender: "me",
      timestamp: new Date(),
      fileName: file.name,
    };
    setLocalMessages((prev) => [...prev, newMsg]);
    // Gọi API gửi hình ảnh tại đây (chưa triển khai)
  };

  // Hàm gửi tệp đính kèm
  const handleSendFile = (file) => {
    const newMsg = {
      id: Date.now(),
      type: "file",
      content: URL.createObjectURL(file),
      sender: "me",
      timestamp: new Date(),
      fileName: file.name,
    };
    setLocalMessages((prev) => [...prev, newMsg]);
    // Gọi API gửi file tại đây (chưa triển khai)
  };

  // Hàm thu hồi tin nhắn
  const handleRecallMessage = async ({
    messageId,
    senderId,
    conversationId,
  }) => {
    try {
      console.log("Recalling message:", messageId, senderId, conversationId);

      // Nếu đang sử dụng WebSocket và kết nối đang hoạt động
      if (client.current && client.current.connected) {
        // Đảm bảo messageId đang được dùng là đúng
        const messageToRecall = localMessages.find(
          (msg) =>
            String(msg.id) === String(messageId) ||
            String(msg._id) === String(messageId)
        );

        // Kiểm tra xem tin nhắn có tồn tại trong localMessages không, nếu không thì không thu hồi được, thông báo lỗi
        if (!messageToRecall) {
          console.error("Could not find message with ID:", messageId);
          toast.error("Không thể tìm thấy tin nhắn để thu hồi", {
            position: "top-center",
            autoClose: 2000,
          });
          return false;
        }

        console.log("Message to recall:", messageToRecall);
        // Gửi yêu cầu thu hồi qua WebSocket, Server sẽ xử lý yêu cầu này và gửi thông báo thu hồi tới tất cả client trong cuộc trò chuyện
        client.current.publish({
          destination: "/app/chat/recall",
          body: JSON.stringify({
            messageId: messageId,
            senderId: senderId,
            conversationId: conversationId,
          }),
        });

        return true;
      } else {
        // Fallback nếu WebSocket không hoạt động
        await recallMessage({ messageId, senderId, conversationId });
        return true;
      }
    } catch (error) {
      console.error("Error recalling message:", error);
      toast.error(
        "Không thể thu hồi tin nhắn: " + (error.message || "Đã xảy ra lỗi"),
        {
          position: "top-center",
          autoClose: 2000,
        }
      );
      return false;
    }
  };

  const handleDeleteForUser = async ({ messageId, userId }) => {
    try {
      // Nếu WebSocket đang kết nối, gửi yêu cầu xóa qua WebSocket
      if (client.current && client.current.connected) {
        client.current.publish({
          destination: "/app/chat/delete-for-user",
          body: JSON.stringify({
            messageId: messageId,
            userId: userId,
          }),
        });

        // Cập nhật UI ngay lập tức cho người dùng hiện tại
        setLocalMessages((prevMessages) =>
          prevMessages.filter(
            (msg) => String(msg.id || msg._id) !== String(messageId)
          )
        );
        return true;
      } else {
        // Fallback - gọi API nếu WebSocket không hoạt động
        await deleteForUserMessage({ messageId, userId });

        // Cập nhật UI
        setLocalMessages((prevMessages) =>
          prevMessages.filter(
            (msg) => String(msg.id || msg._id) !== String(messageId)
          )
        );
        return true;
      }
    } catch (error) {
      console.error("Error deleting message for user:", error);
      toast.error(
        "Không thể xóa tin nhắn: " + (error.message || "Đã xảy ra lỗi"),
        {
          position: "top-center",
          autoClose: 2000,
        }
      );
      return false;
    }
  };

  // Handle click outside to close message actions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showActionsFor &&
        !event.target.closest(".message-container") &&
        !event.target.closest(".message-actions")
      ) {
        setShowActionsFor(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showActionsFor]);

  // Function to find sender info
  const getSenderInfo = (msg) => {
    const isSentByMe = msg.sender === "me" || msg.senderId === currentUser.id;

    if (isSentByMe) {
      return { avatar: currentUser.avatar, name: currentUser.display_name };
    } else {
      if (!selectedConversation.is_group) {
        // In 1-on-1 chat, the other person is the sender
        const otherMember = selectedConversation.members.find(
          (member) => member.id !== currentUser.id
        );
        return {
          avatar: otherMember?.avatar,
          name: otherMember?.display_name || "User",
        };
      } else {
        // In group chat, find the specific sender
        const sender = selectedConversation.members.find(
          (member) => member.id === msg.senderId
        );
        return {
          avatar: sender?.avatar,
          name: sender?.display_name || "Unknown User",
        };
      }
    }
  };

  return (
    <div
      className="card shadow-sm h-100"
      style={{
        width: "100%",
        transition: "width 0.3s ease-in-out",
        height: "100vh",
      }}
    >
      {/* Header */}
      <div className="card-header d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <img
            src={
              !selectedConversation.is_group
                ? selectedConversation.members.find(
                    (member) => member.id !== currentUser.id
                  ).avatar
                : selectedConversation.avatar
            }
            alt="avatar"
            width={50}
            height={50}
            className="rounded-circle me-3"
          />
          <div className="flex-grow-1">
            <h6 className="mb-0">
              {!selectedConversation.is_group
                ? selectedConversation.members.find(
                    (member) => member.id !== currentUser.id
                  ).display_name
                : selectedConversation.name}
            </h6>
            <small className="text-muted">Người lạ · Không có nhóm chung</small>
          </div>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-sm">
            <i className="bi bi-search"></i>
          </button>
          <button
            className="btn btn-sm"
            onClick={showDetail ? onHideDetail : onShowDetail}
          >
            <i
              className={`bi ${
                showDetail ? "bi bi-arrow-bar-right" : "bi bi-arrow-bar-left"
              } me-2`}
            ></i>
          </button>
        </div>
      </div>

      {/* Notification */}
      <div className="card-body d-flex align-items-center justify-content-between">
        <div>
          <i className="bi bi-person-plus-fill mx-2"></i>
          <span>Gửi yêu cầu kết bạn tới người này</span>
        </div>
        <button className="btn btn-outline-secondary btn-sm">
          Gửi kết bạn
        </button>
      </div>

      {/* Chat Messages */}
      <div
        className="card-body bg-light"
        style={{
          height: "calc(100vh - 230px)",
          overflowY: "auto",
          padding: "10px",
        }}
      >
        {isLoadingAllMessages ? (
          <p className="text-muted text-center">Đang tải tin nhắn...</p>
        ) : localMessages.length === 0 ? (
          <p className="text-muted text-center">Chưa có tin nhắn...</p>
        ) : (
          localMessages.map((msg, index) => {
            const messageId = msg.id || msg._id || `temp-${index}`;
            const isSentByMe =
              msg.sender === "me" || msg.senderId === currentUser.id;
            const isRecalled = msg.recalled === true;
            const senderInfo = getSenderInfo(msg);

            return (
              <div
                key={messageId}
                className={`mb-2 d-flex position-relative message-container ${
                  isSentByMe ? "justify-content-end" : "justify-content-start"
                }`}
                onMouseEnter={() => setHoveredMessageId(messageId)}
                onMouseLeave={() => setHoveredMessageId(null)}
              >
                {/* Show avatar for messages from other users */}
                {!isSentByMe && (
                  <div className="me-2 d-flex flex-column align-items-center justify-content-center">
                    <img
                      src={senderInfo.avatar}
                      alt={senderInfo.name}
                      className="rounded-circle"
                      width={45}
                      height={45}
                      style={{ objectFit: "cover" }}
                    />
                    {selectedConversation.is_group && (
                      <small
                        className="text-muted mt-1"
                        style={{ fontSize: "0.7rem" }}
                      >
                        {senderInfo.name?.split(" ").pop() || "User"}
                      </small>
                    )}
                  </div>
                )}
                <div
                  className={`p-2 rounded shadow-sm message-bubble ${
                    isSentByMe
                      ? "text-black message-sent"
                      : "bg-light border message-received"
                  } ${isRecalled ? "message-recalled" : ""}`}
                  style={{
                    maxWidth: "70%",
                    backgroundColor: isSentByMe
                      ? isRecalled
                        ? "#f0f0f0"
                        : "#dcf8c6"
                      : "#ffffff",
                    position: "relative",
                    opacity: isRecalled ? 0.7 : 1,
                  }}
                  ref={(el) => (messageRefs.current[msg.id] = el)}
                  onClick={() => toggleMessageActions(msg.id)}
                >
                  {isRecalled ? (
                    <span className="text-muted">
                      <i className="bi bi-arrow-counterclockwise me-1"></i>
                      Tin nhắn đã bị thu hồi
                    </span>
                  ) : msg.type === "image" ? (
                    <button
                      className="btn p-0 border-0 bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering toggleMessageActions
                        window.open(msg.content, "_blank");
                      }}
                    >
                      <img
                        src={msg.content}
                        alt="Hình ảnh"
                        className="img-fluid rounded"
                        style={{
                          maxWidth: "300px",
                          maxHeight: "300px",
                          objectFit: "contain",
                        }}
                      />
                    </button>
                  ) : msg.type === "file" ? (
                    <a
                      href={msg.content}
                      download={msg.fileName}
                      className="text-decoration-none text-black"
                      onClick={(e) => e.stopPropagation()} // Prevent triggering toggleMessageActions
                    >
                      📎 {msg.fileName}
                    </a>
                  ) : (
                    <span>{msg.content || msg.text}</span>
                  )}
                  <div>
                    <small className="text-muted d-block">
                      {formatTime(msg.created_at || msg.timestamp)}
                    </small>
                  </div>
                </div>

                {/* Show message actions on hover OR when clicked */}
                {(hoveredMessageId === messageId ||
                  showActionsFor === messageId) && (
                  <div
                    className="message-actions"
                    style={{
                      position: "absolute",
                      top: "15px",
                      right: isSentByMe
                        ? `${messageRefs.current[msg.id]?.offsetWidth + 20}px`
                        : "auto",
                      left: !isSentByMe
                        ? `${messageRefs.current[msg.id]?.offsetWidth + 70}px`
                        : "auto",
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      borderRadius: "20px",
                      padding: "5px 10px",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                      display: "flex",
                      gap: "12px",
                      zIndex: 100,
                    }}
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on actions
                  >
                    <i
                      className="bi bi-chat-quote action-icon"
                      onClick={() => handleReaction(msg.id, "smile")}
                      style={{ cursor: "pointer", color: "#666" }}
                      title="Trả lời"
                    ></i>
                    {isSentByMe ? (
                      <i
                        className="bi bi-reply action-icon"
                        onClick={() => handleForwardMessage(msg)}
                        style={{ cursor: "pointer", color: "#666" }}
                        title="Chuyển tiếp"
                      ></i>
                    ) : (
                      <i
                        className="bi bi-reply action-icon"
                        onClick={() => handleForwardMessage(msg)}
                        style={{
                          cursor: "pointer",
                          color: "#666",
                          transform: "scaleX(-1)",
                        }}
                        title="Chuyển tiếp"
                      ></i>
                    )}
                    {/* <i
                      className="bi bi-three-dots action-icon"
                      onClick={() => handleOpenAddModel(msg.id)}
                      style={{ cursor: "pointer", color: "#666" }}
                      title="Thêm"
                    ></i> */}
                    <MessageActionsDropdown
                      messageId={messageId}
                      senderId={msg.senderId}
                      conversationId={selectedConversation.id}
                      onRecallMessage={handleRecallMessage}
                      onDeleteForUser={handleDeleteForUser}
                      currentUserId={currentUser.id}
                      isRecalled={isRecalled}
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={bottomRef} /> {/* Để tự động cuộn xuống cuối */}
      </div>

      {/* Input Section */}
      <div className="card-footer">
        {/* Icons Above Input */}
        <div className="d-flex align-items-center gap-2 mb-2">
          <button className="btn btn-light">
            <i className="bi bi-emoji-smile"></i>
          </button>
          <label className="btn btn-light mb-0" htmlFor="image-upload">
            <i className="bi bi-image"></i>
          </label>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) handleSendImage(file);
            }}
          />
          <label className="btn btn-light mb-0" htmlFor="file-upload">
            <i className="bi bi-paperclip"></i>
          </label>
          <input
            type="file"
            id="file-upload"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) handleSendFile(file);
            }}
          />
          <button className="btn btn-light">
            <i className="bi bi-hash"></i>
          </button>
          <button
            className="btn btn-light"
            onClick={() => alert("Tính năng ghi âm đang được phát triển...")}
          >
            <i className="bi bi-mic"></i>
          </button>
          <button className="btn btn-light">
            <i className="bi bi-lightning"></i>
          </button>
          <button className="btn btn-light">
            <i className="bi bi-three-dots"></i>
          </button>
        </div>

        {/* Input + Gửi */}
        <div className="d-flex align-items-center gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Nhập tin nhắn..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
          />
          <button
            className="btn btn-light d-flex align-items-center"
            onClick={handleSendMessage}
          >
            <i
              className={`bi ${
                newMessage.trim()
                  ? "bi-send-fill text-primary"
                  : "bi-emoji-smile"
              }`}
            ></i>
          </button>
          <button className="btn btn-light d-flex align-items-center">
            <i className="bi bi-hand-thumbs-up"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [showDetail, setShowDetail] = useState(false);
  const [conversationWidth, setConversationWidth] = useState("100%");

  // Lấy selectedConversationId từ Redux
  const selectedConversation = useSelector(
    (state) => state.common.selectedConversation
  );

  const handleShowDetail = () => {
    setShowDetail(true);
    setConversationWidth("70%");
  };

  const handleHideDetail = () => {
    setShowDetail(false);
    setConversationWidth("100%");
  };

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      <div
        style={{
          width: conversationWidth,
          transition: "width 0.3s",
          height: "100vh",
        }}
      >
        <Conservation
          onShowDetail={handleShowDetail}
          onHideDetail={handleHideDetail}
          showDetail={showDetail}
          selectedConversation={selectedConversation}
        />
      </div>
      {showDetail && (
        <div
          style={{
            width: "30%",
            marginLeft: "10px",
            height: "100vh",
          }}
        >
          <ConversationDetail conversationInfor={selectedConversation} />
        </div>
      )}
    </div>
  );
};

export default App;
