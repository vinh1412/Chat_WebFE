import React, { useMemo, useState, useEffect } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import { toast } from "react-toastify";
import useFriend from "../../hooks/useFriend";
import { useDashboardContext } from "../../context/Dashboard_context";
// import useConversation from "../../hooks/useConversation";
import { addMemberToGroupService } from "../../services/ConversationService";
import useConversation from "../../hooks/useConversation";

const AddMemberGroupModal = ({
  isOpen,
  onClose,
  conversationInfor,
  onMembersChanged,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedTag, setSelectedTag] = useState("Tất cả");

  const { currentUser } = useDashboardContext();
  const { friendList, isLoadingFriends } = useFriend();
  const { conversation, addMemberToGroup } = useConversation(
    conversationInfor?.id
  );
  // const {conversation, ad}

  // useEffect(() => {
  //   console.log("conversationInfor:", conversationInfor);
  //   console.log("Group ID:", conversationInfor?.id);
  //   console.log("Members:", conversationInfor?.members);
  //   console.log("selectedMembers:", selectedMembers);
  // }, [conversationInfor, selectedMembers]);

  const friends = useMemo(() => {
    if (isLoadingFriends) return [];
    return friendList?.response || [];
  }, [isLoadingFriends, friendList]);

  const filteredFriends = useMemo(() => {
    if (!searchTerm) return friends;
    return friends.filter((friend) =>
      friend.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [friends, searchTerm]);

  const toggleMember = (userId) => {
    setSelectedMembers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  if (!conversationInfor) {
    return (
      <div
        className="create-group-modal"
        style={{ display: isOpen ? "block" : "none" }}
      >
        <div className="modal-header d-flex justify-content-between align-items-center p-3 border-bottom">
          <h5 className="modal-title mb-0">Lỗi: Không có thông tin nhóm</h5>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>
      </div>
    );
  }

  // xử lý thêm thành viên vào nhóm
  const handleAddMembers = async (conversationId, userId) => {
    addMemberToGroup.mutate(
      { conversationId: conversationInfor.id, userId: selectedMembers },
      {
        onSuccess: () => {
          // toast.success("Thêm thành viên vào nhóm thành công", {
          //   position: "top-right",
          //   autoClose: 500,
          // });
          setSelectedMembers([]);
          if (onMembersChanged) onMembersChanged();
          onClose();
        },
        onError: (error) => {
          console.error("Error adding member to group:", error);
          toast.error(error.message || "Không thể thêm thành viên vào nhóm");
        },
      }
    );
  };

  return (
    <div
      className="create-group-modal"
      style={{ display: isOpen ? "block" : "none" }}
    >
      <div className="modal-header d-flex justify-content-between align-items-center p-3 border-bottom">
        <div>
          <h5 className="modal-title mb-0">Thêm thành viên vào nhóm</h5>
          {conversationInfor?.name && (
            <div className="text-muted small">
              Tên nhóm: {conversationInfor?.name}
            </div>
          )}
        </div>
        <button
          type="button"
          className="btn-close"
          onClick={onClose}
          aria-label="Close"
        ></button>
      </div>

      <div className="modal-body p-3">
        <Form>
          <InputGroup className="mb-3">
            <InputGroup.Text
              className={`bg-white border-end-0 rounded-start-pill ${
                isFocused ? "border-primary" : ""
              }`}
            >
              <BsSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Nhập tên, số điện thoại, hoặc danh sách số điện thoại"
              className={`border-start-0 rounded-end-pill ${
                isFocused ? "border-primary" : ""
              }`}
              style={{ outline: "none", boxShadow: "none" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </InputGroup>

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

          {selectedMembers.length > 0 && (
            <div className="selected-count mb-2">
              <span className="badge bg-primary rounded-pill">
                Đã chọn: {selectedMembers.length} thành viên
              </span>
            </div>
          )}

          <div className="friends-list">
            <strong className="d-block mb-2">Danh sách bạn bè</strong>
            <div className="overflow-auto" style={{ maxHeight: "300px" }}>
              {filteredFriends.map((user) => {
                const isAlreadyMember = conversationInfor?.members?.some(
                  (m) => m.id === user.userId
                );

                return (
                  <div
                    key={user.userId}
                    className="d-flex align-items-center py-2 border-bottom"
                    style={{ opacity: isAlreadyMember ? 0.5 : 1 }}
                  >
                    <div className="me-2" onClick={(e) => e.stopPropagation()}>
                      <Form.Check
                        type="checkbox"
                        id={`check-${user.userId}`}
                        checked={selectedMembers.includes(user.userId)}
                        disabled={isAlreadyMember}
                        onChange={() => {
                          if (!isAlreadyMember) {
                            // console.log("Toggle (checkbox):", user.userId);
                            toggleMember(user.userId);
                          }
                        }}
                        className="me-2 px-2"
                      />
                    </div>
                    <div
                      className="d-flex align-items-center flex-grow-1"
                      onClick={() => {
                        if (!isAlreadyMember) {
                          console.log("Toggle (row):", user.userId);
                          toggleMember(user.userId);
                        }
                      }}
                      style={{
                        cursor: isAlreadyMember ? "not-allowed" : "pointer",
                      }}
                    >
                      <img
                        src={user.avatar}
                        alt={user.displayName}
                        className="rounded-circle me-2"
                        style={{ width: "32px", height: "32px" }}
                      />
                      <span
                        style={{
                          textDecoration: isAlreadyMember
                            ? "line-through"
                            : "none",
                        }}
                      >
                        {user.displayName}
                      </span>
                      {user.emoji && <span className="ms-2">{user.emoji}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Form>
      </div>

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
          onClick={handleAddMembers}
          className="rounded-pill"
          disabled={selectedMembers.length === 0}
        >
          Thêm thành viên
        </Button>
      </div>
    </div>
  );
};

export default AddMemberGroupModal;
