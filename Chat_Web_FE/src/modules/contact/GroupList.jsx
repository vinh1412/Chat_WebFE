import React, { useState, useEffect } from "react";
import { Container, Form, Row, Col } from "react-bootstrap";
import { BsThreeDots } from "react-icons/bs";
import {
  FaSearch,
  FaSortAlphaDown,
  FaFilter,
  FaCheck,
  FaUsers,
} from "react-icons/fa";
import { useDashboardContext } from "../../context/Dashboard_context";
import { getAllGroupConversationsByUserIdService } from "../../services/ConversationService";
import { toast } from "react-toastify";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import "../../assets/css/GroupList.css";
import { useDispatch } from "react-redux";
import {
  setSelectedConversation,
  setShowConversation,
} from "../../redux/slice/commonSlice";
import { setCurrentTab } from "../../redux/slice/chatSlice";
import { Modal, Button } from "react-bootstrap";
import { leaveGroup } from "../../services/ConversationService";

const GroupList = () => {
  const { currentUser } = useDashboardContext();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch group conversations on mount
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const conversations = await getAllGroupConversationsByUserIdService();
        setGroups(conversations);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching group conversations:", error.message);
        toast.error(error.message || "Lỗi khi tải danh sách nhóm");
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  // WebSocket for real-time updates
  useEffect(() => {
    if (!currentUser?.id) return;
    const SOCKET_URL =
      import.meta.env.VITE_WS_URL || "http://localhost:8080/ws";
    const socket = new SockJS(`${SOCKET_URL}`);
    const stompClient = Stomp.over(socket);
    stompClient.connect(
      {},
      () => {
        stompClient.subscribe(
          `/chat/create/group/${currentUser.id}`,
          (message) => {
            const updatedConversation = JSON.parse(message.body);
            if (updatedConversation.isGroup) {
              setGroups((prev) =>
                prev.some((c) => c.id === updatedConversation.id)
                  ? prev.map((c) =>
                      c.id === updatedConversation.id ? updatedConversation : c
                    )
                  : [...prev, updatedConversation]
              );
            }
          }
        );
      },
      (error) => {
        console.error("WebSocket connection error:", error);
        toast.error("Lỗi kết nối WebSocket");
      }
    );

    return () => {
      if (stompClient.connected) {
        stompClient.disconnect();
      }
    };
  }, [currentUser?.id]);

  // Thêm hàm xử lý khi click vào nhóm
  const handleGroupClick = (group) => {
    if (!group) return;
    dispatch(setSelectedConversation(group));
    dispatch(setShowConversation(true));
    dispatch(setCurrentTab("Chat"));

    console.log("Chuyển đến nhóm chat:", group.name);
  };

  const handleShowModal = (group) => {
    setSelectedGroup(group);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedGroup(null);
  };

  const handleLeaveGroup = async () => {
    if (!selectedGroup) return;
    const isConfirmed = window.confirm(
      `Bạn có chắc chắn muốn rời nhóm "${selectedGroup.name}" không?`
    );
    if (isConfirmed) {
      try {
        await leaveGroup(selectedGroup.id);
        toast.success(`Bạn đã rời nhóm: ${selectedGroup.name}`);
        setGroups((prev) => prev.filter((g) => g.id !== selectedGroup.id));
        handleCloseModal();
      } catch (error) {
        toast.error("Lỗi khi rời nhóm. Vui lòng thử lại.");
      }
    }
  };

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="group-list-wrapper">
      <div className="ListFriend__header">
        <FaUsers />
        <span>Danh sách nhóm và cộng đồng</span>
      </div>

      <div className="groupList__title">
        <h5 className="mb-3 fw-bold">Nhóm và cộng đồng ({groups.length})</h5>

        {/* Tìm kiếm & filter */}
        <Row className="g-2 mb-3">
          <Col xs={4}>
            <Form.Control
              type="text"
              placeholder="🔍 Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col xs={4}>
            <Form.Select>
              <option>Hoạt động (mới → cũ)</option>
              <option>Hoạt động (cũ → mới)</option>
              <option>A → Z</option>
            </Form.Select>
          </Col>
          <Col xs={4}>
            <Form.Select>
              <option>Tất cả</option>
              <option>Công việc</option>
              <option>Học tập</option>
            </Form.Select>
          </Col>
        </Row>
      </div>

      <Container fluid className="p-3">
        {/* Danh sách nhóm */}
        <div className="group-list">
          {loading ? (
            <p>Đang tải...</p>
          ) : filteredGroups.length === 0 ? (
            <p>Chưa có nhóm nào.</p>
          ) : (
            filteredGroups.map((item) => (
              <Row
                key={item.id}
                className="align-items-center justify-content-between py-2 border-bottom"
                style={{ cursor: "pointer" }}
              >
                {/* Avatar nhóm hoặc thành viên */}
                <Col
                  xs="auto"
                  onClick={() => handleGroupClick(item)}
                  style={{ cursor: "pointer" }}
                >
                  <div
                    className="overflow-hidden"
                    style={{ width: "48px", height: "48px" }}
                  >
                    {item.isGroup ? (
                      <div className="d-flex flex-wrap">
                        {item.members.slice(0, 4).map((member, index) => (
                          <img
                            key={index}
                            src={
                              member.avatar || "https://i.pravatar.cc/300?img=1"
                            }
                            alt={member.displayName}
                            className="rounded-circle"
                            style={{ width: "24px", height: "24px" }}
                            onError={(e) =>
                              (e.target.src = "https://i.pravatar.cc/300?img=1")
                            }
                          />
                        ))}
                      </div>
                    ) : (
                      <img
                        src={item.avatar || "https://i.pravatar.cc/300?img=1"}
                        alt={item.name}
                        className="rounded-circle img-fluid object-fit-cover"
                        onError={(e) =>
                          (e.target.src = "https://i.pravatar.cc/300?img=1")
                        }
                      />
                    )}
                  </div>
                </Col>

                {/* Thông tin nhóm */}
                <Col
                  onClick={() => handleGroupClick(item)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="fw-bold">{item.name}</div>
                  <div className="text-muted small">
                    {item.members.length} thành viên
                  </div>
                </Col>

                {/* Menu */}
                <Col xs="auto">
                  <BsThreeDots
                    role="button"
                    onClick={() => handleShowModal(item)}
                  />
                </Col>
              </Row>
            ))
          )}
        </div>
      </Container>

      {/* Modal xác nhận rời nhóm */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Rời nhóm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn rời nhóm <b>{selectedGroup?.name}</b> không?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleLeaveGroup}>
            Rời nhóm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GroupList;
