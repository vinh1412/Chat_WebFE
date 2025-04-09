import ReactModal from "react-modal";
import React from "react";
import { useDashboardContext } from "../../context/Dashboard_context";
import AddFriendModal from "./AddFriendModal";

// Các modal thì làm trong này (Thông tin cá nhân, thêm bạn bè, tạo nhóm, tạo cuộc trò chuyện, ...)
const Modal = () => {
  const { showAddFriendModal, setShowAddFriendModal } = useDashboardContext();

  console.log("Modal isOpen:", showAddFriendModal);

  return (
    <ReactModal
      isOpen={showAddFriendModal}
      onRequestClose={() => setShowAddFriendModal(false)}
      contentLabel="Modal"
      style={{ maxWidth: "280px", maxHeight: "157px"}}
      className="modal-content w-25 bg-white rounded border-0 p-2 position-relative" 
      overlayClassName="modal-overlay position-fixed top-0 start-0 z-50 shadow-lg d-flex justify-content-center align-items-center w-100" // đổ mờ nền
    >
      <AddFriendModal />
    </ReactModal>
  );
};

export default Modal;
