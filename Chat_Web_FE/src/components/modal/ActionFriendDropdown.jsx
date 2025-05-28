import React, { useEffect, useRef } from "react";

import useFriend from "../../hooks/useFriend";
import Swal from "sweetalert2";

const ActionFriendDropdown = ({ friend, setShowDropdown, showDropdown }) => {
  const { unfriend } = useFriend();

  const handleUnfriend = (friendId) => {
    console.log("Unfriend ID:", friendId);
    Swal.fire({
      title: "Bạn có chắc chắn muốn xóa bạn này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        unfriend(friendId);
      }
    });
    setShowDropdown(false);
  };
  return (
    <div className="" style={{ position: "relative" }}>
      {showDropdown && (
        <div
          className="actions-dropdown"
          style={{
            position: "absolute",
            right: 0,
            top: "100%",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            width: "200px",
            zIndex: 1000,
            overflow: "hidden",
            marginTop: "8px",
          }}
        >
          <div className="dropdown-content">
            <div
              className="action-item"
              onClick={() => handleUnfriend(friend?.userId)}
              style={actionItemStyle}
            >
              <i className="bi bi-person-x" style={iconStyle}></i>
              <span>Hủy kết bạn</span>
            </div>

            <div className="action-item" style={actionItemStyle}>
              <i className="bi bi-shield-x" style={iconStyle}></i>
              <span>Chặn</span>
            </div>

            <div className="action-item" style={actionItemStyle}>
              <i className="bi bi-person" style={iconStyle}></i>
              <span>Xem hồ sơ</span>
            </div>
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

export default ActionFriendDropdown;
