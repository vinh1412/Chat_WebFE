import React from "react";
import { Modal } from "react-bootstrap";
import { useDashboardContext } from "../../context/Dashboard_context";

const AccountInfoModal = ({ isOpen, onClose }) => {
  const { setShowProfileModal } = useDashboardContext();
  const {setShowSettingsModal} = useDashboardContext();

  const handleViewProfile = () => {
    onClose(); // Đóng AccountInfoModal
    setTimeout(() => setShowProfileModal(true), 200);
  };
  const handleViewSettings = () => {
    onClose();
    setTimeout(() => setShowSettingsModal(true), 200);
  }

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <div className="p-3">
        <h6 className="fw-bold mb-3">Ngô Văn Toàn</h6>
        <div className="mb-2 cursor-pointer" onClick={handleViewProfile}>
          Hồ sơ của bạn
        </div>
        <div className="mb-2 cursor-pointer" onClick={handleViewSettings}>
          Cài đặt
        </div>
      </div>
    </Modal>
  );
};

export default AccountInfoModal;
