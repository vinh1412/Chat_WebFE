//Bao gồm list conservation và list option contact (danh sách lời mời kết bạn, danh sách bạn bè,....)

import React from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import { AiOutlineUserAdd, AiOutlineUsergroupAdd } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useDashboardContext } from "../../context/Dashboard_context";
import ItemConservation from "../chat/conservation/ItemConservation";
import ContactSideBar from "../contact/ContactSideBar";

const conservationData = [
    {
      id: "1",
      name: "Nguyễn Văn A",
      message: "Bạn có khỏe không?",
      time: "10:30",
      avatar: "https://i.pravatar.cc/300?img=1",
      category: "priority",
      isGroup: false,
    },
    {
      id: "2",
      name: "Trần Văn B",
      message: "Đi nhậu không?",
      time: "08:15",
      avatar: "https://i.pravatar.cc/300?img=2",
      category: "other",
      isGroup: false,
    },
    {
      id: "3",
      name: "Đinh Văn C",
      message: "Làm gì đấy",
      time: "21:30",
      avatar: "https://i.pravatar.cc/300?img=1",
      category: "priority",
      isGroup: false,
    },
    {
      id: "4",
      name: "Phan Văn Teo",
      message: "Hello",
      time: "07:15",
      avatar: "https://i.pravatar.cc/300?img=2",
      category: "priority",
      isGroup: false,
    },
  
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
    }
  ];

const DashboardOptionList = () => {
  const dispatch = useDispatch();
  const currentTab = useSelector((state) => state.chat.currentTab);
  const { setShowAddFriendModal } = useDashboardContext();
  
  return (
    <Container
      fluid
      className="d-flex flex-column p-0 border-end"
      style={{ width: "344px", minHeight: "100vh" }}
    >
      {/* Search */}
      <Container
        fluid
        className="d-flex align-items-center justify-content-between p-3 w-100 border-bottom"
      >
        <Row className="g-0 rounded-2" style={{backgroundColor: '#E5E7EB'}}>
          <Col xs="auto" className="d-flex align-items-center ps-2">
            <BsSearch />
          </Col>
          <Col className="flex-grow-1">
            <input type="text" className="form-control bg-transparent border-0 rounded-1" placeholder="Tìm kiếm"  />
          </Col>
        </Row>
        <Row  className="d-flex align-items-center">
          <Col>
            <AiOutlineUserAdd 
              role="button" 
              size={24} onClick={(e) => {
                e.stopPropagation(); // Ngăn chặn sự kiện lan rộng
                setShowAddFriendModal(true);
             }}
          />

          </Col>
          <Col className="">
            <AiOutlineUsergroupAdd role="button" size={24} />
          </Col>
        </Row>
      </Container>

      {/* List conservation */}
      {currentTab === "Chat" && (
        <Container fluid className="w-100 border border-top-0 overflow-auto " style={{maxHeight: 'calc(100vh - 56px'}}>
            {conservationData.map((item) => (
                <ItemConservation key={item.id} item={item} />
            ))}
        </Container>
      )}

     {/* List option contact */}
      {currentTab === "Contact" && <ContactSideBar />}
    </Container>
  );
};

export default DashboardOptionList;
