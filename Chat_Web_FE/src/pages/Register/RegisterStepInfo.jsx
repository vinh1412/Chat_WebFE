import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

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
      return alert("Vui lòng nhập đầy đủ thông tin");
    }
    if (password !== confirmPassword) {
      return alert("Mật khẩu không khớp!");
    }

    register(
      { phone, display_name: displayName, password },
      {
        onSuccess: () => {
          alert("Đăng ký thành công!");
          navigate("/login");
        },
        onError: (error) => {
          alert("Đăng ký thất bại: " + error.message);
        },
      }
    );
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
      <div className="card p-4 shadow w-100" style={{ maxWidth: "400px" }}>
        <h4 className="text-center mb-4">Đăng ký - Bước 3</h4>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Họ tên"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button className="btn btn-success w-100" onClick={handleRegister}>
          Hoàn tất đăng ký
        </button>
      </div>
    </div>
  );
};

export default RegisterStepInfo;
