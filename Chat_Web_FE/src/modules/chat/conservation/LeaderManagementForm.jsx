import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import useMember from "../../../hooks/useMember";
import DeputyModal from "../../../components/modal/DeputyModal";
import LeaderTransferModal from "../../../components/modal/LeaderTransferModal";
import axiosInstance from "../../../api/axios";

// Component to display member information
const MemberInfo = ({ member, roleLabel }) => (
  <div className="d-flex align-items-center mb-2">
    <img
      src={member.avatar || "https://postimg.cc/VdnLTY7f"}
      alt={`${roleLabel} Avatar`}
      className="rounded-circle me-2"
      style={{ width: "40px", height: "40px", objectFit: "cover" }}
    />
    <div>
      <p className="mb-0 fw-medium">{member.display_name || "Không có tên"}</p>
      <small className="text-muted">{roleLabel}</small>
    </div>
  </div>
);

// Utility function to validate ObjectId
const isValidObjectId = (id) => {
  return typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);
};

// Service function to update member role
const updateMemberRoleService = async (conversationId, memberId, role) => {
  try {
    // Validate IDs before making the request
    if (!isValidObjectId(conversationId)) {
      throw new Error(
        "Invalid conversationId: Must be a 24-character hexadecimal string"
      );
    }
    if (!isValidObjectId(memberId)) {
      throw new Error(
        "Invalid memberId: Must be a 24-character hexadecimal string"
      );
    }

    const response = await axiosInstance.put("/conversations/update-role", {
      conversationId,
      memberId,
      role,
    });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Đã xảy ra lỗi không xác định";
    throw new Error(message);
  }
};

