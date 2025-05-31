import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  setSelectedConversation,
  setShowConversation,
} from "../../../redux/slice/commonSlice";
import { Modal, Button } from "react-bootstrap";
import useConversation from "../../../hooks/useConversation";
import useMember from "../../../hooks/useMember";
import LeaderManagementForm from "./LeaderManagementForm";
import { restrictMessagingService } from "../../../services/ConversationService"; // Import API

const GroupSettingsForm = ({ onBack, conversationId }) => {
  const [showDissolveModal, setShowDissolveModal] = useState(false);
  const { dissolveConversation, isDissolvingConversation } = useConversation();
  const dispatch = useDispatch();
  const { userRole, isLoadingUserRole, members } = useMember(conversationId);

  const [showLeaderForm, setShowLeaderForm] = useState(false);
  const [restrictMessaging, setRestrictMessaging] = useState(false); // State cho toggle

  // Lấy selectedConversation từ Redux để lấy restrictMessagingToAdmin
  const selectedConversation = useSelector(
    (state) => state.common.selectedConversation
  );

  // Đồng bộ trạng thái restrictMessaging khi selectedConversation thay đổi
  useEffect(() => {
    if (selectedConversation?.id === conversationId) {
      setRestrictMessaging(
        selectedConversation.restrictMessagingToAdmin || false
      );
    }
  }, [selectedConversation, conversationId]);

  // Kiểm tra người dùng có quyền admin không
  const isAdmin = userRole?.role === "ADMIN";

  const handleDissolveClick = () => {
    setShowDissolveModal(true);
  };

  // Hàm xử lý khi người dùng xác nhận giải tán nhóm
  const handleConfirmDissolve = () => {
    if (!isAdmin) return;
    dissolveConversation(conversationId, {
      onSuccess: async (data) => {
        toast.success("Nhóm đã được giải tán thành công", {
          position: "top-right",
          autoClose: 500,
        });
        setShowDissolveModal(false);
        onBack();
      },
      onError: (error) => {
        toast.error(error.message || "Có lỗi xảy ra khi giải tán nhóm");
        setShowDissolveModal(false);
      },
    });
  };

  // Hàm xử lý bật/tắt chế độ chỉ nhóm trưởng nhắn tin
  const handleToggleRestrictMessaging = async () => {
    if (!isAdmin) {
      toast.error("Chỉ admin mới có thể thay đổi cài đặt này");
      return;
    }
    const newRestrictState = !restrictMessaging;
    try {
      const response = await restrictMessagingService(
        conversationId,
        newRestrictState
      );
      setRestrictMessaging(newRestrictState);
      // Cập nhật Redux state
      dispatch(
        setSelectedConversation({
          ...selectedConversation,
          restrictMessagingToAdmin: newRestrictState,
        })
      );
      toast.success(
        newRestrictState
          ? "Chỉ trưởng nhóm được phép nhắn tin"
          : "Tất cả thành viên được phép nhắn tin",
        {
          position: "top-center",
          autoClose: 2000,
        }
      );
    } catch (error) {
      console.error("Error toggling messaging restriction:", error.message);
      toast.error("Lỗi khi cập nhật cài đặt nhắn tin: " + error.message, {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  const handleLeaderClick = () => {
    setShowLeaderForm(true);
  };

  const handleBackFromLeaderForm = () => {
    setShowLeaderForm(false);
  };

  if (isLoadingUserRole) {
    return (
      <div
        className="card p-3 d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (showLeaderForm) {
    return (
      <LeaderManagementForm
        onBack={handleBackFromLeaderForm}
        conversationId={conversationId}
        members={members}
      />
    );
  }

  return (
    <div
      className="card p-3"
      style={{
        height: "100vh",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <div className="d-flex align-items-center gap-2 mb-3 justify-content-between">
        <span style={{ cursor: "pointer" }} onClick={onBack}>
          <i className="bi bi-arrow-left-short fs-3"></i>
        </span>
        <div className="w-100 d-flex justify-content-center">
          <h6 className="mb-0 fs-5">Quản lý nhóm</h6>
        </div>
      </div>

      <div
        style={{
          opacity: isAdmin ? 1 : 0.7,
          pointerEvents: isAdmin ? "auto" : "none",
        }}
      >
        {!isAdmin && (
          <div className="bg-secondary text-center mb-2 text-white rounded-2 p-2">
            <i className="bi bi-file-earmark-lock2"></i> Tính năng này chỉ dành
            cho quản trị viên nhóm.
          </div>
        )}

        {/* Các checkbox quyền */}
        <div className="form-check mb-2">
          <input
            className="form-check-input"
            type="checkbox"
            defaultChecked
            id="changeName"
          />
          <label className="form-check-label" htmlFor="changeName">
            Thay đổi tên & ảnh đại diện của nhóm
          </label>
        </div>

        <div className="form-check mb-2">
          <input
            className="form-check-input"
            type="checkbox"
            defaultChecked
            id="pinMessages"
          />
          <label className="form-check-label" htmlFor="pinMessages">
            Ghim tin nhắn, ghi chú, bình chọn lên đầu hội thoại
          </label>
        </div>

        <div className="form-check mb-2">
          <input
            className="form-check-input"
            type="checkbox"
            defaultChecked
            id="newNote"
          />
          <label className="form-check-label" htmlFor="newNote">
            Tạo mới ghi chú, nhắc hẹn
          </label>
        </div>

        <div className="form-check mb-2">
          <input
            className="form-check-input"
            type="checkbox"
            defaultChecked
            id="createPoll"
          />
          <label className="form-check-label" htmlFor="createPoll">
            Tạo mới bình chọn
          </label>
        </div>

        {/* Thêm switch chỉ nhóm trưởng nhắn tin */}
        <div className="form-switch form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="restrictMessaging"
            checked={restrictMessaging}
            onChange={handleToggleRestrictMessaging}
          />
          <label className="form-check-label" htmlFor="restrictMessaging">
            Chỉ trưởng nhóm được gửi tin nhắn
          </label>
        </div>

        <hr className="border-5 rounded-1" />

        {/* Các switch khác */}
        <div className="form-switch form-check mb-2">
          <input
            className="form-check-input"
            type="checkbox"
            id="requireApproval"
          />
          <label className="form-check-label" htmlFor="requireApproval">
            Chế độ phê duyệt thành viên mới
          </label>
        </div>

        <div className="form-switch form-check mb-2">
          <input
            className="form-check-input"
            type="checkbox"
            defaultChecked
            id="markLeaderMessages"
          />
          <label className="form-check-label" htmlFor="markLeaderMessages">
            Đánh dấu tin nhắn từ trưởng/phó nhóm
          </label>
        </div>

        <div className="form-switch form-check mb-2">
          <input
            className="form-check-input"
            type="checkbox"
            defaultChecked
            id="newMemberAccess"
          />
          <label className="form-check-label" htmlFor="newMemberAccess">
            Cho phép thành viên mới đọc tin nhắn gần nhất
          </label>
        </div>

        {/* Chỉ hiển thị nếu là admin */}
        {isAdmin && (
          <div>
            <div className="form-switch form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                defaultChecked
                id="linkJoin"
              />
              <label className="form-check-label" htmlFor="linkJoin">
                Cho phép dùng link tham gia nhóm
              </label>
            </div>

            {/* Link tham gia nhóm */}
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                readOnly
                value="zalo.me/g/hcdimo839"
              />
              <button className="btn btn-outline-secondary">Sao chép</button>
            </div>

            <hr className="border-5 rounded-1" />

            <div className="mb-3">
              <button className="btn btn-light w-100 text-start mb-2 fs-6">
                <i className="bi bi-person-x me-2"></i> Chặn khỏi nhóm
              </button>
              <button
                className="btn btn-light w-100 text-start fs-6"
                onClick={handleLeaderClick}
              >
                <i className="bi bi-key me-2"></i> Trưởng & phó nhóm
              </button>
            </div>
          </div>
        )}

        {/* Chỉ hiển thị nút giải tán nhóm nếu là admin */}
        {isAdmin && (
          <>
            <hr className="border-5 rounded-1" />
            <div style={{ backgroundColor: "#f8d7da" }} className="rounded-2">
              <button
                className="btn btn-outline-danger w-100 fs-6"
                onClick={handleDissolveClick}
              >
                Giải tán nhóm
              </button>
            </div>
          </>
        )}

        {/* Modal xác nhận giải tán nhóm */}
        <Modal
          show={showDissolveModal}
          onHide={() => setShowDissolveModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Giải tán nhóm</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Mời tất cả mọi người rời nhóm và xóa tin nhắn? Nhóm đã giải tán sẽ
              KHÔNG THỂ khôi phục.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDissolveModal(false)}
            >
              Không
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDissolve}
              disabled={isDissolvingConversation}
            >
              {isDissolvingConversation ? "Đang xử lý..." : "Giải tán nhóm"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default GroupSettingsForm;
