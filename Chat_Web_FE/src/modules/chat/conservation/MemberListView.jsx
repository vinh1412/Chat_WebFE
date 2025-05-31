import React, { useState, useRef, useEffect } from "react";
import { useDashboardContext } from "../../../context/Dashboard_context";
import {
  removeMember,
  getConversationByIdService,
} from "../../../services/ConversationService";
import { toast } from "react-toastify";
import AddMemberGroupModal from "../../../components/modal/AddMemberGroupModal";
import useConversation from "../../../hooks/useConversation";

const MemberListView = ({ conversationInfor, onBack, onMembersChanged }) => {
  const {
    currentUser,
    setShowAddMemberGroupModal,
    setConversationInfor,
    showAddMemberGroupModal,
  } = useDashboardContext();
  const [openMenuId, setOpenMenuId] = useState(null);
  const [members, setMembers] = useState(conversationInfor.members || []);
  const menuRef = useRef(null);

  const { conversation, removeMemberFromGroup } = useConversation(
    conversationInfor.id
  );

  // Cập nhật members khi conversationInfor thay đổi
  useEffect(() => {
    if (conversation?.members) {
      setMembers(conversation.members);
      setConversationInfor(conversation);
      if (onMembersChanged) onMembersChanged();
    }
  }, [conversation, setConversationInfor, onMembersChanged]);

  // Xử lý sự kiện click bên ngoài menu dropdown để đóng menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle dropdown menu for a member
  const toggleMenu = (memberId) => {
    setOpenMenuId(openMenuId === memberId ? null : memberId);
  };

  // Handle member removal
  const handleRemoveMember = async (conversationId, userId) => {
    removeMemberFromGroup.mutate(
      { conversationId, memberId: userId },
      {
        onSuccess: async () => {
          toast.success("Đã xóa thành viên khỏi nhóm", {
            position: "top-right",
            autoClose: 500,
          });
        },
        onError: (error) => {
          console.error("Error removing member:", error);
          toast.error(error.message || "Bạn không có quyền xóa thành viên", {
            position: "top-right",
            autoClose: 500,
          });
        },
      }
    );
  };

  // Khi thêm thành viên, mở modal
  const handleAddMember = () => {
    setShowAddMemberGroupModal(true);
    setConversationInfor(conversationInfor);
  };

  // Khi modal thêm thành viên đóng và có thêm thành viên mới, cập nhật lại danh sách
  const handleMembersChangedFromModal = () => {
    if (onMembersChanged) onMembersChanged();
  };

  return (
    <div
      className="card shadow-sm h-100"
      style={{ width: "100%", backgroundColor: "#fff", color: "black" }}
    >
      {/* Header */}
      <div className="d-flex align-items-center p-3 border-bottom">
        <button
          className="btn btn-link text-dark p-0 me-3"
          onClick={onBack}
          style={{ fontSize: "1.5rem" }}
        >
          <i className="bi bi-arrow-left"></i>
        </button>
        <h5 className="mb-0 text-center flex-grow-1">Thành viên</h5>
      </div>

      {/* Add member button */}
      <div className="px-3 py-2">
        <button
          className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center py-2"
          onClick={handleAddMember}
          style={{
            borderRadius: "8px",
            backgroundColor: "#dadada",
            color: "#000",
          }}
        >
          <i className="bi bi-person-plus me-2"></i>
          <span>Thêm thành viên</span>
        </button>
      </div>

      {/* Member list */}
      <div className="px-3 py-2">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="mb-0">Danh sách thành viên ({members.length})</h6>
          <button className="btn btn-link text-dark p-0">
            <i className="bi bi-three-dots fs-5"></i>
          </button>
        </div>

        {/* Members */}
        <div className="member-list">
          {members.map((member, index) => (
            <div
              key={index}
              className="d-flex align-items-center py-2 border-bottom border-secondary"
            >
              <img
                src={member.avatar}
                alt={member.display_name}
                className="rounded-circle me-2"
                width={40}
                height={40}
              />
              <div className="flex-grow-1">
                <div className="d-flex align-items-center">
                  <span className="fw-medium">
                    {member.id === currentUser.id ? "Bạn" : member.display_name}
                  </span>
                  {member.is_admin && (
                    <span className="ms-2 text-muted small">Trưởng nhóm</span>
                  )}
                </div>
              </div>
              {/* Chỉ show menu của thành viên */}
              {member.id !== currentUser.id && (
                <div className="position-relative">
                  <button
                    className="btn btn-link text-dark p-0"
                    onClick={() => toggleMenu(member.id)}
                  >
                    <i className="bi bi-three-dots fs-5"></i>
                  </button>

                  {/* Dropdown menu */}
                  {openMenuId === member.id && (
                    <div
                      ref={menuRef}
                      className="position-absolute end-0 bg-white shadow-sm rounded border py-1"
                      style={{
                        width: "150px",
                        zIndex: 100,
                        top: "100%",
                        right: 0,
                      }}
                    >
                      <button
                        className="dropdown-item text-start d-flex align-items-center"
                        onClick={() => {}}
                      >
                        <i className="bi bi-person-fill-up me-2"></i>
                        <span>Thêm phó nhóm</span>
                      </button>
                      <button
                        className="dropdown-item text-start text-danger d-flex align-items-center"
                        onClick={() =>
                          handleRemoveMember(conversationInfor.id, member.id)
                        }
                      >
                        <i className="bi bi-person-x me-2"></i>
                        <span>Xóa khỏi nhóm</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal thêm thành viên */}
      {showAddMemberGroupModal && (
        <AddMemberGroupModal
          conversationInfor={conversationInfor}
          onClose={() => setShowAddMemberGroupModal(false)}
          onMembersChanged={handleMembersChangedFromModal}
        />
      )}
    </div>
  );
};

export default MemberListView;
