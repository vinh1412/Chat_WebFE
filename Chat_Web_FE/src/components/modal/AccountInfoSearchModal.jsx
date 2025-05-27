import React from "react";
import { Button } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";

const AccountInfoSearchModal = ({ show, handleClose, user }) => {
  if (!show) return null;

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
              >
                Kết bạn
              </Button>
              <Button
                variant="primary"
                className="w-100 py-2 fw-bold"
                style={{ fontSize: "16px" }}
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
              <strong>Giới tính:</strong> {user?.gender || "Chưa cập nhật"}
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
