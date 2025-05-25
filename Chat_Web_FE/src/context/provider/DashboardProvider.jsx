import React, { useState, useRef, useEffect } from "react";
import { DashboardContext } from "../Dashboard_context";
import { getCurrentUserService } from "../../services/UserService";
import { removeTokens } from "../../services/AuthService";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getAllConversationsByUserIdService } from "../../services/ConversationService";
import store from "../../redux/store";

import { disconnectWebSocket, connectWebSocket, subscribeToConversation, subscribeToDissolveGroup, subscribeToDeleteConversation } from "../../services/SocketService";
import {
  setSelectedConversation,
  setShowConversation,
} from "../../redux/slice/commonSlice";
const DashboardProvider = ({ children }) => {
  // Trạng thái hiển thị của modal thêm bạn bè
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const addFriendModalRef = useRef(null);

  // Thêm currentUser vào context
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const queryClient = useQueryClient();

  // Kết nối WebSocket
  useEffect(() => {
    if (!currentUser?.id) return;

    connectWebSocket(() => {
        subscribeToConversation(currentUser.id, (message) => {
          if (!message) return;
          try {
              const newGroupConversation = message;
              console.log(
                "New group conversation received:",
                newGroupConversation
              );

              // Cập nhật lại danh sách hội thoại
              queryClient.invalidateQueries(["conversations"]);

              // Thông báo cho người dùng về việc được thêm vào nhóm
              if (newGroupConversation.name) {
                toast.success(
                  `Bạn đã được thêm vào nhóm "${newGroupConversation.name}"!`
                );
              }
            } catch (error) {
              console.error("Error processing group creation message:", error);
            }
        });

      // Đăng ký lắng nghe giải tán nhóm
        subscribeToDissolveGroup(currentUser.id, (message) => {
          if (!message) return;
           try {
              const notificationData = message;
              console.log("Dissolve Group dissolved:", notificationData);
              const conversationName = notificationData.name;
              console.log("Conversation name:", conversationName);

              // Cập nhật lại danh sách hội thoại
              queryClient.invalidateQueries(["conversations"]);

              // Thông báo cho người dùng về việc nhóm đã bị giải tán
              toast.info(`Nhóm với tên "${conversationName}" đã bị giải tán.`);
            } catch (error) {
              console.error(
                "Error processing group dissolution message:",
                error
              );
            }
        });

        subscribeToDeleteConversation(currentUser.id, (message) => {
          if (!message) return;
          try {
              const deletedConversation = message;
              console.log("Conversation deleted:", deletedConversation);

              // Update the conversations list
              queryClient.invalidateQueries(["conversations"]);

              const currentSelectedConversationId =
                store.getState().common.selectedConversation?.id;

              if (deletedConversation.id === currentSelectedConversationId) {
                // Nếu đang xem cuộc trò chuyện bị xóa, quay về màn hình chính
                store.dispatch(setSelectedConversation(null));
                store.dispatch(setShowConversation(false));
              }

              // Notify the user about the deletion
              const conversationName =
                deletedConversation.name || "Cuộc trò chuyện";
              toast.info(
                `"${conversationName}" đã bị xóa khỏi danh sách cuộc trò chuyện của bạn.`
              );
            } catch (error) {
              console.error(
                "Error processing conversation deletion message:",
                error
              );
            }
        });

    });

    return () => {
      disconnectWebSocket();
    };
  }, [currentUser?.id, queryClient]);

  // Lấy currentUser sau khi đã login
  const fetchUser = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setIsAuthLoading(false);
      return;
    }
    try {
      const user = await getCurrentUserService();
      setCurrentUser(user);
    } catch (err) {
      console.error("Không thể lấy thông tin user:", err);
      if (localStorage.getItem("auth_error") === "token_refresh_failed") {
        localStorage.removeItem("auth_error");
      }
      removeTokens();
      setCurrentUser(null);
      window.location.href = "/login";
    } finally {
      setIsAuthLoading(false);
    }
  };

  useEffect(() => {
    const path = window.location.pathname;

    if (path.startsWith("/register")) {
      setIsAuthLoading(false);
      return;
    }

    fetchUser();
  }, []);

  // Modal: Thông tin tài khoản
  const [showAccountInfoModal, setShowAccountInfoModal] = useState(false);
  const accountInfoModalRef = useRef(null);

  const [showProfileModal, setShowProfileModal] = useState(false);
  const profileModalRef = useRef(null);

  // Modal: Chỉnh sửa thông tin cá nhân
  const [showEditInfoModal, setShowEditInfoModal] = useState(false);
  const editInfoModalRef = useRef(null);

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const settingsModalRef = useRef(null);

  // Modal: Thay đổi mật khẩu
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const changePasswordModalRef = useRef(null);

  // Modal: Chuyển tiếp tin nhắn
  const [showForwardMessageModal, setShowForwardMessageModal] = useState(false);
  const forwardMessageModalRef = useRef(null);

  // Modal: Tạo nhóm
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const createGroupModalRef = useRef(null);

  // Modal: Call video
  const [showVideoCallModal, setShowVideoCallModal] = useState(false);
  const videoCallModalRef = useRef(null);

  const [showIncomingCallModal, setShowIncomingCallModal] = useState(false);
  const incomingCallModalRef = useRef(null);

  // Modal: Thêm bạn bè AddMemberGroupModal
  const [showAddMemberGroupModal, setShowAddMemberGroupModal] = useState(false);
  const addMemberGroupModalRef = useRef(null);

  console.log("DashboardProvider", showAddFriendModal);

  //Modal: Thêm phó nhóm
  const [showDeputyModal, setShowDeputyModal] = useState(false);
  const deputyModalRef = useRef(null);

  //  // Modal: Chuyển quyền trưởng nhóm
  const [showLeaderTransferModal, setShowLeaderTransferModal] = useState(false);
  const leaderTransferModalRef = useRef(null);

  // THÊM STATE CHO CÁC MODAL LƯU CONVERSATION
  const [conversationInfor, setConversationInfor] = useState(null);

  // Modal: Đổi tên nhóm
  const [showChangeGroupNameModal, setShowChangeGroupNameModal] =
    useState(false);
  const changeGroupNameModalRef = useRef(null);

  const contextValue = {
    currentUser,
    setCurrentUser,
    isAuthLoading,
    fetchUser,

    showAddFriendModal,
    setShowAddFriendModal,
    addFriendModalRef,

    showAccountInfoModal,
    setShowAccountInfoModal,
    accountInfoModalRef,

    showProfileModal,
    setShowProfileModal,
    profileModalRef,

    showEditInfoModal,
    setShowEditInfoModal,
    editInfoModalRef,

    showSettingsModal,
    setShowSettingsModal,
    settingsModalRef,

    showChangePasswordModal,
    setShowChangePasswordModal,
    changePasswordModalRef,

    showForwardMessageModal,
    setShowForwardMessageModal,
    forwardMessageModalRef,

    showCreateGroupModal,
    setShowCreateGroupModal,
    createGroupModalRef,

    showVideoCallModal,
    setShowVideoCallModal,
    videoCallModalRef,

    showIncomingCallModal,
    setShowIncomingCallModal,
    incomingCallModalRef,

    showAddMemberGroupModal,
    setShowAddMemberGroupModal,
    addMemberGroupModalRef,

    // Thêm conversationInfor và setConversationInfor vào context
    conversationInfor,
    setConversationInfor,

    showDeputyModal,
    setShowDeputyModal,
    deputyModalRef,

    showLeaderTransferModal,
    setShowLeaderTransferModal,
    leaderTransferModalRef,

    showChangeGroupNameModal,
    setShowChangeGroupNameModal,
    changeGroupNameModalRef,
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardProvider;
