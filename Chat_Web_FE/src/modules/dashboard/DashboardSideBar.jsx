import React, { useState } from "react";
import { BsChatDotsFill } from "react-icons/bs";
import { RiContactsBook3Line } from "react-icons/ri";
import { IoSettingsOutline, IoLogOutOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentTab } from "../../redux/slice/chatSlice";
import { Container, Button, Image } from "react-bootstrap";
import AccountInfoModal from "../../components/modal/AccountInfoModal";

const sidebarLinks = [
  { title: "Profile" },
  {
    icon: <BsChatDotsFill style={{ height: "2em", width: "2em" }} color="white" />,
    title: "Chat",
  },
  {
    icon: <RiContactsBook3Line style={{ height: "2em", width: "2em" }} color="white" />,
    title: "Contact",
  },
];

const bottomSidebarLinks = [
  {
    icon: <IoSettingsOutline style={{ height: "2em", width: "2em" }} color="white" />,
    title: "Setting",
  },
  {
    icon: <IoLogOutOutline style={{ height: "2em", width: "2em" }} color="white" />,
    title: "Logout",
  },
];

const DashboardSideBar = () => {
  const dispatch = useDispatch();
  const currentTab = useSelector((state) => state.chat.currentTab);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  return (
    <>
      <Container
        fluid
        className="d-flex flex-column align-items-center bg-primary text-white p-0"
        style={{ width: "64px", minHeight: "100vh" }}
      >
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
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src="/images/avatar/avtdefault.jpg"
                    alt="avatar"
                    className="img-fluid object-fit-cover"
                  />
                </div>
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

        {/* Flex spacer */}
        <div style={{ flexGrow: 1 }}></div>

        {bottomSidebarLinks.map((item) => (
          <Button
            key={item.title}
            className="w-100 d-flex align-items-center justify-content-center p-0"
            variant="primary"
            style={{ height: "64px" }}
            onClick={() => console.log(item.title)}
          >
            {item.icon}
          </Button>
        ))}
      </Container>

      {/* Account Info Modal */}
      <AccountInfoModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
      />
    </>
  );
};

export default DashboardSideBar;
