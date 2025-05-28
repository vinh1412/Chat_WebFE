import React from "react";
import { Modal } from "react-bootstrap";
import { FaUser, FaGlobe } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import { BsDatabaseFill, BsQuestionCircle } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { useDashboardContext } from "../../context/Dashboard_context";

const SettingInfoModal = ({ isOpen, onClose }) => {
  const { setShowProfileModal, setShowSettingsModal } = useDashboardContext();

  const handleViewProfile = () => {
    onClose();
    setTimeout(() => setShowProfileModal(true), 200);
  };

  const handleViewSettings = () => {
    onClose();
    setTimeout(() => setShowSettingsModal(true), 200);
  };

  const handleDataClick = () => {
    console.log("Dữ liệu được chọn");
  };

  const handleLanguageClick = () => {
    console.log("Ngôn ngữ được chọn");
  };

  const handleSupportClick = () => {
    console.log("Hỗ trợ được chọn");
  };

  const menuItem = (icon, label, onClick, hasArrow = false) => (
    <div
      className="d-flex align-items-center justify-content-between py-2 px-3 cursor-pointer"
      onClick={onClick}
      style={{ borderBottom: "1px solid #eee", cursor: "pointer" }}
    >
      <div className="d-flex align-items-center gap-2">
        {icon}
        <span>{label}</span>
      </div>
      {hasArrow && <span>&gt;</span>}
    </div>
  );

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <div className="bg-white rounded shadow-sm" style={{ minWidth: "260px" }}>
        {menuItem(<FaUser />, "Thông tin tài khoản", handleViewProfile)}
        {menuItem(<IoSettingsSharp />, "Cài đặt", handleViewSettings)}
        {menuItem(<BsDatabaseFill />, "Dữ liệu", handleDataClick, true)}
        {menuItem(<FaGlobe />, "Ngôn ngữ", handleLanguageClick, true)}
        {menuItem(<BsQuestionCircle />, "Hỗ trợ", handleSupportClick, true)}
      </div>
    </Modal>
  );
};

export default SettingInfoModal;
