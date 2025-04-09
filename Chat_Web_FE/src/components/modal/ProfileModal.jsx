import React, { useState, useRef } from "react";
import ReactModal from "react-modal";
import defaultCover from "../../assets/images/hinh-nen-buon-danbo.jpg";
import defaultAvatar from "../../assets/images/hinh-nen-buon-danbo.jpg";
import { FaCamera, FaSave, FaEdit, FaTimes } from "react-icons/fa";
import EditInfoModal from "./EditInfoModal";

const ProfileModal = ({ isOpen, onClose }) => {
    const fileInputRef = useRef(null);
    const [avatar, setAvatar] = useState(defaultAvatar);
    // const [isEditingName, setIsEditingName] = useState(false);
    const [name, setName] = useState("Ngô Văn Toàn");
    const [gender, setGender] = useState("Nam");
    const [birthdate, setBirthdate] = useState("2003-04-02");
    const [showEditModal, setShowEditModal] = useState(false);

    const handleChangeAvatar = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveInfo = (newInfo) => {
        setName(newInfo.name);
        setGender(newInfo.gender);
        setBirthdate(newInfo.birthdate);
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="border-0 bg-white rounded-4 shadow p-0"
            overlayClassName="position-fixed top-0 start-0 z-50 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
            style={{ content: { inset: "unset" } }}
        >
            <div style={{ width: "420px", maxHeight: "90vh", overflowY: "auto" }} className="rounded-4">
                {/* Header */}
                <div className="border-bottom px-4 py-3 d-flex justify-content-between align-items-center bg-light rounded-top-4">
                    <h5 className="m-0 fw-semibold">Thông tin tài khoản</h5>
                    <button
                        onClick={onClose}
                        className="btn btn-sm btn-outline-secondary rounded-circle"
                        style={{ width: "32px", height: "32px" }}
                    >
                        ✕
                    </button>
                </div>

                {/* Cover + Avatar */}
                <div className="position-relative">
                    <img
                        src={defaultCover}
                        alt="cover"
                        className="w-100 rounded-0"
                        style={{ height: "160px", objectFit: "cover" }}
                    />
                    <div
                        className="position-absolute"
                        style={{
                            bottom: "-40px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "90px",
                            height: "90px"
                        }}
                    >
                        <img
                            src={avatar}
                            alt="avatar"
                            className="rounded-circle border border-3 border-white shadow w-100 h-100"
                            style={{ objectFit: "cover" }}
                        />
                        {/* Nút đổi ảnh */}
                        <button
                            onClick={handleChangeAvatar}
                            className="position-absolute bottom-0 end-0 translate-middle p-1 bg-white border border-1 rounded-circle shadow"
                            style={{ width: "28px", height: "28px", cursor: "pointer" }}
                            title="Đổi ảnh"
                        >
                            <FaCamera className="text-primary" style={{ fontSize: "16px" }} />
                        </button>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                        />
                    </div>
                </div>

                {/* Name & Bio */}
                <div className="text-center mt-5 pt-2 px-4">
                    <div>
                        <h6 className="fw-bold mb-1 d-inline-block">{name}</h6>
                        <button
                            className="btn btn-sm btn-link p-0 ms-2"
                            onClick={() => setShowEditModal(true)}
                            title="Chỉnh sửa thông tin"
                        >
                            <FaEdit className="text-primary" style={{ fontSize: "16px" }} />
                        </button>
                    </div>
                    <p className="text-muted small mb-0">
                        "Đường còn dài, tuổi còn trẻ<br />Thứ gì chưa có, tương lai sẽ có... cố lên"
                    </p>
                </div>

                {/* Info */}
                <div className="px-4 pb-4 pt-3">
                    <h6 className="text-muted mb-3">Thông tin cá nhân</h6>
                    <div><strong>Giới tính:</strong> {gender}</div>
                    <div><strong>Ngày sinh:</strong> {new Date(birthdate).toLocaleDateString("vi-VN")}</div>
                    <div><strong>Điện thoại:</strong> +84 986 045 261</div>
                    <p className="text-muted small mt-2">
                        Chỉ bạn bè có lưu số của bạn trong danh bạ mới xem được số này.
                    </p>

                    <div className="text-center mt-3">
                        <button className="btn btn-primary w-50 rounded-pill" onClick={() => setShowEditModal(true)}>
                            <FaSave /> Cập nhật
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal cập nhật thông tin */}
            <EditInfoModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                currentInfo={{ name, gender, birthdate }}
                onSave={handleSaveInfo}
            />
        </ReactModal>
    );
};

export default ProfileModal;
