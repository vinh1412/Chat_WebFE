import ReactModal from "react-modal";
import React from "react";
import { useDashboardContext } from "../../context/Dashboard_context";
import AddFriendModal from "./AddFriendModal";
import AccountInfoModal from "./AccountInfoModal";
import ProfileModal from "./ProfileModal";
import SettingsModal from "./SettingsModal";
import ChangePasswordModal from "./ChangePasswordModal";
import ForwardMessageModal from "./ForwardMessageModal";
import CreateGroupModal from "./CreateGroupModal";
import AddMemberGroupModal from "./AddMemberGroupModal";

const Modal = () => {
  const {
    showAddFriendModal,
    setShowAddFriendModal,
    showAccountInfoModal,
    setShowAccountInfoModal,
    showProfileModal,
    setShowProfileModal,
    showSettingsModal,
    setShowSettingsModal,
    showChangePasswordModal,
    setShowChangePasswordModal,
    showForwardMessageModal,
    setShowForwardMessageModal,
    showCreateGroupModal,
    setShowCreateGroupModal,
    showAddMemberGroupModal,
    setShowAddMemberGroupModal,
    addMemberGroupModalRef,
  } = useDashboardContext();

  return (
    <>
      {/* Modal: Thêm bạn bè */}
      <ReactModal
        isOpen={showAddFriendModal}
        onRequestClose={() => setShowAddFriendModal(false)}
        contentLabel="Modal"
        style={{ maxWidth: "280px", maxHeight: "157px" }}
        className="modal-content w-25 bg-white rounded border-0 p-2 position-relative"
        overlayClassName="modal-overlay position-fixed top-0 start-0 z-50 shadow-lg d-flex justify-content-center align-items-center w-100"
      >
        <AddFriendModal />
      </ReactModal>

      {/* Modal: Thông tin tài khoản */}
      <ReactModal
        isOpen={showAccountInfoModal}
        onRequestClose={() => setShowAccountInfoModal(false)}
        contentLabel="Account Info Modal"
        className="modal-content bg-white rounded border-0 p-2 position-absolute top-0 start-0 m-3"
        overlayClassName="modal-overlay position-fixed top-0 start-0 z-50 w-100 h-100"
      >
        <AccountInfoModal
          isOpen={showAccountInfoModal}
          onClose={() => setShowAccountInfoModal(false)}
        />
      </ReactModal>

      {/* Modal: Thông tin cá nhân */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

      {/* Modal: Cài đặt */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
      {/* Modal: Đổi mật khẩu */}
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />
      {/* Modal: Chuyển tiếp tin nhắn */}
      <ReactModal
        isOpen={showForwardMessageModal}
        onRequestClose={() => setShowForwardMessageModal(false)}
        contentLabel="Forward Message Modal"
        className="modal-content bg-white rounded border-0 p-2 position-absolute top-0 start-0 m-3"
        overlayClassName="modal-overlay position-fixed top-0 start-0 z-50 w-100 h-100"
      >
        <ForwardMessageModal
          isOpen={showForwardMessageModal}
          onClose={() => setShowForwardMessageModal(false)}
        />
      </ReactModal>

      {/* Modal tạo nhóm */}
      <ReactModal
        isOpen={showCreateGroupModal}
        onRequestClose={() => setShowCreateGroupModal(false)}
        contentLabel="Create Group Modal"
        style={{
          content: {
            width: "600px",
            maxWidth: "90%",
            margin: "auto",
          },
        }}
        className="modal-content bg-white rounded border-0 p-2 position-relative"
        overlayClassName="modal-overlay position-fixed top-0 start-0 z-50 shadow-lg d-flex justify-content-center align-items-center w-100"
      >
        <CreateGroupModal
          isOpen={showCreateGroupModal}
          onClose={() => setShowCreateGroupModal(false)}
        />
      </ReactModal>


      {/* them thanh vien vao gr sau khi tao xong */}
      <ReactModal
       isOpen={showAddMemberGroupModal}
        onRequestClose={() => setShowAddMemberGroupModal(false)}
        contentLabel="Add Member Group Modal"
        style={{
          content: {
            width: "600px",
            maxWidth: "90%",
            margin: "auto",
          },
        }}
        className="modal-content bg-white rounded border-0 p-2 position-relative"
        overlayClassName="modal-overlay position-fixed top-0 start-0 z-50 shadow-lg d-flex justify-content-center align-items-center w-100"
      >
        <AddMemberGroupModal
          isOpen={showAddMemberGroupModal}
          onClose={() => setShowAddMemberGroupModal(false)}
          addMemberGroupModalRef={addMemberGroupModalRef}
        />  
      </ReactModal>


    </>
  );
};

export default Modal;
