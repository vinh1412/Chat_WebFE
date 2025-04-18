import React, { useState } from "react";
import ReactModal from "react-modal";
import { FaSave, FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";
import { changePasswordService } from "../../services/UserService";
import { toast } from "react-toastify";

const ChangePasswordModal = ({ isOpen, onClose }) => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.error("Mật khẩu mới và xác nhận không khớp!", {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }
        try {
            await changePasswordService(oldPassword, newPassword);
            toast.success("Đổi mật khẩu thành công!", {
                position: "top-center",
                autoClose: 3000,
            });
            onClose();
        } catch (error) {
            toast.error(
                "Lỗi đổi mật khẩu: " +
                    (error.response?.data?.message || error.message),
                {
                    position: "top-center",
                    autoClose: 3000,
                }
            );
        } finally {
            setIsLoading(false);
        }
    };

    const renderPasswordInput = (
        label,
        value,
        setValue,
        show,
        setShow,
        inputId
    ) => (
        <div className="mb-2">
            <label htmlFor={inputId} className="form-label">
                {label}
            </label>
            <div className="input-group ">
                <input
                    id={inputId}
                    type={show ? "text" : "password"}
                    className="form-control"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                <button
                    type="button"
                    className="btn"
                    onClick={() => setShow(!show)}
                >
                    {show ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>
        </div>
    );

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="bg-white rounded shadow p-4"
            overlayClassName="position-fixed top-0 start-0 z-50 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
            style={{
                content: { inset: "unset", width: "500px", maxWidth: "90%" },
            }}
        >
            <h5 className="mb-3">Đổi mật khẩu</h5>

            {renderPasswordInput(
                "Mật khẩu hiện tại",
                oldPassword,
                setOldPassword,
                showOld,
                setShowOld,
                "old-password"
            )}
            {renderPasswordInput(
                "Mật khẩu mới",
                newPassword,
                setNewPassword,
                showNew,
                setShowNew,
                "new-password"
            )}
            {renderPasswordInput(
                "Xác nhận mật khẩu",
                confirmPassword,
                setConfirmPassword,
                showConfirm,
                setShowConfirm,
                "confirm-password"
            )}

            {isLoading && (
                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Đang xử lý...</span>
                    </div>
                </div>
            )}

            <div className="text-end">
                <button className="btn btn-secondary me-2" onClick={onClose}>
                    <FaTimes /> Huỷ
                </button>
                <button
                    className="btn btn-primary"
                    onClick={handleChangePassword}
                >
                    <FaSave /> Lưu
                </button>
            </div>
        </ReactModal>
    );
};

export default ChangePasswordModal;
