import React from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardWelcome from "../modules/dashboard/DashboadWelcome";
import DashboardContact from "../modules/dashboard/DashboardContact";
import Conservation from "../modules/chat/conservation/Conservation";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const currentTab = useSelector((state) => state.chat.currentTab);

  const [showConservation, setShowConservation] = React.useState(true);
  return (
    <>
      {currentTab === "Chat" && showConservation && <DashboardWelcome />}
      {currentTab === "Chat" && !showConservation && <Conservation />}
      {currentTab === "Contact" && <DashboardContact />}

    </>
  );
}

export default DashboardPage;