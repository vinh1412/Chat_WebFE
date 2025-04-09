import React, { useState, useRef } from "react";
import { DashboardContext } from "../Dashboard_context";

const DashboardProvider = ({ children }) => {
  // Trạng thái hiển thị của modal thêm bạn bè
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const addFriendModalRef = useRef(null);

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
