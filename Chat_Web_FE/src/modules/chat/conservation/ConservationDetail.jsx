import React, { useState } from "react";
import { useDashboardContext } from "../../../context/Dashboard_context";
import "bootstrap-icons/font/bootstrap-icons.css";
import GroupSettingsForm from "./GroupSettingsForm";
import AddMemberGroupModal from "../../../../src/components/modal/AddMemberGroupModal";
import MemberListView from "./MemberListView";
import { leaveGroup } from "../../../services/ConversationService";
import { setShowConversation } from "../../../redux/slice/commonSlice";
import { useDispatch } from "react-redux";
import { Toast } from "react-bootstrap";
import { toast } from "react-toastify";
import { setIsSuccessSent } from "../../../redux/friendSlice";
import { findLinkGroupByConversationId } from "../../../services/ConversationService";
import { useEffect } from "react";
import { FaQrcode } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ConversationDetail = ({ conversationInfor }) => {
  console.log("conversationInfor:", conversationInfor);
  const { currentUser, setShowAddMemberGroupModal, setConversationInfor } =
    useDashboardContext();
  const [showGroupSettings, setShowGroupSettings] = useState(false);
  const [showGroupBulletin, setShowGroupBulletin] = useState(true);
  const [showMemberGroup, setShowMemberGroup] = useState(true);
  const [showMemberList, setShowMemberList] = useState(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  // lấy linkgroup theo conversationId
  const [groupLink, setGroupLink] = useState("");
  useEffect(() => {
    const fetchGroupLink = async () => {
      if (conversationInfor?.id && conversationInfor.is_group) {
        try {
          const link = await findLinkGroupByConversationId(
            conversationInfor.id
          );
          setGroupLink(link?.linkGroup || ""); // <-- CHỈ LẤY GIÁ TRỊ CHUỖI
        } catch (error) {
          console.error("Failed to fetch group link:", error.message);
        }
      }
    };

    fetchGroupLink();
  }, [conversationInfor]);

  //Show view member group
  if (showMemberList) {
    return (
      <MemberListView
        conversationInfor={conversationInfor}
        onBack={() => setShowMemberList(false)}
      />
    );
  }

  // Handle out group
  const handleLeaveGroup = async (conversationId) => {
    const isConfirmed = window.confirm(
      "Bạn có chắc chắn muốn rời nhóm này không?"
    );
    if (isConfirmed) {
      try {
        const response = await leaveGroup(conversationId);
        console.log("Response leaveGroup data:", response.data);
        toast.success("Bạn đã rời nhóm thành công!");
        dispatch(setShowConversation(false));
      } catch (error) {
        console.error("Error leaving group:", error.message);
        alert("Lỗi khi rời nhóm. Vui lòng thử lại.");
      }
    }
  };

  // Copy link group
  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Đã sao chép liên kết vào clipboard!");
      })
      .catch((err) => {
        console.error("Copy failed: ", err);
        toast.error("Không thể sao chép liên kết!");
      });
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
            </h6>
          </div>

          <div className="d-flex justify-content-center gap-3 my-2 align-items-center">
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

            {conversationInfor.is_group && (
              <div
                className="d-flex flex-column align-items-center"
                onClick={() => {
                  setShowAddMemberGroupModal(true);
                  setConversationInfor(conversationInfor); // Sửa tên hàm
                }}
                style={{ cursor: "pointer" }}
              >
                <i className="bi bi-person-plus fs-6"></i>
                <small className="text-center" style={{ fontSize: "13px" }}>
                  Thêm thành viên
                </small>
              </div>
            )}

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
            {/* Dropdown thành viên nhóm */}
            {conversationInfor.is_group && (
              <div className="mb-3">
                <div
                  className="d-flex align-items-center justify-content-between mb-2"
                  onClick={() => setShowMemberGroup(!showMemberGroup)}
                  style={{ cursor: "pointer" }}
                >
                  <h6 className="mb-0">Thành viên nhóm</h6>
                  <i
                    className={`bi bi-chevron-${
                      showMemberGroup ? "up" : "down"
                    }`}
                  ></i>
                </div>
                {showMemberGroup && (
                  <>
                    <div
                      className="d-flex align-items-center mb-3 mt-2"
                      onClick={() => setShowMemberList(true)}
                      style={{ cursor: "pointer" }}
                    >
                      <i className="bi bi bi-people me-2"></i>
                      <span>{conversationInfor.members.length} Thành viên</span>
                    </div>
                    <div className="d-flex align-items-center mb-3 bg-light rounded">
                      <i className="bi bi-link-45deg fs-5 me-2"></i>
                      <div className="d-flex justify-content-between w-100">
                        <div className="d-flex flex-column">
                          <span>Link tham gia nhóm</span>
                          <span className="text-primary">
                            {groupLink || "Chưa có link nhóm"}
                          </span>
                        </div>
                        <div className="ms-2">
                          <button
                            className="btn btn-sm p-0 me-2"
                            onClick={() => copyToClipboard(groupLink)}
                          >
                            <i className="bi bi-clipboard fs-5"></i>
                          </button>

                          <button className="btn btn-sm p-0">
                            <i className="bi bi-share fs-5"></i>
                          </button>
                          <button
                            className="btn btn-sm p-0 ms-2"
                            onClick={() => {
                              // Mở tab mới với URL của GroupQRCodePage
                              const url = `/group-qr-code/${
                                conversationInfor.id
                              }?groupName=${encodeURIComponent(
                                conversationInfor.name
                              )}&groupLink=${encodeURIComponent(groupLink)}`;
                              window.open(url, "_blank");
                            }}
                          >
                            <FaQrcode size={24} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
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
