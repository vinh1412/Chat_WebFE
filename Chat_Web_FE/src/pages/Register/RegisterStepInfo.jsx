import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";

const RegisterStepInfo = () => {
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const { phone } = location.state || {};
  const { register } = useAuth({}); // Không cần setVerificationId hoặc setStep ở bước này

  const handleRegister = () => {
    if (!displayName || !password || !confirmPassword) {
      return toast.error("Vui lòng nhập đầy đủ thông tin", {
        position: "top-center",
        autoClose: 3000,
      });
    }
    register({ phone, display_name: displayName, password, avatar: null });
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
      <div className="card p-4 shadow w-100" style={{ maxWidth: "400px" }}>
        <h4 className="text-center mb-4">Đăng ký - Bước 3</h4>
        <div className="mb-3">
          <input
            type="text"
            className={`form-control`}
            placeholder="Họ tên"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className={`form-control ${
              password && password.length < 8 ? "is-invalid" : ""
            }`}
            placeholder="Mật khẩu (tối thiểu 8 ký tự)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {password && password.length < 8 && (
            <div className="invalid-feedback d-block">
              Mật khẩu phải có ít nhất 8 ký tự.
            </div>
          )}
        </div>
        <div className="mb-3">
          <input
            type="password"
            className={`form-control ${
              confirmPassword && confirmPassword !== password
                ? "is-invalid"
                : ""
            }`}
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {confirmPassword && confirmPassword !== password && (
            <div className="invalid-feedback d-block">
              Mật khẩu xác nhận không khớp.
            </div>
          )}
        </div>
        <button className="btn btn-success w-100" onClick={handleRegister}>
          Hoàn tất đăng ký
        </button>
      </div>
    </div>
  );
};

export default RegisterStepInfo;
