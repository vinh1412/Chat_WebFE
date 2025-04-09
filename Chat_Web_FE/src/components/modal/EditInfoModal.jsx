import React, { useState } from "react";
import ReactModal from "react-modal";
import { FaSave, FaTimes } from "react-icons/fa";

const EditInfoModal = ({ isOpen, onClose, currentInfo, onSave }) => {
  const [name, setName] = useState(currentInfo.name);
  const [gender, setGender] = useState(currentInfo.gender);
  const [birthdate, setBirthdate] = useState(currentInfo.birthdate);

  const handleSubmit = () => {
    onSave({ name, gender, birthdate });
    onClose();
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white rounded shadow p-4"
      overlayClassName="position-fixed top-0 start-0 z-50 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
      style={{ content: { inset: "unset", width: "500px", maxWidth: "90%" } }}
    >
      <h5 className="mb-3">Cập nhật thông tin</h5>

      <div className="mb-2">
        <label className="form-label">Tên</label>
        <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="mb-2">
        <label className="form-label">Giới tính</label>
        <select className="form-select" value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="form-label">Ngày sinh</label>
        <input type="date" className="form-control" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />
      </div>

      <div className="text-end">
        <button className="btn btn-secondary me-2" onClick={onClose}>
          <FaTimes /> Huỷ
        </button>
        <button className="btn btn-primary" onClick={handleSubmit}>
          <FaSave /> Lưu
        </button>
      </div>
    </ReactModal>
  );
};

export default EditInfoModal;
