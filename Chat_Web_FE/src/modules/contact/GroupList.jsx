import React from "react";
import { Container, Form, Row, Col } from "react-bootstrap";
import { BsThreeDots } from "react-icons/bs";
import { FaSearch, FaSortAlphaDown, FaFilter, FaCheck, FaUsers } from "react-icons/fa"; // Added FaUserFriends here
import "../../assets/css/GroupList.css"
const groups = [
  {
    id: "5",
    name: "Nhóm CNM",
    message: "Làm tới đâu rồi",
    time: "09:22",
    avatar: "https://i.pravatar.cc/300?img=3",
    category: "other",
    isGroup: true,
    members: [
      { name: "Nguyễn Văn A", avatar: "https://i.pravatar.cc/300?img=1" },
      { name: "Trần Văn B", avatar: "https://i.pravatar.cc/300?img=2" },
      { name: "Lê Thị C", avatar: "https://i.pravatar.cc/300?img=4" },
    ],
  },
  {
    id: "6",
    name: "Nhom dep traiz",
    message: "Nào đẹp trai vào đây",
    time: "14:15",
    avatar: "https://i.pravatar.cc/300?img=4",
    category: "priority",
    isGroup: true,
    members: [
      { name: "Nguyễn Văn A", avatar: "https://i.pravatar.cc/300?img=1" },
      { name: "Trần Văn B", avatar: "https://i.pravatar.cc/300?img=2" },
      { name: "Lê Thị C", avatar: "https://i.pravatar.cc/300?img=4" },
      { name: "Ngô Văn D", avatar: "https://i.pravatar.cc/300?img=5" },
    ],
  },
  {
    id: "7",
    name: "Nhóm CNM",
    message: "Làm tới đâu rồi",
    time: "09:22",
    avatar: "https://i.pravatar.cc/300?img=3",
    category: "other",
    isGroup: true,
    members: [
      { name: "Nguyễn Văn A", avatar: "https://i.pravatar.cc/300?img=1" },
      { name: "Trần Văn B", avatar: "https://i.pravatar.cc/300?img=2" },
      { name: "Lê Thị C", avatar: "https://i.pravatar.cc/300?img=4" },
    ],
  },
  {
    id: "8",
    name: "Nhom dep",
    message: "Nào đẹp trai vào đây",
    time: "14:15",
    avatar: "https://i.pravatar.cc/300?img=4",
    category: "priority",
    isGroup: true,
    members: [
      { name: "Nguyễn Văn A", avatar: "https://i.pravatar.cc/300?img=1" },
      { name: "Trần Văn B", avatar: "https://i.pravatar.cc/300?img=2" },
      { name: "Lê Thị C", avatar: "https://i.pravatar.cc/300?img=4" },
    ],
  },
];

const GroupList = () => {
  return (
    <div className="group-list-wrapper"> {/* Wrapping div */}
      <div className="ListFriend__header">
          <FaUsers />
          <span>Danh sách nhóm và cộng đồng</span>
      </div>
    



        <Container fluid className="p-3">


        {/* Danh sách nhóm */}
        <div className="group-list">
          {groups.map((item, index) => (
            <Row
              key={index}
              className="align-items-center justify-content-between py-2 border-bottom"
            >
              {/* Avatar nhóm hoặc thành viên */}
              <Col xs="auto">
                <div
                  className="overflow-hidden"
                  style={{ width: "48px", height: "48px" }}
                >
                  {item.isGroup ? (
                    <div className="d-flex flex-wrap">
                      {item.members.slice(0, 4).map((member, index) => (
                        <img
                          key={index}
                          src={member.avatar}
                          alt=""
                          className="rounded-circle"
                          style={{ width: "24px", height: "24px" }}
                        />
                      ))}
                    </div>
                  ) : (
                    <img
                      src={item.avatar}
                      alt=""
                      className="rounded-circle img-fluid object-fit-cover"
                    />
                  )}
                </div>
              </Col>

              {/* Thông tin nhóm */}
              <Col>
                <div className="fw-bold">{item.name}</div>
                <div className="text-muted small">
                  {item.members.length} thành viên
                </div>
              </Col>

              {/* Menu */}
              <Col xs="auto">
                <BsThreeDots role="button" />
              </Col>
            </Row>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default GroupList;
