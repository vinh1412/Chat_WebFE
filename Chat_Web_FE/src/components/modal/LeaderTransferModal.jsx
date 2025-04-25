import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const LeaderTransferModal = ({ show, onClose, members = [], onConfirm, loading }) => {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // câp nhật trạng thái khi modal đóng hoặc mở
  useEffect(() => {
    if (!show) {
      setSelectedId(null); 
      setSearch(""); 
    }
  }, [show]);

  // Cập nhật danh sách thành viên: loại bỏ ADMIN và khớp với từ tìm kiếm
  const filteredMembers = members.filter(
    (m) =>
      m.role !== "ADMIN" &&
      (m.display_name || "").toLowerCase().includes(search.toLowerCase())
  );

  // Cập nhật trạng thái khi modal đóng hoặc mở
  const handleSelect = (userId) => {
    if (!loading) {
      setSelectedId(userId); 
    }
  };
  const handleConfirm = () => {
    if (selectedId && !loading) {
      onConfirm(selectedId); 
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Chuyển quyền trưởng nhóm</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          type="text"
          placeholder="Tìm kiếm thành viên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-3"
          disabled={loading}
        />
        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          {filteredMembers.length === 0 ? (
            <div className="text-muted text-center">Không tìm thấy thành viên</div>
          ) : (
            filteredMembers.map((member) => (
              <div
                key={`leader-${member.id}`}
                className={`d-flex align-items-center py-2 px-2 rounded mb-2 ${
                  selectedId === member.id ? "bg-light" : ""
                }`}
                style={{ cursor: loading ? "not-allowed" : "pointer" }}
                onClick={() => handleSelect(member.id)} // Allow row click to select
              >
                <Form.Check
                  type="radio"
                  name="leader"
                  id={`leader-${member.id}`}
                  checked={selectedId === member.id}
                  onChange={() => handleSelect(member.id)} // Handle radio button change
                  disabled={loading}
                  className="me-2"
                  style={{ marginTop: "0.3rem" }}
                />
                <label
                  htmlFor={`leader-${member.id}`}
                  className="d-flex align-items-center w-100"
                  style={{ cursor: loading ? "not-allowed" : "pointer" }}
                >
                  <img
                    src={member.avatar || "https://via.placeholder.com/32"} // Fallback avatar
                    alt="avatar"
                    className="me-2 rounded-circle"
                    style={{ width: "32px", height: "32px", objectFit: "cover" }}
                  />
                  <span>{member.display_name || "Không có tên"}</span>
                </label>
              </div>
            ))
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Hủy
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          disabled={loading || !selectedId}
        >
          {loading ? "Đang xử lý..." : "Xác nhận"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LeaderTransferModal;