import React, { useMemo, useState, useEffect } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import useFriend from "../../hooks/useFriend";
import useConversation from "../../hooks/useConversation";
import { useDashboardContext } from "../../context/Dashboard_context";
import { toast } from "react-toastify";

const CreateGroupModal = ({ isOpen, onClose }) => {
  const [groupName, setGroupName] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { currentUser, currentChatUser } = useDashboardContext();
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedTag, setSelectedTag] = useState("Tất cả");

  const { friendList, isLoadingFriends } = useFriend();

  const { createGroupConversation, isCreatingGroupConversation } =
    useConversation();

  useEffect(() => {
    if (isOpen && currentChatUser && currentChatUser.id) {
      // Kiểm tra xem người dùng đã được chọn chưa
      setSelectedMembers((prevSelected) => {
        if (!prevSelected.includes(currentChatUser.id)) {
          return [...prevSelected, currentChatUser.id];
        }
        return prevSelected;
      });
    }
  }, [isOpen, currentChatUser]);

  useEffect(() => {
    console.log("Selected members (updated):", selectedMembers);
  }, [selectedMembers]);

  const friends = useMemo(() => {
    if (isLoadingFriends) return [];
    return friendList?.response || [];
  }, [isLoadingFriends, friendList]);

  // Lọc danh sách bạn bè dựa trên từ khóa tìm kiếm
  const filteredFriends = useMemo(() => {
    if (!searchTerm) return friends;
    return friends.filter(
      (friend) =>
        friend.displayName &&
        friend.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [friends, searchTerm]);

  const toggleMember = (userId) => {
    setSelectedMembers((prevSelected) => {
      // Nếu userId đã được chọn, bỏ chọn nó; nếu chưa được chọn, thêm vào danh sách đã chọn
      if (prevSelected.includes(userId)) {
        return prevSelected.filter((id) => id !== userId);
      } else {
        return [...prevSelected, userId];
      }
    });
  };

  const handleCreateGroup = () => {
    if (!groupName || selectedMembers.length === 0) return;
    const groupData = {
      name: groupName,
      member_id: selectedMembers.filter((id) => id !== currentUser.id),
    };

    // Gọi API tạo nhóm với dữ liệu đã chọn
    createGroupConversation(groupData, {
      onSuccess: (data) => {
        toast.success("Tạo nhóm thành công!", {
          position: "top-right",
          autoClose: 500,
        });
        onClose(); // Close modal on success
      },
      onError: (error) => {
        toast.error(error.message || "Có lỗi xảy ra khi tạo nhóm");
      },
    });
  };

  return (
    <div className="create-group-modal">
      {/* Header */}
      <div className="modal-header d-flex justify-content-between align-items-center p-3 border-bottom">
        <h5 className="modal-title mb-0">Tạo nhóm</h5>
        <button
          type="button"
          className="btn-close"
          onClick={onClose}
          aria-label="Close"
        ></button>
      </div>

      {/* Body */}
      <div className="modal-body p-3">
        <Form>
          {/* Nhập tên nhóm */}
          <div className="d-flex align-items-center gap-3 mb-3">
            <div
              className="d-flex align-items-center justify-content-center object-fit-cover rounded-circle"
              style={{
                width: "50px",
                height: "50px",
                backgroundColor: "#f0f0f0",
                cursor: "pointer",
              }}
            >
              <i
                className="bi bi-camera"
                style={{ fontSize: "20px", color: "#4e5d78" }}
              ></i>
            </div>
            <Form.Control
              placeholder="Nhập tên nhóm..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="border-start-0"
              style={{
                borderLeft: "none",
                borderTop: "none",
                borderRight: "none",
                outline: "none",
                boxShadow: "none",
                borderRadius: "0",
              }}
            />
          </div>

          {/* Thanh tìm kiếm */}
          <InputGroup className="mb-3">
            <InputGroup.Text
              className={`bg-white border-end-0 rounded-start-pill ${
                isFocused ? "border-primary" : ""
              }`}
              style={{
                padding: "0.375rem 0.75rem",
                height: "38px",
              }}
            >
              <BsSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Nhập tên, số điện thoại, hoặc danh sách số điện thoại"
              className={`border-start-0 rounded-end-pill ${
                isFocused ? "border-primary" : ""
              }`}
              style={{
                outline: "none",
                boxShadow: "none",
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </InputGroup>

          {/* Bộ lọc */}
          <div className="d-flex flex-wrap gap-2 mb-3">
            {["Tất cả", "Bạn bè", "Trả lời sau"].map((tag, index) => (
              <Button
                key={index}
                variant={selectedTag === tag ? "primary" : "outline-secondary"}
                size="sm"
                onClick={() => setSelectedTag(tag)}
                className="rounded-pill"
              >
                {tag}
              </Button>
            ))}
          </div>

          {/* Số lượng thành viên đã chọn */}
          {selectedMembers.length > 0 && (
            <div className="selected-count mb-2">
              <span className="badge bg-primary rounded-pill">
                Đã chọn: {selectedMembers.length} thành viên
              </span>
              {selectedMembers.filter((id) => id !== currentUser.id).length <
                2 && (
                <div className="text-danger small mt-1">
                  Cần chọn ít nhất 2 thành viên khác ngoài bạn
                </div>
              )}
            </div>
          )}

          {/* Danh sách bạn bè */}
          <div className="friends-list">
            <strong className="d-block mb-2">Danh sách bạn bè</strong>
            <div className="overflow-auto" style={{ maxHeight: "300px" }}>
              {filteredFriends.map((user) => (
                <div
                  key={user.userId}
                  className="d-flex align-items-center py-2 border-bottom"
                >
                  <div className="me-2" onClick={(e) => e.stopPropagation()}>
                    <Form.Check
                      type="checkbox"
                      id={`check-${user.userId}`}
                      checked={selectedMembers.includes(user.userId)}
                      onChange={() => toggleMember(user.userId)}
                      className="me-2 px-2"
                    />
                  </div>
                  <div
                    className="d-flex align-items-center flex-grow-1"
                    onClick={() => toggleMember(user.userId)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={user.avatar}
                      alt={user.displayName}
                      className="rounded-circle me-2"
                      style={{ width: "32px", height: "32px" }}
                    />
                    <span>{user.displayName}</span>
                    {user.emoji && <span className="ms-2">{user.emoji}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Form>
      </div>

      {/* Footer */}
      <div className="modal-footer d-flex justify-content-end p-3 border-top">
        <Button
          variant="outline-secondary"
          onClick={onClose}
          className="me-2 rounded-pill"
        >
          Hủy
        </Button>
        <Button
          variant="primary"
          onClick={handleCreateGroup}
          disabled={
            !groupName ||
            selectedMembers.length === 0 ||
            isCreatingGroupConversation
          }
          className="rounded-pill"
        >
          {isCreatingGroupConversation ? "Đang tạo..." : "Tạo nhóm"}
        </Button>
      </div>
    </div>
  );
};

export default CreateGroupModal;
