import React, { useState } from "react";
import { BsChatDotsFill } from "react-icons/bs";
import { RiContactsBook3Line } from "react-icons/ri";
import { IoSettingsOutline, IoLogOutOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentTab } from "../../redux/slice/chatSlice";
import { Container, Button, Image } from "react-bootstrap";
import AccountInfoModal from "../../components/modal/AccountInfoModal";
import SettingInfoModal from "../../components/modal/SettingInfoModal";
import defaultCover from "../../assets/images/hinh-nen-buon-danbo.jpg";
import { useDashboardContext } from "../../context/Dashboard_context";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
const sidebarLinks = [
  { title: "Profile" },
  {
    icon: (
      <BsChatDotsFill style={{ height: "2em", width: "2em" }} color="white" />
    ),
    title: "Chat",
  },
  {
    icon: (
      <RiContactsBook3Line
        style={{ height: "2em", width: "2em" }}
        color="white"
      />
    ),
    title: "Contact",
  },
];

const DashboardSideBar = () => {
  const dispatch = useDispatch();
  const currentTab = useSelector((state) => state.chat.currentTab);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);
  const { currentUser } = useDashboardContext();
  const navigate = useNavigate();
  const { handleLogout } = useAuth();

  // Bottom buttons handler
  const handleBottomAction = (title) => {
    if (title === "Setting") setIsSettingModalOpen(true);
    if (title === "Logout") {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear(); // Xóa captcha nếu còn
          delete window.recaptchaVerifier;
        } catch (error) {
          console.warn("Không thể xóa recaptchaVerifier:", error);
        }
      }
      Swal.fire({
        title: "Bạn có chắc chắn muốn đăng xuất?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Đăng xuất",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) {
          handleLogout(); // Xóa token, gọi API logout nếu cần
          navigate("/login"); // Điều hướng về trang đăng nhập
        }
      });
    }
  };

  return (
    <>
      <Container
        fluid
        className="d-flex flex-column align-items-center bg-primary text-white p-0"
        style={{ width: "64px", minHeight: "100vh" }}
      >
        {/* Top buttons */}
        {sidebarLinks.map((item) => {
          if (item.title === "Profile") {
            return (
              <Button
                key={item.title}
                className="w-100 d-flex justify-content-center align-items-center p-0"
                style={{
                  height: "100px",
                  background: "transparent",
                  border: "none",
                }}
                onClick={() => setIsAccountModalOpen(true)}
              >
                <Image
                  src={currentUser?.avatar || defaultCover}
                  alt="avatar"
                  className="img-fluid"
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </Button>
            );
          } else {
            return (
              <Button
                key={item.title}
                className="w-100 d-flex align-items-center justify-content-center p-0"
                variant={currentTab === item.title ? "info" : "primary"}
                style={{ height: "64px" }}
                onClick={() => dispatch(setCurrentTab(item.title))}
              >
                {item.icon}
              </Button>
            );
          }
        })}

        {/* Spacer */}
        <div style={{ flexGrow: 1 }}></div>

        {/* Bottom buttons */}
        <Button
          className="w-100 d-flex align-items-center justify-content-center p-0"
          variant="primary"
          style={{ height: "64px" }}
          onClick={() => handleBottomAction("Setting")}
        >
          <IoSettingsOutline
            style={{ height: "2em", width: "2em" }}
            color="white"
          />
        </Button>
        <Button
          className="w-100 d-flex align-items-center justify-content-center p-0"
          variant="primary"
          style={{ height: "64px" }}
          onClick={() => handleBottomAction("Logout")}
        >
          <IoLogOutOutline
            style={{ height: "2em", width: "2em" }}
            color="white"
          />
        </Button>
      </Container>

      {/* Modals */}
      <AccountInfoModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
      />
      <SettingInfoModal
        isOpen={isSettingModalOpen}
        onClose={() => setIsSettingModalOpen(false)}
      />
    </>
  );
};

export default DashboardSideBar;
