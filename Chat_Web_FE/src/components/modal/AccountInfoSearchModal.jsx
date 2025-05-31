import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch } from "react-redux";
import {
  setSelectedConversation,
  setShowConversation,
} from "../../redux/slice/commonSlice";
import useConversation from "../../hooks/useConversation";
import { useDashboardContext } from "../../context/Dashboard_context";
import { checkFriend } from "../../services/FriendService";
import useFriend from "../../hooks/useFriend";

const AccountInfoSearchModal = ({ show, handleClose, user }) => {
  const dispatch = useDispatch();
  const { currentUser, setShowAddFriendModal } = useDashboardContext();
  const { findOrCreateConversation } = useConversation();
  const [isFriend, setIsFriend] = useState(false);
  const [hasSentRequest, setHasSentRequest] = useState(false);
  const [friendRequestId, setFriendRequestId] = useState(null);
  const { sendRequest, recallRequest, sentRequests } = useFriend();

  useEffect(() => {
    if (show && user?.id) {
      // Kiểm tra trạng thái bạn bè
      const checkFriendStatus = async () => {
        try {
          const response = await checkFriend(user.id);
          setIsFriend(response);
        } catch (error) {
          console.error("Error checking friend status:", error);
        }
      };
      checkFriendStatus();

      // Kiểm tra đã gửi lời mời kết bạn chưa
      if (sentRequests?.response) {
        const existingRequest = sentRequests.response.find(
          (req) => req.userId === user.id
        );

        if (existingRequest) {
          setHasSentRequest(true);
          setFriendRequestId(existingRequest.requestId);
        } else {
          setHasSentRequest(false);
          setFriendRequestId(null);
        }
      }
    }
  }, [show, user?.id, sentRequests]);

  // Hàm xử lý khi người dùng nhấn nút "Nhắn tin"
  const handleSendMessage = () => {
    if (!user || !currentUser) return;

    const senderId = currentUser.id;
    const receiverId = user.id;

    // Tìm hoặc tạo cuộc trò chuyện
    findOrCreateConversation(
      { senderId, receiverId },
      {
        onSuccess: (conversation) => {
          dispatch(setSelectedConversation(conversation));
          dispatch(setShowConversation(true));
          handleClose();
          setShowAddFriendModal(false);
        },
        onError: (err) => {
          console.error("Lỗi khi tạo/tìm cuộc trò chuyện:", err.message);
          alert("Không thể bắt đầu cuộc trò chuyện. Vui lòng thử lại sau.");
        },
      }
    );
  };

  // Hàm xử lý khi người dùng nhấn nút "Kết bạn"
  const handleAddFriend = () => {
    if (!user?.id) return;
    if (hasSentRequest && friendRequestId) {
      // Nếu đã gửi lời mời, hủy lời mời
      recallRequest(friendRequestId);
      setHasSentRequest(false);
    } else {
      // Gửi lời mời kết bạn
      sendRequest(user.id);
      setHasSentRequest(true);
    }
  };

  // Hàm xử lý khi người dùng nhấn nút "Gọi điện"
  const handleCall = () => {
    alert("Chức năng gọi điện đang được phát triển");
  };

  if (!show) return null;

  const buttonText = isFriend
    ? "Gọi điện"
    : hasSentRequest
    ? "Hủy lời mời kết bạn"
    : "Kết bạn";

  return (
    <div
      className="custom-modal-overlay"
      onClick={handleClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        zIndex: 1050,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="custom-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          width: "30%",
          maxWidth: "500px",
          maxHeight: "90vh",
          overflowY: "auto",
          paddingBottom: "20px",
        }}
      >
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
          <h5 className="mb-0">Thông tin tài khoản</h5>
          <button
            onClick={handleClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "20px",
              color: "#000",
            }}
          >
            <AiOutlineClose />
          </button>
        </div>

        {/* Body */}
        <div>
          {/* Cover Image */}
          <div
            style={{
              height: "140px",
              backgroundImage: `url(${user?.avatar})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
            }}
          >
            {/* Avatar */}
            <img
              src={user?.avatar}
              alt="avatar"
              className="rounded-circle border border-3"
              style={{
                width: "90px",
                height: "90px",
                objectFit: "cover",
                position: "absolute",
                bottom: "-45px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "white",
              }}
            />
          </div>

          <div className="text-center mt-5 pt-2">
            <h5 className="d-inline-block me-1">{user?.display_name}</h5>

            {/* Buttons */}
            <div className="d-flex flex-column align-items-center gap-2 mt-3 px-3">
              <Button
                variant="light"
                className="w-100 py-2 fw-bold border"
                style={{ fontSize: "16px" }}
                onClick={isFriend ? handleCall : handleAddFriend}
              >
                {buttonText}
              </Button>
              <Button
                variant="primary"
                className="w-100 py-2 fw-bold"
                style={{ fontSize: "16px" }}
                onClick={handleSendMessage}
              >
                Nhắn tin
              </Button>
            </div>
          </div>

          {/* Personal Info */}
          <div className="mt-4 px-3">
            <h6 className="mb-2">Thông tin cá nhân</h6>
            <p className="mb-1">
              <strong>Bio:</strong>{" "}
              {user?.bio ||
                "“Đường còn dài, tuổi còn trẻ\nThứ gì chưa có, tương lai sẽ có… cố lên”"}
            </p>
            <p className="mb-1">
              <strong>Giới tính:</strong>{" "}
              {user?.gender === "MALE"
                ? "Nam"
                : user?.gender === "FEMALE"
                ? "Nữ"
                : "Chưa cập nhật"}
            </p>
            <p className="mb-0">
              <strong>Ngày sinh:</strong> {user?.dob || "Chưa cập nhật"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountInfoSearchModal;
