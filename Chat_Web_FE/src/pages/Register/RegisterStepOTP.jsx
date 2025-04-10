import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const RegisterStepOTP = () => {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const phone = location.state?.phone || "";

  const handleVerifyOTP = () => {
    console.log("Xác minh OTP:", otp);
    navigate("/register/info", { state: { phone } });
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
      <div className="card p-4 shadow w-100" style={{ maxWidth: "400px" }}>
        <h4 className="text-center mb-3">Đăng ký - Bước 2</h4>
        <p className="text-center text-muted">
          Mã OTP đã gửi đến số: <strong>{phone}</strong>
        </p>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Nhập mã OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button className="btn btn-primary w-100" onClick={handleVerifyOTP}>
          Xác nhận
        </button>
      </div>
    </div>
  );
};

export default RegisterStepOTP;
