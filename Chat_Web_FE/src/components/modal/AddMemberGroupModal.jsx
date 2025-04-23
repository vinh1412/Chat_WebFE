import React, { useMemo, useState, useEffect } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import useFriend from "../../hooks/useFriend";
import { useDashboardContext } from "../../context/Dashboard_context";

const AddMemberGroupModal = ({ isOpen, onClose }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedTag, setSelectedTag] = useState("Tất cả");

  const { currentUser } = useDashboardContext();
  const { friendList, isLoadingFriends } = useFriend();

  useEffect(() => {
    console.log("Selected members (updated):", selectedMembers);
  }, [selectedMembers]);

  const friends = useMemo(() => {
    if (isLoadingFriends) return [];
    return friendList?.response || [];
  }, [isLoadingFriends, friendList]);

const filteredFriends = useMemo(() => {
  if (!searchTerm) return friends;
  return friends.filter((friend) =>
    friend.displayName && friend.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );
}, [friends, searchTerm]);

  const toggleMember = (userId) => {
    setSelectedMembers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  return (
    <div className="create-group-modal">
      <div className="modal-header d-flex justify-content-between align-items-center p-3 border-bottom">
        <h5 className="modal-title mb-0">Thêm thành viên</h5>
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
          disabled={selectedMembers.length === 0}
          className="rounded-pill"
        >
          Thêm thành viên
        </Button>
      </div>
    </div>
  );
};

export default AddMemberGroupModal;
