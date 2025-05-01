import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

const MessageActionsDropdown = ({
  messageId,
  senderId,
  conversationId,
  onRecallMessage, // Hàm thu hồi tin nhắn được truyền từ cha
  currentUserId,
  isRecalled = false, // Thêm prop mới để kiểm tra tin nhắn đã thu hồi chưa
  onDeleteForUser,
  onPinMessage, // Thêm prop
  onUnpinMessage, // Thêm prop
  isPinned, // Thêm prop

  
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Kiểm tra xem tin nhắn có phải của người dùng hiện tại không
  const isCurrentUserMessage = String(senderId) === String(currentUserId);

  // Xử lý nhấp chuột ra bên ngoài để đóng menu thả xuống
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleAction = (action) => {
    console.log(`Performing action: ${action} on message: ${messageId}`);
    toast.info(`Tính năng "${action}" đang được phát triển`, {
      position: "top-center",
      autoClose: 1000,
    });
    setShowDropdown(false);
  };

  const handleReCallMessageAction = async () => {
    try {
      console.log("Recalling message:", messageId, senderId, conversationId);
      await onRecallMessage({ messageId, senderId, conversationId });
    } catch (error) {
      console.error("Error recalling message:", error);
      toast.error(
        "Không thể thu hồi tin nhắn: " + (error.message || "Đã xảy ra lỗi"),
        {
          position: "top-center",
          autoClose: 2000,
        }
      );
    }
    setShowDropdown(false);
  };

  const handleDeleteForUserAction = async () => {
    try {
      console.log("Deleting message for user:", messageId, senderId);
      await onDeleteForUser({ messageId, userId: currentUserId });
    } catch (error) {
      console.error("Error deleting message for user:", error);
      toast.error(
        "Không thể xóa tin nhắn cho người dùng: " +
          (error.message || "Đã xảy ra lỗi"),
        {
          position: "top-center",
          autoClose: 2000,
        }
      );
    }
    setShowDropdown(false);
  };

  const handlePinMessageAction = async () => {
    try {
      await onPinMessage({ messageId, userId: currentUserId, conversationId });
      toast.success("Đã ghim tin nhắn", {
        position: "top-center",
        autoClose: 1000,
      });
    } catch (error) {
      console.error("Error pinning message:", error);
      toast.error(
        "Không thể ghim tin nhắn: " + (error.message || "Đã xảy ra lỗi"),
        {
          position: "top-center",
          autoClose: 2000,
        }
      );
    }
    setShowDropdown(false);
  };

  const handleUnpinMessageAction = async () => {
    try {
      await onUnpinMessage({ messageId, userId: currentUserId, conversationId });
      toast.success("Đã bỏ ghim tin nhắn", {
        position: "top-center",
        autoClose: 1000,
      });
    } catch (error) {
      console.error("Error unpinning message:", error);
      toast.error(
        "Không thể bỏ ghim tin nhắn: " + (error.message || "Đã xảy ra lỗi"),
        {
          position: "top-center",
          autoClose: 2000,
        }
      );
    }
    setShowDropdown(false);
  };


  return (
    <div
      className="message-actions-container"
      ref={dropdownRef}
      style={{ position: "relative" }}
    >
      <i
        className="bi bi-three-dots action-icon"
        onClick={toggleDropdown}
        style={{ cursor: "pointer", color: "#666" }}
        title="Thêm"
      ></i>

      {showDropdown && (
        <div
          className="actions-dropdown"
          style={{
            position: "absolute",
            right: "0",
            bottom: "100%",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            width: "200px",
            zIndex: 1000,
            overflow: "hidden",
            marginBottom: "8px",
          }}
        >
          <div className="dropdown-content">
            {/* Nếu tin nhắn đã thu hồi, chỉ hiển thị 2 tùy chọn */}
            {isRecalled ? (
              <>
                {/* Chỉ hiển thị "Chọn nhiều tin nhắn" và "Xóa chỉ ở phía tôi" */}
                <div className="action-group">
                  <div
                    className="action-item"
                    onClick={() => handleAction("Chọn nhiều tin nhắn")}
                    style={actionItemStyle}
                  >
                    <i className="bi bi-list-check" style={iconStyle}></i>
                    <span>Chọn nhiều tin nhắn</span>
                  </div>
                </div>

                {/* Divider */}
                <div
                  style={{
                    height: "1px",
                    backgroundColor: "#e0e0e0",
                    margin: "8px 0",
                  }}
                ></div>

                {/* Xóa tin nhắn */}
                <div className="action-group">
                  <div
                    className="action-item"
                    onClick={handleDeleteForUserAction}
                    style={{ ...actionItemStyle, color: "#e74c3c" }}
                  >
                    <i
                      className="bi bi-trash"
                      style={{ ...iconStyle, color: "#e74c3c" }}
                    ></i>
                    <span>Xóa chỉ ở phía tôi</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Nếu tin nhắn chưa thu hồi, hiển thị đầy đủ các tùy chọn */}
                <div className="action-group">
                  <div
                    className="action-item"
                    onClick={() => handleAction("Xem bộ sticker")}
                    style={actionItemStyle}
                  >
                    <i className="bi bi-emoji-smile" style={iconStyle}></i>
                    <span>Xem bộ sticker</span>
                  </div>
                  <div
                    className="action-item"
                    onClick={isPinned ? handleUnpinMessageAction : handlePinMessageAction}
                    style={actionItemStyle}
                  >
                    <i className="bi bi-pin" style={iconStyle}></i>
                    <span>Ghim tin nhắn</span>
                  </div>
                  <div
                    className="action-item"
                    onClick={() => handleAction("Đánh dấu tin nhắn")}
                    style={actionItemStyle}
                  >
                    <i className="bi bi-star" style={iconStyle}></i>
                    <span>Đánh dấu tin nhắn</span>
                  </div>
                  <div
                    className="action-item"
                    onClick={() => handleAction("Chọn nhiều tin nhắn")}
                    style={actionItemStyle}
                  >
                    <i className="bi bi-list-check" style={iconStyle}></i>
                    <span>Chọn nhiều tin nhắn</span>
                  </div>
                  <div
                    className="action-item"
                    onClick={() => handleAction("Xem chi tiết")}
                    style={actionItemStyle}
                  >
                    <i className="bi bi-info-circle" style={iconStyle}></i>
                    <span>Xem chi tiết</span>
                  </div>
                  <div
                    className="action-item"
                    onClick={() => handleAction("Tùy chọn khác")}
                    style={{
                      ...actionItemStyle,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <i className="bi bi-three-dots" style={iconStyle}></i>
                      <span>Tùy chọn khác</span>
                    </div>
                    <i className="bi bi-chevron-right"></i>
                  </div>
                </div>

                {/* Divider */}
                <div
                  style={{
                    height: "1px",
                    backgroundColor: "#e0e0e0",
                    margin: "8px 0",
                  }}
                ></div>

                {/* Red actions */}
                <div className="action-group">
                  {/* Chỉ hiển thị nút Thu hồi nếu tin nhắn là của người dùng hiện tại */}
                  {isCurrentUserMessage && (
                    <div
                      className="action-item"
                      onClick={handleReCallMessageAction}
                      style={{ ...actionItemStyle, color: "#e74c3c" }}
                    >
                      <i
                        className="bi bi-arrow-counterclockwise"
                        style={{ ...iconStyle, color: "#e74c3c" }}
                      ></i>
                      <span>Thu hồi</span>
                    </div>
                  )}
                  <div
                    className="action-item"
                    onClick={handleDeleteForUserAction}
                    style={{ ...actionItemStyle, color: "#e74c3c" }}
                  >
                    <i
                      className="bi bi-trash"
                      style={{ ...iconStyle, color: "#e74c3c" }}
                    ></i>
                    <span>Xóa chỉ ở phía tôi</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const actionItemStyle = {
  padding: "10px 16px",
  cursor: "pointer",
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
  color: "#333",
};

const iconStyle = {
  marginRight: "12px",
  fontSize: "16px",
  width: "20px",
  textAlign: "center",
};

export default MessageActionsDropdown;
