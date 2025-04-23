//Bao gồm list conservation và list option contact (danh sách lời mời kết bạn, danh sách bạn bè,....)

import React from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import { AiOutlineUserAdd, AiOutlineUsergroupAdd } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useDashboardContext } from "../../context/Dashboard_context";
import { setShowSearch } from "../../redux/slice/commonSlice";
import ItemConservation from "../chat/conservation/ItemConservation";
import ContactSideBar from "../contact/ContactSideBar";
import SearchSide from "../common/SearchSide";
import useConversation from "../../hooks/useConversation";

const DashboardOptionList = () => {
  const dispatch = useDispatch();
  const currentTab = useSelector((state) => state.chat.currentTab);
  const showSearch = useSelector((state) => state.common.showSearch);
  const { setShowAddFriendModal, setShowCreateGroupModal } =
    useDashboardContext();
  const { conversations, isLoadingAllConversations } = useConversation(); // Lấy danh sách cuộc trò chuyện từ hook useConversation
  console.log("conversations----------", conversations);

  return (
    <Container
      fluid
      className="d-flex flex-column p-0 border-end"
      style={{ width: "344px", minHeight: "100vh" }}
    >
      {!showSearch ? (
        <>
          {/* Header Search*/}
          <Container
            fluid
            className="d-flex align-items-center justify-content-between p-3 w-100 border-bottom"
          >
            <Row
              className="g-0 rounded-2"
              style={{ backgroundColor: "#E5E7EB" }}
              onClick={() => dispatch(setShowSearch(true))}
            >
              <Col xs="auto" className="d-flex align-items-center ps-2">
                <BsSearch />
              </Col>
              <Col className="flex-grow-1">
                <input
                  type="text"
                  className="form-control bg-transparent border-0 rounded-1"
                  placeholder="Tìm kiếm"
                />
              </Col>
            </Row>
            <Row className="d-flex align-items-center">
              <Col>
                <AiOutlineUserAdd
                  role="button"
                  size={24}
                  onClick={(e) => {
                    e.stopPropagation(); // Ngăn chặn sự kiện lan rộng
                    setShowAddFriendModal(true);
                  }}
                />
              </Col>
              <Col className="">
                <AiOutlineUsergroupAdd
                  role="button"
                  size={24}
                  onClick={(e) => {
                    e.stopPropagation(); // Ngăn chặn sự kiện lan rộng
                    setShowCreateGroupModal(true);
                  }}
                />
              </Col>
            </Row>
          </Container>

          {currentTab === "Chat" && (
            <Container
              fluid
              className="w-100 border border-top-0 overflow-auto "
              style={{ maxHeight: "calc(100vh - 56px)" }}
            >
              {isLoadingAllConversations ? (
                <div className="text-center mt-3">Đang tải...</div>
              ) : (
                conversations?.map((item) => (
                  <ItemConservation key={item.id} item={item} />
                ))
              )}
            </Container>
          )}

          {currentTab === "Contact" && <ContactSideBar />}
        </>
      ) : (
        <SearchSide />
      )}
    </Container>
  );
};

export default DashboardOptionList;
