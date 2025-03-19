import React from "react";
import { BsChatDotsFill, BsTrash, BsSearch } from "react-icons/bs";
import { RiContactsBook3Line } from "react-icons/ri";
import { IoSettingsOutline, IoLogOutOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { Container, Button, Image } from "react-bootstrap";

const sidebarLinks = [
  {
    title: "Profile",
  },
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

const bottomSidebarLinks = [
  {
    icon: (
      <IoSettingsOutline
        style={{ height: "2em", width: "2em" }}
        color="white"
      />
    ),
    title: "Setting",
  },
  {
    icon: (
      <IoLogOutOutline style={{ height: "2em", width: "2em" }} color="white" />
    ),
    title: "Logout",
  },
];

const DashboardSideBar = () => {
  return (
    <Container
      fluid
      className="d-flex flex-column align-items-center bg-primary text-white p-0"
      style={{ width: "64px", minHeight: "100vh" }}
    >
      {sidebarLinks.map((item) => {
        if (item.title === "Profile") {
          return (
            <div
              key={item.title}
              className="w-100 d-flex justify-content-center"
              style={{ height: "100px" }}
            >
              <div
                className="mt-4 mb-4 curosr-pointer"
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  overflow: "hidden",
                }}
                onClick={() => console.log("Profile")}
              >
                <Image
                  src="/images/avatar/avtdefault.jpg"
                  alt="avatar"
                  className="img-fluid object-fit-cover"
                />
              </div>
            </div>
          );
        } else  {
          return (
            <Button
              key={item.title}
              className="w-100 d-flex align-items-center justify-content-center p-0"
              variant="primary"
              style={{ height: "64px" }}
              onClick={() => console.log(item.title)}
            >
              {item.icon}
            </Button>
          );
        }
      })}

      {/* Phần tử flex-grow để đẩy các nút xuống dưới cùng */}
      <div style={{ flexGrow: 1 }}></div>

      {bottomSidebarLinks.map((item) => {
        if (item.title === "Setting") {
          return (
            <Button
              key={item.title}
              className="w-100 d-flex align-items-center justify-content-center p-0"
              variant="primary"
              style={{ height: "64px" }}
              onClick={() => console.log(item.title)}
            >
              {item.icon}
            </Button>
          );
        } else {
          return (
            <Button
              key={item.title}
              className="w-100 d-flex align-items-center justify-content-center p-0"
              variant="primary"
              style={{ height: "64px" }}
              onClick={() => console.log(item.title)}
            >
              {item.icon}
            </Button>
          );
        }
      })}
    </Container>
  );
};

export default DashboardSideBar;
