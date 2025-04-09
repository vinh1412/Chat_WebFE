import React, { useState, useRef } from "react";
import { DashboardContext } from "../Dashboard_context";

const DashboardProvider = ({ children }) => {
  // Trạng thái hiển thị của modal thêm bạn bè
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const addFriendModalRef = useRef(null);

  // Modal: Thông tin tài khoản
  const [showAccountInfoModal, setShowAccountInfoModal] = useState(false);
  const accountInfoModalRef = useRef(null);

  // Modal: Thông tin cá nhân
  const [showProfileModal, setShowProfileModal] = useState(false);
  const profileModalRef = useRef(null);

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

  };

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardProvider;
