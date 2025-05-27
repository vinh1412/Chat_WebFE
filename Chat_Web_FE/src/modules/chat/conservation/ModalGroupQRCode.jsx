import React from "react";
import QRCode from "react-qr-code";

const GroupQRCodeModal = ({ show, onClose, groupName, groupLink, groupId }) => {
  if (!show) return null;

  const groupInfo = {
    name: groupName || "Nhóm chưa có tên",
    id: groupId || "unknown",
    description: "Nhóm chưa có thông tin mô tả.",
    avatarUrl: "",
  };

  const joinLink = groupLink || `${window.location.origin}/join-group/${groupInfo.id}`;

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1050,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: 8,
          padding: 30,
          maxWidth: 800,
          width: "90%",
          display: "flex",
          alignItems: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ flex: 1, marginRight: 40 }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
            <img
              src={groupInfo.avatarUrl || "https://static.thenounproject.com/png/4037765-200.png"}
              alt="Group Avatar"
              style={{ width: 60, height: 60, borderRadius: "50%", marginRight: 15 }}
            />
            <div>
              <h2 style={{ margin: 0 }}>{groupInfo.name}</h2>
              <div style={{ fontSize: 14, color: "#555" }}>Nhóm</div>
            </div>
          </div>
          <h4>ID GROUP: {groupInfo.id}</h4>
          <div style={{ marginTop: 30 }}>
            <h4>Mô tả nhóm</h4>
            <p style={{ color: "#555" }}>{groupInfo.description}</p>
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <QRCode value={joinLink} size={200} />
          <div style={{ fontSize: 14, color: "#555", marginTop: 10 }}>
            Mở Zalo, bấm quét QR để quét và xem trên điện thoại
          </div>
        </div>
      </div>
      <button
        onClick={onClose}
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          background: "#2962FF",
          color: "white",
          border: "none",
          borderRadius: 6,
          padding: "8px 16px",
          cursor: "pointer",
          zIndex: 1100,
        }}
      >
        Đóng
      </button>
    </div>
  );
};

export default GroupQRCodeModal;
