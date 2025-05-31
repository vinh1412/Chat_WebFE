//Bao gồm list conservation và list option contact (danh sách lời mời kết bạn, danh sách bạn bè,....)

import React, { useState, useMemo, useEffect } from "react";
import { Container, Col, Row, Modal, Button, Nav, Form } from "react-bootstrap";
import { AiOutlineUserAdd, AiOutlineUsergroupAdd } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useDashboardContext } from "../../context/Dashboard_context";
import { setShowSearch } from "../../redux/slice/commonSlice";
import ItemConservation from "../chat/conservation/ItemConservation";
import ContactSideBar from "../contact/ContactSideBar";
import SearchSide from "../common/SearchSide";
import useConversation from "../../hooks/useConversation";
import { BsSearch, BsPinAngleFill } from "react-icons/bs";
import { toast } from "react-toastify";
import "../../assets/css/GroupBoard.css";
import Swal from "sweetalert2";
import {
  setSelectedConversation,
  setShowConversation,
} from "../../redux/slice/commonSlice";
import store from "../../redux/store";
import { getAllGroupConversationsByUserIdService } from "../../services/ConversationService";

const DashboardOptionList = () => {
  const dispatch = useDispatch();
  const currentTab = useSelector((state) => state.chat.currentTab);
  const showSearch = useSelector((state) => state.common.showSearch);
  const { setShowAddFriendModal, setShowCreateGroupModal } =
    useDashboardContext();
  const {
    conversations,
    isLoadingAllConversations,
    refetch,
    deleteConversationForUser,
  } = useConversation();
  // console.log("conversations----------", conversations);

  const [openMenuId, setOpenMenuId] = useState(null);
  const [pinnedIds, setPinnedIds] = useState([]);

  const [showJoinGroupModal, setShowJoinGroupModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [availableGroups, setAvailableGroups] = useState([]);
  const [activeTab, setActiveTab] = useState("Tất cả");
  const selectedConversation = useSelector(
    (state) => state.common.selectedConversation
  );

  const handleMenuToggle = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleCloseMenu = () => setOpenMenuId(null);

  // Toggle ghim/bỏ ghim với giới hạn 3
  const handlePinConversation = (id) => {
    if (pinnedIds.includes(id)) {
      // Bỏ ghim
      setPinnedIds((prev) => prev.filter((pid) => pid !== id));
      // toast.success("Đã bỏ ghim cuộc trò chuyện");
    } else {
      // Ghim mới, kiểm tra giới hạn
      if (pinnedIds.length >= 3) {
        toast.warn("Bạn chỉ có thể ghim tối đa 3 cuộc trò chuyện.");
        return;
      }
      setPinnedIds((prev) => [id, ...prev]);
      // toast.success("Đã ghim cuộc trò chuyện");
    }
    setOpenMenuId(null);
  };

  // Sắp xếp: hội thoại ghim lên đầu
  const sortedConversations = conversations
    ? [
        ...conversations.filter((c) => pinnedIds.includes(c.id)),
        ...conversations.filter((c) => !pinnedIds.includes(c.id)),
      ]
    : [];

  // Hiển thị modal tham gia nhóm
  const handleShowJoinGroupModal = () => {
    setShowJoinGroupModal(true);
    fetchAvailableGroups(); // Lấy danh sách nhóm khi mở modal
  };

  const handleCloseJoinGroupModal = () => {
    setShowJoinGroupModal(false);
    setSearchTerm("");
    setSelectedGroups([]);
  };

  // Fetch danh sách nhóm khả dụng
  const fetchAvailableGroups = async () => {
    try {
      const groups = await getAllGroupConversationsByUserIdService();
      setAvailableGroups(groups);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách nhóm: " + error.message);
    }
  };

  // Xử lý tham gia nhóm
  // const handleJoinGroups = async () => {
  //   if (selectedGroups.length === 0) {
  //     toast.warn("Vui lòng chọn ít nhất một nhóm để tham gia.");
  //     return;
  //   }

  //   try {
  //     // Giả định API để tham gia nhóm (cần triển khai backend)
  //     await Promise.all(selectedGroups.map((groupId) => joinGroup(groupId)));
  //     toast.success("Đã gửi yêu cầu tham gia nhóm thành công!");
  //     refetch(); // Làm mới danh sách hội thoại
  //     handleCloseJoinGroupModal();
  //   } catch (error) {
  //     toast.error("Lỗi khi tham gia nhóm: " + error.message);
  //   }
  // };

  // Lọc nhóm theo tab và tìm kiếm
  const filteredGroups = useMemo(() => {
    let filtered = [...availableGroups];
    if (activeTab !== "Tất cả") {
      filtered = filtered.filter((group) => {
        const tabMap = {
          "Gia đình": "family",
          "Bạn bè": "friend",
        };
        return group.category === tabMap[activeTab];
      });
    }
    if (searchTerm) {
      filtered = filtered.filter((group) =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [availableGroups, activeTab, searchTerm]);

  // Thêm hàm xử lý xóa hội thoại
  const handleDeleteConversation = (conversation) => {
    Swal.fire({
      title: "Xác nhận xóa hội thoại",
      text: `Bạn có chắc chắn muốn xóa hội thoại với "${conversation.name}" không?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteConversationForUser(conversation.id, {
          onSuccess: () => {
            // Nếu đang xem cuộc hội thoại bị xóa, quay về màn hình chính
            const currentSelectedConversationId =
              store.getState().common.selectedConversation?.id;

            if (conversation.id === currentSelectedConversationId) {
              dispatch(setSelectedConversation(null));
              dispatch(setShowConversation(false));
            }

            // Đóng menu dropdown
            setOpenMenuId(null);
          },
          onError: (error) => {
            console.error("Lỗi khi xóa hội thoại:", error);
          },
        });
      }
    });
  };
  useEffect(() => {
    if (openMenuId !== null) {
      const handleClickOutside = (e) => {
        // Nếu click không phải vào dấu ba chấm hoặc menu dropdown thì đóng menu
        if (
          !e.target.closest(".conversation-menu-dropdown") &&
          !e.target.closest(".bi-three-dots-vertical")
        ) {
          setOpenMenuId(null);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [openMenuId]);

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
              className="w-100 border border-top-0 p-0"
              style={{
                height: "calc(100vh - 69px)",
                maxHeight: "calc(100vh - 69px)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                className="conversation-list-scroll"
                style={{
                  overflowY: "auto",
                  overflowX: "hidden",
                  flex: "1 1 auto",
                  height: "100%",
                }}
              >
                {sortedConversations?.map((item) => (
                  <div
                    key={item.id}
                    className={`d-flex align-items-center justify-content-between position-relative ${
                      selectedConversation?.id === item.id
                        ? "active-conversation"
                        : ""
                    }`}
                    style={{
                      minHeight: 56,
                      height: 72, // Fixed height for consistency
                      backgroundColor:
                        selectedConversation?.id === item.id
                          ? "#e9f5ff"
                          : "transparent",
                      transition: "background-color 0.2s ease",
                      width: "100%",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      className="d-flex align-items-center"
                      style={{ width: "calc(100% - 40px)", overflow: "hidden" }}
                    >
                      {/* Hiển thị icon ghim nếu đã ghim */}
                      {pinnedIds.includes(item.id) && (
                        <BsPinAngleFill
                          color="#f7b731"
                          style={{ marginRight: 8, flexShrink: 0 }}
                        />
                      )}
                      <ItemConservation
                        item={item}
                        isActive={selectedConversation?.id === item.id}
                      />
                    </div>
                    <span
                      className="bi bi-three-dots-vertical"
                      style={{
                        cursor: "pointer",
                        padding: 8,
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        flexShrink: 0,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMenuToggle(item.id);
                      }}
                    />
                    {openMenuId === item.id && (
                      <div
                        className="shadow rounded bg-white conversation-menu-dropdown"
                        style={{
                          position: "fixed", // Đổi từ absolute sang fixed để nổi lên trên mọi thứ
                          top: `${
                            72 *
                              sortedConversations.findIndex(
                                (c) => c.id === item.id
                              ) +
                            90
                          }px`, // 69 là chiều cao header, 72 là chiều cao mỗi item
                          left: "25%",
                          zIndex: 99999,
                          minWidth: 200,
                          background: "#fff",
                          boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                          pointerEvents: "auto",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div
                          className="px-3 py-2"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            handlePinConversation(item.id);
                            handleCloseMenu();
                          }}
                        >
                          {pinnedIds.includes(item.id)
                            ? "Bỏ ghim hội thoại"
                            : "Ghim hội thoại"}
                        </div>
                        {!item.is_group && (
                          <div
                            className="px-3 py-2"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              handleShowJoinGroupModal(item.id);
                              handleCloseMenu();
                            }}
                          >
                            Thêm vào nhóm
                          </div>
                        )}
                        <hr className="my-1" />
                        <div
                          className="px-3 py-2 text-danger"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            handleDeleteConversation(item);
                            handleCloseMenu();
                          }}
                        >
                          Xóa hội thoại
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Container>
          )}

          {currentTab === "Contact" && <ContactSideBar />}
        </>
      ) : (
        <SearchSide />
      )}

      {/* Modal tham gia nhóm */}
      <Modal
        show={showJoinGroupModal}
        onHide={handleCloseJoinGroupModal}
        centered
        size="xl" // Sử dụng size "xl" (khoảng 1140px mặc định)
        // dialogClassName="custom-modal-width" // Áp dụng CSS tùy chỉnh
        className="modal-dialog-centered"
      >
        <Modal.Header closeButton>
          <Modal.Title>Mời tham gia nhóm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Tìm nhóm theo tên"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-3"
            style={{ borderRadius: 20 }}
          />
          <Nav variant="tabs" activeKey={activeTab} onSelect={setActiveTab}>
            <Nav.Item>
              <Nav.Link eventKey="Tất cả">Tất cả</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="Gia đình">Gia đình</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="Bạn bè">Bạn bè</Nav.Link>
            </Nav.Item>
          </Nav>
          <div
            className="mt-3"
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            {filteredGroups.map((group) => (
              <Row
                key={group.id}
                className="align-items-center py-2 border-bottom"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setSelectedGroups((prev) =>
                    prev.includes(group.id)
                      ? prev.filter((id) => id !== group.id)
                      : [...prev, group.id]
                  );
                }}
              >
                <Col xs="auto">
                  <input
                    type="checkbox"
                    checked={selectedGroups.includes(group.id)}
                    onChange={() => {}}
                    style={{ marginRight: 8 }}
                  />
                </Col>
                <Col xs="auto">
                  <div
                    className="d-flex flex-wrap"
                    style={{ width: 40, height: 40, overflow: "hidden" }}
                  >
                    {group.members.slice(0, 4).map((member, index) => (
                      <img
                        key={index}
                        src={member.avatar || "https://i.pravatar.cc/300?img=1"}
                        alt={member.displayName}
                        className="rounded-circle"
                        style={{ width: 20, height: 20 }}
                        onError={(e) =>
                          (e.target.src = "https://i.pravatar.cc/300?img=1")
                        }
                      />
                    ))}
                  </div>
                </Col>
                <Col>
                  <div className="fw-bold">{group.name}</div>
                  <div className="text-muted small">
                    {group.members.length} thành viên
                  </div>
                </Col>
              </Row>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseJoinGroupModal}>
            Hủy
          </Button>
          <Button variant="primary">Mời</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DashboardOptionList;
