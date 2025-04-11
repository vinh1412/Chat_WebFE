import React from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardWelcome from "../modules/dashboard/DashboardWelcome";
import DashboardContact from "../modules/dashboard/DashboardContact";
import Conservation from "../modules/chat/conservation/Conservation";

// component này là trang dashboard, hiển thị các component con tùy thuộc vào tab hiện tại
const DashboardPage = () => {
  const dispatch = useDispatch();
  const currentTab = useSelector((state) => state.chat.currentTab);

  const showConservation = useSelector(
    (state) => state.common.showConversation
  );
  return (
    <>
      {currentTab === "Chat" && !showConservation && <DashboardWelcome />}
      {currentTab === "Chat" && showConservation && <Conservation />}
      {currentTab === "Contact" && <DashboardContact />}
    </>
  );
};

export default DashboardPage;
