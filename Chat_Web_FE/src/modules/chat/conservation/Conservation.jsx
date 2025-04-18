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
import ForwardMessageModal from "../../../components/modal/ForwardMessageModal";
import { forwardMessageService } from "../../../services/MessageService";


const Conservation = ({
  onShowDetail,
  onHideDetail,
  showDetail,
  selectedConversation,
}) => {
  const bottomRef = React.useRef(null);
  const { messages, isLoadingAllMessages, recallMessage } = useMessage(
    selectedConversation.id
  );

  const messagesMemo = useMemo(() => {
    if (!messages) return [];
    return messages;
  }, [messages]);

  const { currentUser } = useDashboardContext();

  const [newMessage, setNewMessage] = useState("");
  const [localMessages, setLocalMessages] = useState([]);
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [showActionsFor, setShowActionsFor] = useState(null);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedReceivers, setSelectedReceivers] = useState([]);

  const messageRefs = useRef({});

  useEffect(() => {
    if (messagesMemo.response) {
      const result = messagesMemo.response.sort((a, b) => {
        return new Date(a.timestamp) - new Date(b.timestamp);
      });
      setLocalMessages(result);
    }
  }, [messagesMemo.response]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [localMessages]);

  const client = React.useRef(null);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    client.current = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
      onConnect: () => {
        console.log("Connected to WebSocket");
  
        client.current.subscribe(
          `/chat/message/single/${selectedConversation.id}`,
          (message) => {
            const newMessage = JSON.parse(message.body);
            const recalledMsgId = String(newMessage.id || newMessage._id);
  
            setLocalMessages((prev) => {
              const exists = prev.some(
                (msg) => String(msg.id || msg._id) === recalledMsgId
              );
  
              // Tin nhắn đã bị thu hồi
              if (newMessage.recalled === true) {
                return prev.map((msg) =>
                  String(msg.id || msg._id) === recalledMsgId
                    ? { ...msg, recalled: true }
                    : msg
                );
              }
  
              // Nếu đã có rồi thì bỏ qua
              if (exists) return prev;
  
              return [...prev, newMessage];
            });
          }
        );
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
      },
    });
  
    client.current.activate();
  
    return () => {
      if (client.current && client.current.connected) {
        client.current.deactivate();
      }
    };
  }, [selectedConversation.id]);  

  const handleSelectReceiver = async (receiver) => {
    try {
      await forwardMessageService({
        messageId: selectedMessage.id,
        senderId: currentUser.id,
        receiverId: receiver.id,
        content: messages || selectedMessage.content, // dùng lại nội dung gốc nếu người dùng không nhập gì
      });
      toast.success(`Đã chia sẻ tới ${receiver.name || 'người nhận'}`);
    } catch (error) {
      console.error("Forward message error:", error.message);
      toast.error("Lỗi khi chia sẻ tin nhắn: " + error.message);
    }
  };
  

  const handleReaction = (messageId, reaction) => {
    toast.success(`Đã thêm biểu cảm: ${reaction}`, {
      position: "top-center",
      autoClose: 1000,
    });
  };

  // const handleCopyText = (text) => {
  //   navigator.clipboard.writeText(text);
  //   toast.info("Đã sao chép tin nhắn", {
  //     position: "top-center",
  //     autoClose: 1000,
  //   });
  // };

  const handleForwardMessage = (message) => {
    setSelectedMessage(message);
    setShowForwardModal(true);
  };

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
  };

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
  };

  const handleRecallMessage = async ({
    messageId,
    senderId,
    conversationId,
  }) => {
    try {
      if (client.current && client.current.connected) {
        const messageToRecall = localMessages.find(
          (msg) =>
            String(msg.id) === String(messageId) ||
            String(msg._id) === String(messageId)
        );

        if (!messageToRecall) {
          console.error("Could not find message with ID:", messageId);
          toast.error("Không thể tìm thấy tin nhắn để thu hồi", {
            position: "top-center",
            autoClose: 2000,
          });
          return false;
        }

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

  return (
    <div
      className="card shadow-sm h-100"
      style={{
        width: "100%",
        transition: "width 0.3s ease-in-out",
        height: "100vh",
      }}
    >
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
              className={`bi ${showDetail ? "bi-arrow-bar-right" : "bi-arrow-bar-left"
                } me-2`}
            ></i>
          </button>
        </div>
      </div>

      <div className="card-body d-flex align-items-center justify-content-between">
        <div>
          <i className="bi bi-person-plus-fill mx-2"></i>
          <span>Gửi yêu cầu kết bạn tới người này</span>
        </div>
        <button className="btn btn-outline-secondary btn-sm">
          Gửi kết bạn
        </button>
      </div>

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

            return (
              <div
                key={messageId}
                className={`mb-2 d-flex position-relative message-container ${isSentByMe ? "justify-content-end" : "justify-content-start"
                  }`}
                onMouseEnter={() => setHoveredMessageId(messageId)}
                onMouseLeave={() => setHoveredMessageId(null)}
              >
                <div
                  className={`p-2 rounded shadow-sm message-bubble ${isSentByMe
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
                        e.stopPropagation();
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
                      onClick={(e) => e.stopPropagation()}
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

                {(hoveredMessageId === messageId ||
                  showActionsFor === messageId) && (
                    <div
                      className="message-actions"
                      style={{
                        position: "absolute",
                        top: "15px",
                        right: isSentByMe
                          ? `${messageRefs.current[msg.id]?.offsetWidth + 10}px`
                          : "auto",
                        left: !isSentByMe
                          ? `${messageRefs.current[msg.id]?.offsetWidth + 10}px`
                          : "auto",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        borderRadius: "20px",
                        padding: "5px 10px",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                        display: "flex",
                        gap: "12px",
                        zIndex: 100,
                      }}
                      onClick={(e) => e.stopPropagation()}
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
                      <MessageActionsDropdown
                        messageId={messageId}
                        senderId={msg.senderId}
                        conversationId={selectedConversation.id}
                        onRecallMessage={handleRecallMessage}
                        currentUserId={currentUser.id}
                        isRecalled={isRecalled}
                      />
                    </div>
                  )}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="card-footer">
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
              className={`bi ${newMessage.trim()
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

      <ForwardMessageModal
        showForwardModal={showForwardModal}
        setShowForwardModal={setShowForwardModal}
        selectedMessage={selectedMessage}
        currentUser={currentUser}
        handleSelectReceiver={handleSelectReceiver}
        selectedReceivers={selectedReceivers}
        setSelectedReceivers={setSelectedReceivers}
      />
    </div>
  );
};

const App = () => {
  const [showDetail, setShowDetail] = useState(false);
  const [conversationWidth, setConversationWidth] = useState("100%");

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