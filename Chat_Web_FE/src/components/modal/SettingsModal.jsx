import React, { useState } from "react";
import ReactModal from "react-modal";
import { FaTimes, FaBell, FaPalette, FaLock, FaCog, FaCommentDots, FaTools } from "react-icons/fa";

const SettingsModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("Cài đặt chung");

  const tabs = [
    { key: "Cài đặt chung", icon: <FaCog />, label: "Cài đặt chung" },
    { key: "Quyền riêng tư", icon: <FaLock />, label: "Quyền riêng tư" },
    { key: "Giao diện", icon: <FaPalette />, label: "Giao diện", badge: "Beta" },
    { key: "Thông báo", icon: <FaBell />, label: "Thông báo" },
    { key: "Tin nhắn", icon: <FaCommentDots />, label: "Tin nhắn" },
    { key: "Tiện ích", icon: <FaTools />, label: "Tiện ích" },
  ];

  const renderContent = () => {
    if (activeTab === "Cài đặt chung") {
      return (
        <>
          <h6 className="fw-bold">Danh bạ</h6>
          <p className="text-muted">Danh sách bạn bè được hiển thị trong danh bạ</p>
          <div className="form-check mb-2">
            <input className="form-check-input" type="radio" name="contacts" id="allFriends" />
            <label className="form-check-label" htmlFor="allFriends">Hiển thị tất cả bạn bè</label>
          </div>
          <div className="form-check mb-4">
            <input className="form-check-input" type="radio" name="contacts" id="zaloFriends" defaultChecked />
            <label className="form-check-label" htmlFor="zaloFriends">Chỉ hiển thị bạn bè đang sử dụng Zalo</label>
          </div>

          <h6 className="fw-bold">Ngôn ngữ</h6>
          <select className="form-select w-auto">
            <option value="vi">Tiếng Việt</option>
            <option value="en">English</option>
          </select>
        </>
      );
    }
    return <p>Nội dung "{activeTab}" đang được phát triển.</p>;
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white rounded-4 shadow p-0 position-relative"
      overlayClassName="position-fixed top-0 start-0 z-50 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
      style={{ content: { inset: "unset", width: "800px", maxHeight: "90vh" } }}
    >
      {/* Nút đóng nằm góc trên phải toàn bộ modal */}
      <button
        className="btn btn-sm position-absolute top-0 end-0 m-3 text-dark"
        onClick={onClose}
        style={{ zIndex: 10 }}
      >
        <FaTimes size={20} />
      </button>

      <div className="d-flex" style={{ height: "100%" }}>
        {/* Sidebar */}
        <div className="border-end p-3" style={{ width: "250px" }}>
          <h5 className="fw-semibold mb-4">Cài đặt</h5>
          <div className="list-group">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${activeTab === tab.key ? "active" : ""}`}
              >
                <span className="d-flex align-items-center">
                  <span className="me-2">{tab.icon}</span>
                  {tab.label}
                </span>
                {tab.badge && <span className="badge bg-primary">{tab.badge}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="p-4 flex-grow-1 overflow-auto bg-light">
          {renderContent()}
        </div>
      </div>
    </ReactModal>
  );
};

export default SettingsModal;
