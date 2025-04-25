import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const DeputyModal = ({ show, onClose, members = [], onConfirm, loading }) => {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (!show) {
      setSelectedId(null);
      setSearch(""); 
    }
  }, [show]);


  const filteredMembers = members.filter(
    (m) =>
      m.role !== "ADMIN" &&
      m.role !== "DEPUTY" &&
      (m.display_name || "").toLowerCase().includes(search.toLowerCase())
  );

 
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
        <Modal.Title>Thêm phó nhóm</Modal.Title>
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
            <div className="text-muted text-center">Không tìm thấy thành viên phù hợp</div>
          ) : (
            filteredMembers.map((member) => (
              <div
                key={`deputy-${member.id}`} // Use member.id for consistency
                className={`d-flex align-items-center py-2 px-2 rounded mb-2 ${
                  selectedId === member.id ? "bg-light" : ""
                }`}
                style={{ cursor: loading ? "not-allowed" : "pointer" }}
                onClick={() => handleSelect(member.id)} // Allow row click to select
              >
                <Form.Check
                  type="radio"
                  name="deputy"
                  id={`deputy-${member.id}`}
                  checked={selectedId === member.id}
                  onChange={() => handleSelect(member.id)} // Handle radio button change
                  disabled={loading}
                  className="me-2"
                  style={{ marginTop: "0.3rem" }}
                />
                <label
                  htmlFor={`deputy-${member.id}`}
                  className="d-flex align-items-center w-100"
                  style={{ cursor: loading ? "not-allowed" : "pointer" }}
                >
                  <img
                    src={member.avatar || "https://via.placeholder.com/32"} // Reliable fallback
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

export default DeputyModal;