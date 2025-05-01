import React, { useState, useRef } from "react";
import ReactModal from "react-modal";
import defaultCover from "../../assets/images/hinh-nen-buon-danbo.jpg";
// import defaultAvatar from "../../assets/images/hinh-nen-buon-danbo.jpg";
import { FaCamera, FaSave, FaEdit, FaTimes } from "react-icons/fa";
import EditInfoModal from "./EditInfoModal";
import { useDashboardContext } from "../../context/Dashboard_context";
import useUser from "../../hooks/useUser";
// import { current } from "@reduxjs/toolkit";
import {
  connectWebSocket,
  disconnectWebSocket,
} from "../../services/SocketService";
import displayPhoneNumber from "../../utils/DisplayPhoneNumber";
import { updateProfile } from "firebase/auth";

const ProfileModal = ({ isOpen, onClose }) => {
  const { currentUser, fetchUser, setCurrentUser } = useDashboardContext();
  const { updateUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef(null);
  // console.log("currentUser", currentUser);
  const [showEditModal, setShowEditModal] = useState(false);

  // connect websocket
  React.useEffect(() => {
    if (currentUser?.id) {
      // function để xử lý khi nhận được tin nhắn từ WebSocket
      const handleMessageReceived = (updatedProfile) => {
        // console.log("Received message:", updatedProfile);
        // Cập nhật lại thông tin người dùng trong state
        setCurrentUser((prevUser) => ({
          ...prevUser,
          ...updatedProfile,
        }));
      };
      const client = connectWebSocket(currentUser?.id, handleMessageReceived); // Kết nối WebSocket với user.id

      return () => {
        disconnectWebSocket(client); // Ngắt kết nối khi component unmount
      };
    }
  }, [currentUser?.id, setCurrentUser]);

  const handleChangeAvatar = () => {
    fileInputRef.current?.click();
  };
  // console.log("Phone", currentUser?.phone);
  // console.log("FormatPhone", displayPhoneNumber(currentUser?.phone));
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsLoading(true);
      updateUser(
        {
          name: currentUser.display_name,
          gender: currentUser.gender,
          birthdate: currentUser.dob,
          avatar: file,
        },
        {
          onSuccess: () => {
            fetchUser(); // Cập nhật lại dữ liệu từ DB

            setIsLoading(false);
          },
          onError: (error) => {
            setIsLoading(false);
            alert(
              "Lỗi cập nhật ảnh đại diện: " +
                (error.response?.data?.message || error.message)
            );
          },
        }
      );
    }
  };

  if (currentUser) {
    return (
      <ReactModal
        isOpen={isOpen}
        onRequestClose={onClose}
        className="border-0 bg-white rounded-4 shadow p-0"
        overlayClassName="position-fixed top-0 start-0 z-50 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
        style={{ content: { inset: "unset" } }}
      >
        <div
          style={{ width: "420px", maxHeight: "90vh", overflowY: "auto" }}
          className="rounded-4"
        >
          {/* Header */}
          <div className="border-bottom px-4 py-3 d-flex justify-content-between align-items-center bg-light rounded-top-4">
            <h5 className="m-0 fw-semibold">Thông tin tài khoản</h5>
            <button
              onClick={onClose}
              className="btn btn-sm btn-outline-secondary rounded-circle"
              style={{ width: "32px", height: "32px" }}
            >
              ✕
            </button>
          </div>

          {/* Cover + Avatar */}
          <div className="position-relative">
            <img
              src={currentUser?.avatar || defaultCover}
              alt="cover"
              className="w-100 rounded-0"
              style={{ height: "160px", objectFit: "cover" }}
            />
            <div
              className="position-absolute"
              style={{
                bottom: "-40px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "90px",
                height: "90px",
              }}
            >
              <img
                src={currentUser?.avatar || defaultCover}
                alt="avatar"
                className="rounded-circle border border-3 border-white shadow w-100 h-100"
                style={{ objectFit: "cover" }}
              />
              {/* Nút đổi ảnh */}
              <button
                onClick={handleChangeAvatar}
                className="position-absolute bottom-0 end-0 translate-middle p-1 bg-white border border-1 rounded-circle shadow"
                style={{ width: "28px", height: "28px", cursor: "pointer" }}
                title="Đổi ảnh"
              >
                <FaCamera
                  className="text-primary"
                  style={{ fontSize: "16px" }}
                />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>
          </div>

          {/* Name & Bio */}
          <div className="text-center mt-5 pt-2 px-4">
            <div>
              <h6 className="fw-bold mb-1 d-inline-block">
                {currentUser?.display_name || "Người dùng"}
              </h6>
              <button
                className="btn btn-sm btn-link p-0 ms-2"
                onClick={() => setShowEditModal(true)}
                title="Chỉnh sửa thông tin"
              >
                <FaEdit className="text-primary" style={{ fontSize: "16px" }} />
              </button>
            </div>
            <p className="text-muted small mb-0">
              "Đường còn dài, tuổi còn trẻ
              <br />
              Thứ gì chưa có, tương lai sẽ có... cố lên"
            </p>
          </div>

          {/* Info */}
          <div className="px-4 pb-4 pt-3">
            <h6 className="text-muted mb-3">Thông tin cá nhân</h6>
            <div>
              <strong>Giới tính:</strong>{" "}
              {currentUser?.gender === "MALE"
                ? "Nam"
                : currentUser?.gender
                ? "Nữ"
                : "Chưa cập nhật"}
            </div>
            <div>
              <strong>Ngày sinh:</strong>{" "}
              {currentUser?.dob
                ? new Date(currentUser.dob).toLocaleDateString("vi-VN")
                : "Chưa cập nhật"}
            </div>
            <div>
              <strong>Điện thoại:</strong>{" "}
              {currentUser?.phone
                ? displayPhoneNumber(currentUser.phone)
                : "Chưa cập nhật"}
            </div>
            <p className="text-muted small mt-2">
              Chỉ bạn bè có lưu số của bạn trong danh bạ mới xem được số này.
            </p>

            <div className="text-center mt-3">
              <button
                className="btn btn-primary w-50 rounded-pill"
                onClick={() => setShowEditModal(true)}
              >
                <FaSave /> Cập nhật
              </button>
            </div>
          </div>
        </div>

        {/* Modal cập nhật thông tin */}
        <EditInfoModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          currentInfo={{
            name: currentUser.display_name,
            gender: currentUser.gender,
            birthdate: currentUser.dob,
          }}
        />
        {isLoading && (
          <div
            className="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-75 d-flex justify-content-center align-items-center rounded-4"
            style={{ zIndex: 10 }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
      </ReactModal>
    );
  }
};

export default ProfileModal;
