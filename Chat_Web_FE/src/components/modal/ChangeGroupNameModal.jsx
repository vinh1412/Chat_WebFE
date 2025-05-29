import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { updateGroupName } from "../../services/ConversationService";
import { useDispatch } from "react-redux";
import { setSelectedConversation } from "../../redux/slice/commonSlice";
import useConversation from "../../hooks/useConversation";

const ChangeGroupNameModal = ({ show, onHide, conversationId, onSuccess }) => {
  const dispatch = useDispatch();
  const [newGroupName, setNewGroupName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { conversation, updateGroupNameFromGroup } =
    useConversation(conversationId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) {
      toast.error("Tên nhóm không được để trống!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await updateGroupNameFromGroup.mutateAsync({
        conversationId,
        newName: newGroupName,
      });

      if (response.conversation) {
        toast.success("Cập nhật tên nhóm thành công!", {
          position: "top-right",
          autoClose: 500,
        });
        dispatch(setSelectedConversation(response.conversation));
        if (onSuccess) onSuccess(response.conversation);
        onHide();
        setNewGroupName("");
      } else {
        toast.error("Không thể cập nhật tên nhóm. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error updating group name:", error.message);
      toast.error("Lỗi khi cập nhật tên nhóm: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Đổi tên nhóm</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="newGroupName" className="mb-3">
            <Form.Label>Tên nhóm mới</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập tên nhóm mới"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              required
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            disabled={isLoading}
            className="w-100"
          >
            {isLoading ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ChangeGroupNameModal;
