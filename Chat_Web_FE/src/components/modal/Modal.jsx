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
import VideoCallModal from "./VideoCallModal";
import IncomingCallModal from "./IncomingCallModal";
import AddMemberGroupModal from "./AddMemberGroupModal";

import DeputyModal from "./DeputyModal";
import LeaderTransferModal from "./LeaderTransferModal";
import ChangeGroupNameModal from "./ChangeGroupNameModal";
import AccountInfoSearchModal from "./AccountInfoSearchModal";

import GroupInfoModal from "./GroupInfoLinkModal";

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
    showVideoCallModal,
    setShowVideoCallModal,
    showIncomingCallModal,
    setShowIncomingCallModal,

    showAddMemberGroupModal,
    setShowAddMemberGroupModal,
    addMemberGroupModalRef,
    setCurrentConversationInfor,
    conversationInfor,
    showDeputyModal,
    setShowDeputyModal,
    showLeaderTransferModal,
    setShowLeaderTransferModal,

    showChangeGroupNameModal,
    setShowChangeGroupNameModal,

    showAccountInfoSearchModal,
    setShowAccountInfoSearchModal,
    selectedSearchUser,
    setSelectedSearchUser,


    // GroupInfoModal,
    // setGroupInfoModal,
    
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

      {/* Modal group info */}
      {/* <ReactModal
        isOpen={GroupInfoModal}
        onRequestClose={() => setGroupInfoModal(false)}
        contentLabel="Group Info Modal"
        className="modal-content bg-white rounded border-0 p-2 position-relative"
        overlayClassName="modal-overlay position-fixed top-0 start-0 z-50 shadow-lg d-flex justify-content-center align-items-center w-100"
      >
        <GroupInfoModal
          isOpen={GroupInfoModal}
          onClose={() => setGroupInfoModal(false)}
        />
      </ReactModal> */}

      {/* Modal cuộc gọi video */}
      <ReactModal
        isOpen={showVideoCallModal}
        onRequestClose={() => setShowVideoCallModal(false)}
        contentLabel="Video Call Modal"
        className="modal-content bg-white rounded border-0 p-2 position-relative"
        overlayClassName="modal-overlay position-fixed top-0 start-0 z-50 shadow-lg d-flex justify-content-center align-items-center w-100"
      >
        <VideoCallModal
          isOpen={showVideoCallModal}
          onClose={() => setShowVideoCallModal(false)}
        />
      </ReactModal>
      {/* Modal cuộc gọi đến */}
      <ReactModal
        isOpen={showIncomingCallModal}
        onRequestClose={() => setShowIncomingCallModal(false)}
        contentLabel="Incoming Call Modal"
        className="modal-content bg-white rounded border-0 p-2 position-relative"
        overlayClassName="modal-overlay position-fixed top-0 start-0 z-50 shadow-lg d-flex justify-content-center align-items-center w-100"
        style={{
          content: {
            width: "400px",
            maxWidth: "90%",
            margin: "auto",
          },
        }}
      >
        <IncomingCallModal
          isOpen={showIncomingCallModal}
          onClose={() => setShowIncomingCallModal(false)}
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
          setCurrentConversationInfor={setCurrentConversationInfor}
          conversationInfor={conversationInfor} // Truyền conversationInfor
        />
      </ReactModal>

      {/* Modal: Chọn phó nhóm */}

      <ReactModal
        isOpen={showDeputyModal}
        onRequestClose={() => setShowDeputyModal(false)}
        contentLabel="Deputy Modal"
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
        <DeputyModal
          isOpen={showDeputyModal}
          onClose={() => setShowDeputyModal(false)}
          conversationId={conversationInfor?.id}
          setCurrentConversationInfor={setCurrentConversationInfor}
          conversationInfor={conversationInfor} // Truyền conversationInfor
        />
      </ReactModal>

      {/* Modal: Chuyển quyền trưởng nhóm */}
      <ReactModal
        isOpen={showLeaderTransferModal}
        onRequestClose={() => setShowLeaderTransferModal(false)}
        contentLabel="Leader Transfer Modal"
        style={{
          content: {
            width: "600px",
            maxWidth: "90%",
            margin: "auto",
          },
        }}
        className="modal-content bg-white rounded border-0 p-2 position-relative"
        overlayClassName="modal-overlay position-fixed top-0 start-0 z-50 shadow-lg d-flex justify-content-center align-items-center w-100"
        q
      >
        <LeaderTransferModal
          isOpen={showLeaderTransferModal}
          onClose={() => setShowLeaderTransferModal(false)}
          conversationId={conversationInfor?.id}
          setCurrentConversationInfor={setCurrentConversationInfor}
          conversationInfor={conversationInfor} // Truyền conversationInfor
        />
      </ReactModal>

      {/* Modal: Đổi tên nhóm */}
      <ReactModal
        isOpen={showChangeGroupNameModal}
        onRequestClose={() => setShowChangeGroupNameModal(false)}
        contentLabel="Change Group Name Modal"
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
        <ChangeGroupNameModal
          isOpen={showChangeGroupNameModal}
          onClose={() => setShowChangeGroupNameModal(false)}
          conversationId={conversationInfor?.id}
          setCurrentConversationInfor={setCurrentConversationInfor}
          conversationInfor={conversationInfor} // Truyền conversationInfor
        />
      </ReactModal>

      {/* Modal: Search User Info */}
      <ReactModal
        isOpen={showAccountInfoSearchModal}
        onRequestClose={() => setShowAccountInfoSearchModal(false)}
        contentLabel="Account Info Search Modal"
        style={{
          content: {
            width: "500px",
            maxWidth: "90%",
            margin: "auto",
          },
        }}
        className="modal-content bg-white rounded border-0 p-2 position-relative"
        overlayClassName="modal-overlay position-fixed top-0 start-0 z-50 shadow-lg d-flex justify-content-center align-items-center w-100"
      >
        <AccountInfoSearchModal
          show={showAccountInfoSearchModal}
          handleClose={() => {
            setShowAccountInfoSearchModal(false);
            setSelectedSearchUser(null);
            setShowAddFriendModal(true); // Show the add friend modal again
          }}
          user={selectedSearchUser}
        />


      </ReactModal>
    </>
  );
};

export default Modal;
