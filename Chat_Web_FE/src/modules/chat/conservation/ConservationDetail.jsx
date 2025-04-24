import React, { useState } from "react";
import { useDashboardContext } from "../../../context/Dashboard_context";
import "bootstrap-icons/font/bootstrap-icons.css"; // Import Bootstrap Icons
import GroupSettingsForm from "./GroupSettingsForm";
import AddMemberGroupModal from "../../../../src/components/modal/AddMemberGroupModal";
import { leaveGroup } from "../../../services/ConversationService";
import { setShowConversation } from "../../../redux/slice/commonSlice";
import { useDispatch } from "react-redux";

const ConversationDetail = ({ conversationInfor }) => {
  console.log("conversationInfor: ", conversationInfor);
  const { currentUser, setShowAddMemberGroupModal } = useDashboardContext();
  const [showGroupSettings, setShowGroupSettings] = useState(false);
  const [showGroupBulletin, setShowGroupBulletin] = useState(true);
  const dispatch = useDispatch();

  // Handle out group
  const handleLeaveGroup = async (conversationId) => {
    const isConfirmed = window.confirm(
      "Bạn có chắc chắn muốn rời nhóm này không?"
    );
    if (isConfirmed) {
      try {
        const response = await leaveGroup(conversationId);
        console.log("Response leaveGroup data:", response.data);
        alert("Bạn đã rời nhóm thành công!");
        dispatch(setShowConversation(false));
      } catch (error) {
        console.error("Error leaving group:", error.message);
        alert("Lỗi khi rời nhóm. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div
      className="card shadow-sm h-100 "
      style={{ width: "100%", overflowY: "auto", height: "100%" }}
    >
      {conversationInfor.dissolved && (
        <div className="alert alert-warning mb-3 text-center">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Nhóm này đã bị giải tán
        </div>
      )}

      {showGroupSettings ? (
        <GroupSettingsForm
          onBack={() => setShowGroupSettings(false)}
          conversationId={conversationInfor?.id}
        />
      ) : (
        <>
          <div className=" card-header text-center">
            <h6 className="mb-0 ">Thông tin hội thoại</h6>
          </div>
          <div className="d-flex flex-column align-items-center mt-2">
            {conversationInfor.is_group ? (
              <div
                className="d-flex flex-wrap"
                style={{ width: "80px", height: "80px" }}
              >
                {conversationInfor.members.slice(0, 4).map((member, index) => (
                  <img
                    key={index}
                    src={member.avatar}
                    alt={`member-${index}`}
                    className="rounded-circle"
                    width={40}
                    height={40}
                    style={{
                      objectFit: "cover",
                      border: "4px solid gray",
                    }}
                  />
                ))}
              </div>
            ) : (
              <img
                src={
                  conversationInfor.members.find(
                    (member) => member.id !== currentUser.id
                  )?.avatar
                }
                alt="avatar"
                width={50}
                height={50}
                className="rounded-circle mb-2"
              />
            )}
            <h6 className="mb-0 mt-2 fs-5">
              {!conversationInfor.is_group
                ? conversationInfor.members.find(
                    (member) => member.id !== currentUser.id
                  ).display_name
                : conversationInfor.name}
            </h6>{" "}
            {/* Add name below the avatar */}
          </div>

          <div className="d-flex justify-content-center gap-3 my-2">
            <div className="d-flex flex-column align-items-center">
              <i className="bi bi-bell-slash"></i>
              <small className="text-center" style={{ fontSize: "13px" }}>
                Tắt thông báo
              </small>
            </div>

            <div className="d-flex flex-column align-items-center">
              <i className="bi bi-pin-angle fs-6"></i>
              <small className="text-center" style={{ fontSize: "13px" }}>
                Ghim hội thoại
              </small>
            </div>

            {/* gọi AddMemberGroupModal */}

            {conversationInfor.is_group ? (
              <div
                className="d-flex flex-column align-items-center"
                onClick={() => setShowAddMemberGroupModal(true)}
                style={{ cursor: "pointer" }}
              >
                <i className="bi bi-person-plus fs-6"></i>
                <small className="text-center" style={{ fontSize: "13px" }}>
                  Thêm thành viên
                </small>
              </div>
            ) : null}

            {!conversationInfor.is_group ? (
              <div className="d-flex flex-column align-items-center">
                <i className="bi bi-person-plus fs-6"></i>
                <small className="text-center" style={{ fontSize: "13px" }}>
                  Tạo nhóm trò chuyện
                </small>
              </div>
            ) : (
              <div
                className="d-flex flex-column align-items-center"
                onClick={() => setShowGroupSettings(true)}
                style={{ cursor: "pointer" }}
              >
                <i className="bi bi-gear fs-6"></i>
                <small className="text-center" style={{ fontSize: "13px" }}>
                  Quản lý nhóm
                </small>
              </div>
            )}
          </div>

          <div className="card-body">
            {/* dropdown bảng tin nhóm */}
            {conversationInfor.is_group && (
              <div className="mb-3">
                <div
                  className="d-flex align-items-center justify-content-between mb-2"
                  onClick={() => setShowGroupBulletin(!showGroupBulletin)}
                  style={{ cursor: "pointer" }}
                >
                  <h6 className="mb-0">Bảng tin nhóm</h6>
                  <i
                    className={`bi bi-chevron-${
                      showGroupBulletin ? "up" : "down"
                    }`}
                  ></i>
                </div>
                {showGroupBulletin && (
                  <>
                    <div className="d-flex align-items-center mb-3 mt-2">
                      <i className="bi bi-clock me-2"></i>
                      <span>Danh sách nhắc hẹn</span>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <i className="bi bi-file-earmark me-2"></i>
                      <span>Ghi chú, ghim, bình chọn</span>
                    </div>
                  </>
                )}
              </div>
            )}
            {!conversationInfor.is_group && (
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-clock me-2"></i>
                <span>Danh sách nhắc hẹn</span>
              </div>
            )}
            <hr />
            <div className="mb-3">
              <div
                className="d-flex align-items-center justify-content-between"
                onClick={() => {}}
              >
                <h6 className="mb-0">Ảnh/Video</h6>
                <i className="bi bi-chevron-down"></i>
              </div>
              <div>
                <small className="text-muted">
                  Chưa có Ảnh/Video được chia sẻ trong hội thoại này
                </small>
              </div>
            </div>
            <hr />
            <div className="mb-3">
              <div
                className="d-flex align-items-center justify-content-between"
                onClick={() => {}}
              >
                <h6 className="mb-0">File</h6>
                <i className="bi bi-chevron-down"></i>
              </div>
              <div>
                <small className="text-muted">
                  Chưa có File được chia sẻ trong hội thoại này
                </small>
              </div>
            </div>
            <hr />
            <div className="mb-3">
              <div
                className="d-flex align-items-center justify-content-between"
                onClick={() => {}}
              >
                <h6 className="mb-0">Link</h6>
                <i className="bi bi-chevron-down"></i>
              </div>
              <div>
                <small className="text-muted">
                  Chưa có Link được chia sẻ trong hội thoại này
                </small>
              </div>
            </div>
            <hr />
            <div>
              <div
                className="d-flex align-items-center justify-content-between"
                onClick={() => {}}
              >
                <h6 className="mb-0">Thiết lập bảo mật</h6>
                <i className="bi bi-chevron-down"></i>
              </div>
              <div>
                <div className="d-flex align-items-center mt-2">
                  <i className="bi bi-clock me-2"></i>
                  <span>
                    Tin nhắn tự xóa{" "}
                    <i className="bi bi-question-circle ms-1"></i>
                  </span>
                </div>
                <small className="text-muted ms-4">Không bao giờ</small>
                <div className="d-flex align-items-center mt-2">
                  <i className="bi bi-eye-slash me-2"></i>
                  <span>Ẩn trò chuyện</span>
                  <div className="form-check form-switch ms-auto">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckDefault"
                    />
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className="d-flex align-items-center mb-2">
              <i
                className="bi bi-exclamation-triangle me-2"
                style={{ color: "red" }}
              ></i>
              <span>Báo xấu</span>
            </div>
            {/* Xoá lịch sử trò chuyện */}
            <button className="btn p-0 d-flex align-items-left mt-2 w-100 fs-6 text-normal text-danger">
              <i className="bi bi-trash3 me-2" style={{ color: "red" }}></i>
              <span>Xóa lịch sử trò chuyện</span>
            </button>
            {/* Rời nhóm */}
            {conversationInfor.is_group && (
              <button
                className="btn p-0 d-flex align-items-left mt-2 w-100 fs-6 text-normal text-danger"
                onClick={() => handleLeaveGroup(conversationInfor.id)}
              >
                <i
                  className="bi bi-box-arrow-right me-2"
                  style={{ color: "red" }}
                ></i>
                <span>Rời nhóm</span>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ConversationDetail;
