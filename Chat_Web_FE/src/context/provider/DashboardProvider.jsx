import React, { useState, useRef } from "react";
import { DashboardContext } from "../Dashboard_context";

const DashboardProvider = ({ children }) => {
  // Trạng thái hiển thị của modal thêm bạn bè
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const addFriendModalRef = useRef(null);

  console.log("DashboardProvider", showAddFriendModal);

  const contextValue = {
    showAddFriendModal,
    setShowAddFriendModal,
    addFriendModalRef,
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardProvider;