const LeaderManagementForm = ({ onBack, conversationId }) => {
  const [showAddDeputyForm, setShowAddDeputyForm] = useState(false);
  const [showTransferLeaderForm, setShowTransferLeaderForm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [confirmTransfer, setConfirmTransfer] = useState({
    show: false,
    memberId: null,
  });

  const {
    userRole,
    isLoadingUserRole,
    members,
    isLoadingMembers,
    membersError,
    refetch,
  } = useMember(conversationId);
  const isAdmin = userRole?.role === "ADMIN";

  // Debug members data
  useEffect(() => {
    if (
      typeof process !== "undefined" &&
      process.env.NODE_ENV !== "production"
    ) {
      console.log("Conversation ID:", conversationId);
      if (members) {
        console.log("Danh sách members:", members);
      }
      if (membersError) {
        console.log("Members Error:", membersError);
      }
    }
  }, [conversationId, members, membersError]);

  // Validate conversationId
  if (
    !conversationId ||
    typeof conversationId !== "string" ||
    !isValidObjectId(conversationId)
  ) {
    return (
      <div className="text-center mt-5">
        <p className="text-danger">
          Lỗi: conversationId không hợp lệ ({conversationId}).
        </p>
      </div>
    );
  }

  if (isLoadingUserRole || isLoadingMembers) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (membersError) {
    return (
      <div className="text-center mt-5">
        <p className="text-danger">
          Lỗi khi lấy danh sách thành viên: {membersError.message}
        </p>
      </div>
    );
  }

  if (!members || members.length === 0) {
    return (
      <div className="text-center mt-5">
        <p className="text-muted">Không có thành viên nào trong nhóm.</p>
      </div>
    );
  }

  const updateLeaderRole = async (memberId, role, onSuccess, onError) => {
    if (!isAdmin) {
      toast.error("Bạn không có quyền thực hiện hành động này", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    setIsUpdating(true);
    try {
      if (process.env.NODE_ENV !== "production") {
        console.log("Updating role:", { conversationId, memberId, role });
      }

      const response = await updateMemberRoleService(
        conversationId,
        memberId,
        role
      );

      if (response.success) {
        if (process.env.NODE_ENV !== "production") {
          console.log(
            `Successfully updated role to ${role} for memberId: ${memberId}`
          );
        }
        toast.success(`Đã cập nhật vai trò thành công: ${role}`, {
          position: "top-right",
          autoClose: 500,
        });
        onSuccess?.();
        refetch?.();
      } else {
        throw new Error(response.message || "Cập nhật vai trò thất bại");
      }
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Error updating role:", error.message);
      }
      onError?.(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddDeputy = async (memberIds) => {
    if (!memberIds || memberIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất một thành viên", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }
    setShowAddDeputyForm(false);
  };

  const handleTransferLeader = async (memberId) => {
    if (!memberId) {
      toast.error("Vui lòng chọn một thành viên", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    if (memberId === userRole.userId) {
      toast.error("Không thể chuyển quyền trưởng nhóm cho chính bạn", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    try {
      // Gán ADMIN cho người mới
      await updateLeaderRole(memberId, "ADMIN");

      // Hạ quyền người hiện tại xuống MEMBER
      await updateLeaderRole(userRole.userId, "MEMBER");

      // Thành công => đóng modal
      setConfirmTransfer({ show: false, memberId: null });
    } catch (error) {
      toast.error("Chuyển quyền thất bại: " + error.message, {
        position: "top-center",
        autoClose: 3000,
      });

      // Nếu lỗi xảy ra sau khi đã set ADMIN cho người mới, rollback lại
      try {
        await updateLeaderRole(memberId, "MEMBER");
      } catch (rollbackError) {
        toast.error("Rollback failed: " + rollbackError.message, {
          position: "top-center",
          autoClose: 3000,
        });
      }
    }
  };

  const confirmTransferLeader = (memberId) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "Mở xác nhận chuyển quyền trưởng nhóm cho memberId:",
        memberId
      );
    }
    setConfirmTransfer({ show: true, memberId });
  };

  // Modal for confirming leader transfer
  const ConfirmTransferModal = ({ show, onClose, onConfirm, memberId }) => {
    const member = members.find((m) => m.userId === memberId);

    // Debug member data
    if (process.env.NODE_ENV !== "production") {
      console.log("Member ID to transfer:", memberId);
      console.log("Found member:", member);
      console.log("Members array:", members);
    }

    // Fallback to userId if display_name is missing
    const displayName =
      member?.display_name || member?.userId || "Không có tên";

    return (
      <Modal show={show} onHide={onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận chuyển quyền trưởng nhóm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Bạn có chắc chắn muốn chuyển quyền trưởng nhóm cho{" "}
            <strong>{displayName}</strong> không?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={() => onConfirm(memberId)}
            disabled={isUpdating}
          >
            {isUpdating ? "Đang xử lý..." : "Xác nhận"}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <div className="card p-3" style={{ height: "100vh", overflowY: "auto" }}>
      <div className="d-flex align-items-center gap-2 mb-3">
        <span style={{ cursor: "pointer" }} onClick={onBack}>
          <i className="bi bi-arrow-left-short fs-3"></i>
        </span>
        <div className="w-100 d-flex justify-content-center">
          <div className="text-center">
            <h6 className="mb-0 fs-5">Trưởng & phó nhóm</h6>
          </div>
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

        {/* Leader */}
        <div className="mb-3">
          <h6>Trưởng nhóm</h6>
          {members.some((m) => m.role === "ADMIN") ? (
            <MemberInfo
              member={members.find((m) => m.role === "ADMIN")}
              roleLabel="Trưởng nhóm"
            />
          ) : (
            <p className="text-muted">Chưa có trưởng nhóm</p>
          )}
        </div>

        {/* Deputies */}
        {members.filter((m) => m.role === "DEPUTY").length > 0 && (
          <div className="mb-3">
            <h6>Phó nhóm</h6>
            {members
              .filter((m) => m.role === "DEPUTY")
              .map((m) => (
                <MemberInfo key={m.userId} member={m} roleLabel="Phó nhóm" />
              ))}
          </div>
        )}

        {/* Members */}
        {members.filter((m) => m.role !== "ADMIN" && m.role !== "DEPUTY")
          .length > 0 && (
          <div className="mb-3">
            <h6>Thành viên</h6>
            {members
              .filter((m) => m.role !== "ADMIN" && m.role !== "DEPUTY")
              .map((m) => (
                <MemberInfo key={m.userId} member={m} roleLabel="Thành viên" />
              ))}
          </div>
        )}

        <Button
          variant="light"
          className="w-100 mb-2 text-start"
          onClick={() => setShowAddDeputyForm(true)}
          style={{
            backgroundColor: "#f1f3f5",
            border: "none",
            fontSize: "14px",
          }}
        >
          Thêm phó nhóm
        </Button>
        <Button
          variant="light"
          className="w-100 mb-2 text-start"
          onClick={() => setShowTransferLeaderForm(true)}
          disabled={!isAdmin}
          style={{
            backgroundColor: "#f1f3f5",
            border: "none",
            fontSize: "14px",
          }}
        >
          Chuyển quyền trưởng nhóm
        </Button>
      </div>

      <DeputyModal
        show={showAddDeputyForm}
        onClose={() => setShowAddDeputyForm(false)}
        members={members || []}
        onConfirm={handleAddDeputy}
        loading={isUpdating}
      />
      <LeaderTransferModal
        show={showTransferLeaderForm}
        onClose={() => setShowTransferLeaderForm(false)}
        members={members || []}
        onConfirm={(memberId) => {
          setShowTransferLeaderForm(false);
          confirmTransferLeader(memberId);
        }}
        loading={isUpdating}
      />
      <ConfirmTransferModal
        show={confirmTransfer.show}
        onClose={() => setConfirmTransfer({ show: false, memberId: null })}
        onConfirm={handleTransferLeader}
        memberId={confirmTransfer.memberId}
      />
    </div>
  );
};

export default LeaderManagementForm;
