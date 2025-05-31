import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import {
  setShowConversation,
  setSelectedConversation,
} from "../../../redux/slice/commonSlice";
import { useDispatch } from "react-redux";
import formatTime from "../../../utils/FormatTime";
import { useDashboardContext } from "../../../context/Dashboard_context";

const ItemConservation = ({ item, isActive }) => {
  const dispatch = useDispatch();

  const { currentUser, fetchUser } = useDashboardContext();

  // console.log("Item Conservation", item.is_group);
  // console.log("SelectedConversationId", setSelectedConversation(item.id));

  // Hàm xử lý khi click vào item
  const handleClick = () => {
    console.log(item);
    // Gọi action để cập nhật state selectedConversationId với id của cuộc trò chuyện hiện tại
    dispatch(setSelectedConversation(item));
    // Gọi action để cập nhật state showConversation thành true để hiển thị conversation
    dispatch(setShowConversation(true));
  };

  // Lấy avatar đúng cho cuộc trò chuyện
  let displayAvatar = item.avatar;
  if (!item.is_group && item.members) {
    // Nếu là cuộc trò chuyện 1-1, tìm người còn lại
    const otherMember = item.members.find(
      (member) => member.id !== currentUser.id
    );
    displayAvatar = otherMember?.avatar || item.avatar;
  }

  return (
    <Row
      key={item.id}
      className={`g-0 pt-2 ${isActive ? "active-conversation" : ""}`}
      style={{
        cursor: "pointer",
        height: "72px",
        display: "flex",
        alignItems: "center",
        backgroundColor: isActive ? "#e9f5ff" : "transparent",
      }}
      onClick={handleClick}
    >
      <Col className="d-flex align-items-center p-2">
        <div
          className="d-flex align-items-center"
          style={{ gap: "12px", overflow: "hidden" }}
        >
          {/* Avatar */}
          <div style={{ width: "48px", height: "48px", position: "relative" }}>
            {item.is_group ? (
              <div
                className="d-flex flex-wrap"
                style={{ width: "48px", height: "48px" }}
              >
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
                src={displayAvatar}
                alt=""
                className="rounded-circle img-fluid object-fit-cover"
                style={{ width: "48px", height: "48px" }}
              />
            )}
          </div>

          {/* Name and Last Message */}
          <div className="d-flex flex-column justify-content-center">
            <div
              style={{
                fontSize: "1.1rem",
                fontWeight: isActive ? "600" : "500",
                color: isActive ? "#1877f2" : "inherit",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "150px",
              }}
            >
              {!item.is_group
                ? item.members.find((member) => member.id !== currentUser.id)
                    ?.display_name
                : item.name}
            </div>
            <div
              className="text-muted"
              style={{
                fontSize: "0.9rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "180px",
              }}
            >
              {item.last_message?.senderId === currentUser.id
                ? `Bạn: ${item.last_message.content}`
                : item.last_message?.content}
            </div>
          </div>
        </div>
      </Col>

      {/* Thời gian */}
      <Col
        xs="auto"
        className="d-flex flex-column justify-content-center p-2"
        style={{ fontSize: "0.8rem" }}
      >
        <div className="text-muted">{formatTime(item.created_at)}</div>
      </Col>
    </Row>
  );
};

export default ItemConservation;
