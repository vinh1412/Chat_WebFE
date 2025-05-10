import React from "react";
import { useParams, useLocation } from "react-router-dom";
import QRCode from "react-qr-code"; // Use react-qr-code instead

const GroupQRCodePage = () => {
  const { conversationId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const groupName = queryParams.get("groupName") || "Nhóm chưa có tên";
  const groupLink = queryParams.get("groupLink") || "";
  const groupId = queryParams.get("groupId") || conversationId;

  const groupInfo = {
    name: groupName,
    id: groupId,
    description: "Nhóm chưa có thông tin mô tả.",
    avatarUrl: "",
  };

  const joinLink = groupLink || `${window.location.origin}/join-group/${conversationId}`;

  return (
    <div style={{ backgroundColor: "#ECEFF1", minHeight: "100vh"}}>
      <header style={{ display: "flex", justifyContent: "space-between" , padding: '15px', backgroundColor: "#fff"}}>
        <div style={{ fontSize: "24px", fontWeight: "bold", color: "#2962FF" }}>Chat</div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ fontSize: "14px" }}>
            Ngôn ngữ: <a href="/" style={{ color: "#2962FF", textDecoration: "none" }}>Tiếng Việt</a>
            </div>
            <div style={{ fontSize: "14px" , marginLeft: "20px" }}>
            <a href="/" style={{ color: "#2962FF", textDecoration: "" }}>Quay lại </a>
            </div>
        </div>
      </header>

      <div style={{
        backgroundColor: "#fff",
        borderRadius: "8px",
        padding: "30px",
        maxWidth: "800px",
        margin: "40px auto",
        display: "flex",
        alignItems: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <div style={{ flex: 1, marginRight: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
            <img
              src={groupInfo.avatarUrl || "https://static.thenounproject.com/png/4037765-200.png"}
              alt="Group Avatar"
              style={{ width: "60px", height: "60px", borderRadius: "50%", marginRight: "15px" }}
            />
            <div>
              <h2 style={{ margin: 0 }}>{groupInfo.name}</h2>
              <div style={{ fontSize: "14px", color: "#555" }}>Nhóm</div>
            </div>
          </div>

          {/* <button style={{
            backgroundColor: "#2962FF",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}>
            <span style={{ marginRight: "8px" }}>💬</span> Tham gia nhóm
          </button> */}
          <h4> ID GROUP: {groupInfo.id}</h4>

          <div style={{ marginTop: "30px" }}>
            <h4>Mô tả nhóm</h4>
            <p style={{ color: "#555" }}>{groupInfo.description}</p>
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <QRCode value={joinLink} size={200} /> {/* Updated to use react-qr-code */}
          <div style={{ fontSize: "14px", color: "#555", marginTop: "10px" }}>
            Mở Zalo, bấm quét QR để quét và xem trên điện thoại
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupQRCodePage;