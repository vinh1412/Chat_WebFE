import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import { FaSave, FaTimes } from "react-icons/fa";
import { useDashboardContext } from "../../context/Dashboard_context";
import useUser from "../../hooks/useUser";

const EditInfoModal = ({ isOpen, onClose }) => {
  const { currentUser, fetchUser } = useDashboardContext();
  const [name, setName] = useState("");
  const [gender, setGender] = useState("MALE");
  const [birthdate, setBirthdate] = useState("");
  const [avatar, setAvatar] = useState(null);
  const { updateUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && currentUser) {
      setName(currentUser.display_name || "");
      setGender(currentUser.gender || "MALE");
      setBirthdate(currentUser.dob || "");
      setAvatar(null);
    }
  }, [isOpen, currentUser]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 1048576 * 5) {
      alert("Ảnh đại diện quá lớn! Vui lòng chọn ảnh dưới 5MB.");
      return;
    }
    setAvatar(file);
  };

  const handleSubmit = () => {
    setIsLoading(true);
    updateUser(
      { name, gender, birthdate, avatar },
      {
        onSuccess: async () => {
          await fetchUser();
          setIsLoading(false);
          onClose();
        },
        onError: (error) => {
          setIsLoading(false);
          alert(
            "Lỗi cập nhật: " + (error.response?.data?.message || error.message)
          );
        },
      }
    );
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
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-2">
        <label className="form-label">Giới tính</label>
        <select
          className="form-select"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="MALE">Nam</option>
          <option value="FEMALE">Nữ</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="form-label">Ngày sinh</label>
        <input
          type="date"
          className="form-control"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Ảnh đại diện</label>
        <input
          type="file"
          className="form-control"
          accept="image/*"
          onChange={handleAvatarChange}
        />
      </div>
      {isLoading && (
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang cập nhật...</span>
          </div>
        </div>
      )}

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
