import React, { useState, useRef, useEffect } from "react";
import { DashboardContext } from "../Dashboard_context";
import { getCurrentUserService } from "../../services/UserService";
import { removeTokens } from "../../services/AuthService";

const DashboardProvider = ({ children }) => {
  // Trạng thái hiển thị của modal thêm bạn bè
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const addFriendModalRef = useRef(null);

  // Thêm currentUser vào context
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

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

  console.log("DashboardProvider", showAddFriendModal);

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
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardProvider;
