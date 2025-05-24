import React, { useState, useMemo } from "react";
import { Modal, Button, Form, ListGroup, Image } from "react-bootstrap";
import { toast } from "react-toastify";
import useFriend from "../../hooks/useFriend";
import { FaSearch, FaSortAlphaDown, FaCheck } from "react-icons/fa";
import "../../assets/css/ListFriend.css"; // Import CSS to match ListFriend.jsx styling
import { forwardMessageService } from "../../services/MessageService";

const ForwardMessageModal = ({
  showForwardModal,
  setShowForwardModal,
  selectedMessage,
  currentUser,
  handleSelectReceiver,
}) => {
  const [selectedReceivers, setSelectedReceivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [sortBy, setSortBy] = useState("Tên (A-Z)");
  const [sortOpen, setSortOpen] = useState(false);

  // Lấy danh sách bạn bè
  const { friendList, isLoadingFriends } = useFriend();
  const friends = useMemo(() => {
  if (isLoadingFriends || !friendList || !Array.isArray(friendList.response)) return [];
  return friendList.response.filter(
    (friend) => friend?.userId !== currentUser?.id
  );
}, [isLoadingFriends, friendList, currentUser]);


  // console.log("Friends:", friends); // Debugging line to check the friends data
  // Lọc và sắp xếp danh sách bạn bè
  const filteredFriends = friends
    .filter((friend) =>
      friend?.displayName?.toLowerCase().includes(searchTerm?.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "Tên (A-Z)") {
        return a.displayName?.localeCompare(b.displayName);
      } else if (sortBy === "Tên (Z-A)") {
        return b.displayName?.localeCompare(a.displayName);
      }
      return 0;
    });

  //   console.log("Filtered Friends:", filteredFriends); // Debugging line to check the filtered friends data

  // Xử lý chọn người nhận

  const toggleReceiver = (friend) => {
    console.log("Toggling receiver:", friend);
    if (!friend || !friend.userId) {
      console.warn("Invalid friend or friend_id:", friend);
      return;
    }
    setSelectedReceivers((prev) => {
      const newState = prev.includes(friend?.userId)
        ? prev.filter((id) => id !== friend?.userId)
        : [...prev, friend?.userId];
      //   console.log("New Selected Receivers:", newState);
      return newState;
    });
  };

  // Monitor state changes
  React.useEffect(() => {
    console.log("Updated Selected Receivers:", selectedReceivers);
  }, [selectedReceivers]);

  // Xử lý sắp xếp
  const handleSortSelect = (option) => {
    setSortBy(option);
    setSortOpen(false);
  };

  // Xử lý gửi tin nhắn chuyển tiếp
  const handleShare = async () => {
    if (selectedReceivers?.length === 0) {
      toast.error("Vui lòng chọn ít nhất một người để chia sẻ.");
      return;
    }

    const receiverId = selectedReceivers[0]; // Đây là userId bạn đã lưu
    console.log("Content:", selectedMessage);
    console.log("Người gửi:", currentUser);
    console.log("Người nhận:", receiverId);

    const payload = {
      messageId: selectedMessage?.id,
      senderId: currentUser?.id, // Bạn đang truyền currentUser từ props
      receiverId: receiverId,
      content:
        selectedMessage.content +
        (messageContent ? `\n\n${messageContent}` : ""),
    };

    console.log("Payload gửi đi:", payload);
    if (!currentUser || !currentUser.id) {
      toast.error("Người gửi không hợp lệ.");
      return;
    }

    if (!selectedMessage.id || !currentUser.id) {
      toast.error("Tin nhắn hoặc người gửi không hợp lệ.");
      return;
    }
    if (!receiverId) {
      toast.error("Người nhận không hợp lệ.");
      return;
    }
    if (!payload.content) {
      toast.error("Nội dung tin nhắn không hợp lệ.");
      return;
    }
    try {
      const result = await forwardMessageService(payload);
      console.log("Chuyển tiếp thành công:", result);
      toast.success("Đã chia sẻ tin nhắn thành công!");
      setShowForwardModal(false); // đóng modal sau khi gửi
      setSelectedReceivers([]);
      setMessageContent("");
    } catch (error) {
      console.error("Lỗi khi chuyển tiếp tin nhắn:", error.message);
      toast.error("Không thể chia sẻ tin nhắn. Vui lòng thử lại.");
    }
  };
  //   console.log("Danh sách người nhận đã chọn:", selectedReceivers);

  return (
    <Modal
      show={showForwardModal}
      onHide={() => setShowForwardModal(false)}
      centered
      size="lg"
      className="forward-message-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Chia sẻ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Hiển thị nội dung tin nhắn chuyển tiếp */}
        {selectedMessage && (
          <div className="forwarded-message-preview mb-3 p-3 bg-light rounded">
            <strong>Tin nhắn chuyển tiếp:</strong>
            <p className="mb-0">
              {selectedMessage.content ||
                selectedMessage.text ||
                "(Không có nội dung)"}
            </p>
          </div>
        )}

        {/* Thanh tìm kiếm */}
        <div className="search-box mb-3" style={{ position: "relative" }}>
          <FaSearch
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#666",
            }}
          />
          <Form.Control
            type="text"
            placeholder="Tìm bạn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "30px" }}
          />
        </div>

        {/* Sắp xếp */}
        <div
          className="dropdown-container mb-3"
          onMouseLeave={() => setSortOpen(false)}
        >
          <div
            className="sort-box"
            onClick={() => setSortOpen(!sortOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "5px 10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            <FaSortAlphaDown style={{ marginRight: "5px" }} />
            <span>{sortBy}</span>
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              style={{
                width: "20px",
                height: "20px",
                marginLeft: "5px",
              }}
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          {sortOpen && (
            <div
              className="dropdown"
              style={{
                position: "absolute",
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: "4px",
                zIndex: 1000,
              }}
            >
              <div
                className={`dropdown-item ${
                  sortBy === "Tên (A-Z)" ? "selected" : ""
                }`}
                onClick={() => handleSortSelect("Tên (A-Z)")}
                style={{
                  padding: "5px 10px",
                  cursor: "pointer",
                }}
              >
                {sortBy === "Tên (A-Z)" && (
                  <FaCheck style={{ marginRight: "5px" }} />
                )}
                <span>Tên (A-Z)</span>
              </div>
              <div
                className={`dropdown-item ${
                  sortBy === "Tên (Z-A)" ? "selected" : ""
                }`}
                onClick={() => handleSortSelect("Tên (Z-A)")}
                style={{
                  padding: "5px 10px",
                  cursor: "pointer",
                }}
              >
                {sortBy === "Tên (Z-A)" && (
                  <FaCheck style={{ marginRight: "5px" }} />
                )}
                <span>Tên (Z-A)</span>
              </div>
            </div>
          )}
        </div>

        {/* Danh sách bạn bè */}
        <ListGroup
          className="conversation-list"
          style={{ maxHeight: "300px", overflowY: "auto" }}
        >
          {isLoadingFriends ? (
            <p className="text-muted text-center">Đang tải...</p>
          ) : filteredFriends.length === 0 ? (
            <p className="text-muted text-center">Không tìm thấy bạn bè</p>
          ) : (
            filteredFriends.map((friend) => (
              <ListGroup.Item
                key={friend?.userId}
                className="d-flex align-items-center conversation-item"
                onClick={() => toggleReceiver(friend)}
                style={{ cursor: "pointer" }}
              >
                <Form.Check
                  type="checkbox"
                  checked={selectedReceivers.includes(friend?.userId)}
                  onChange={() => toggleReceiver(friend)}
                  className="me-2"
                />
                <Image
                  src={friend.avatar || "/images/avatar/avtdefault.jpg"}
                  roundedCircle
                  width={40}
                  height={40}
                  className="me-3"
                  alt={friend?.displayName || "Không tên"}
                />
                <div className="flex-grow-1">
                  <span>{friend?.displayName || "Không tên"}</span>
                </div>
              </ListGroup.Item>
            ))
          )}
        </ListGroup>

        {/* Nội dung tin nhắn bổ sung */}
        <Form.Group className="mt-3">
          <Form.Label>Chia sẻ tin nhắn</Form.Label>
          <Form.Control
            as="textarea"
            rows="2"
            placeholder="Nhập tin nhắn bổ sung..."
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowForwardModal(false)}>
          Hủy
        </Button>
        <Button variant="primary" onClick={handleShare}>
          Chia sẻ
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ForwardMessageModal;
