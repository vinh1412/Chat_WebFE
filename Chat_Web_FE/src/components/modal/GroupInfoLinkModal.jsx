import React, { useEffect, useState } from "react";
import "../../assets/css/GroupInfoModal.css";
import { getGroupMembersService } from "../../services/MemberService";
import { addMemberToGroupService } from "../../services/ConversationService";
import useUser from "../../hooks/useUser";
import { useDashboardContext } from "../../context/Dashboard_context";
import { toast } from "react-toastify"; // nếu dùng toast thông báo

const GroupInfoModal = ({ onClose, onJoin, groupLink }) => {
  const { currentUser, fetchUser, setCurrentUser } = useDashboardContext();
  const { updateUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const conversationId = groupLink;

  useEffect(() => {
    if (!conversationId) {
      setError("Không tìm thấy conversationId");
      setLoading(false);
      return;
    }

    getGroupMembersService(conversationId)
      .then((data) => {
        setMembers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Lỗi khi tải danh sách thành viên");
        setLoading(false);
      });
  }, [conversationId]);

  const adminUser = members.find((member) => member.role === "ADMIN");

const handleAddMember = async () => {
  if (!currentUser || !conversationId) return;

  // Kiểm tra đã tham gia chưa
  const alreadyJoined = currentUser.conversations?.includes(conversationId);

  if (alreadyJoined) {
    toast.info("Bạn đã tham gia group này rồi!");
    return;
  }

  setIsLoading(true);
  try {
    const response = await addMemberToGroupService(conversationId, currentUser.id);
    console.log("Tham gia nhóm thành công:", response);

    await fetchUser();
    setCurrentUser((prev) => ({
      ...prev,
      conversations: [...(prev.conversations || []), conversationId],
    }));

    // Cập nhật lại danh sách thành viên sau khi thêm
    const updatedMembers = await getGroupMembersService(conversationId);
    setMembers(updatedMembers);

    toast.success("Bạn đã tham gia group thành công!");

    onJoin();
    // reload page hoặc thực hiện hành động khác nếu cần
    setTimeout(() => {
      window.location.reload(); // sau 5s để đảm bảo cập nhật UI
    }, 5000);

  } catch (error) {
    console.error("Lỗi khi thêm thành viên vào nhóm:", error);
    toast.error("Tham gia group thất bại. Vui lòng thử lại.");
  } finally {
    setIsLoading(false);
  }
};
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h2 className="modal-title">Thông tin nhóm</h2>

        {loading && <p>Đang tải danh sách thành viên...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && (
          <>
            <div className="avatar-group">
              {members.slice(0, 3).map((member) => (
                <img
                  key={member.id}
                  src={member.avatar}
                  alt={member.display_name}
                  className="avatar"
                  title={member.display_name}
                />
              ))}
              {members.length > 3 && (
                <span style={{ fontSize: "1.2rem", marginLeft: 8 }}>
                  +{members.length - 3}
                </span>
              )}
            </div>

            <h3 className="group-name">Tên nhóm</h3>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <div className="group-info">
                {adminUser ? (
                  <>
                    {members.length} thành viên &nbsp;•&nbsp; Tạo bởi{" "}
                    <a href={`/user/${adminUser.id}`}>{adminUser.display_name}</a>
                  </>
                ) : (
                  <>Chưa xác định người tạo</>
                )}
              </div>
            </div>

            <div
              style={{ borderBottom: "1px solid #848484", margin: "16px 0" }}
            />

            <p
              style={{
                wordBreak: "break-word",
                color: "#1877f2",
                cursor: "pointer",
              }}
              onClick={() => window.open(groupLink, "_blank")}
              title="Mở link nhóm"
            >
              {groupLink}
            </p>

            <p className="waiting-text">
              Bạn đang ở phòng chờ. Hãy tham gia chat để cùng trò chuyện với mọi
              người trong nhóm.
            </p>

            <div className="avatar-mini-group">
              {members.map((member) => (
                <img
                  key={member.id}
                  src={member.avatar}
                  alt={member.display_name}
                  className="avatar-mini"
                  title={member.display_name}
                />
              ))}
            </div>
          </>
        )}

        <div style={{ borderBottom: "1px solid #848484", margin: "16px 0" }} />

        <div className="modal-buttons">
          <button className="btn-close" onClick={onClose}>
            Đóng
          </button>
          <button className="btn-join" onClick={handleAddMember} disabled={isLoading}>
            {isLoading ? "Đang tham gia..." : "Tham gia"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupInfoModal;
