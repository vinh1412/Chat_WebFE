import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterStepPhone = () => {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleSendOTP = () => {
    console.log("Gửi OTP tới:", phone);
    navigate("/register/otp", { state: { phone } });
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
      <div className="card p-4 shadow w-100" style={{ maxWidth: "400px" }}>
        <h4 className="text-center mb-4">Đăng ký - Bước 1</h4>
        <input
          type="tel"
          className="form-control mb-3"
          placeholder="Nhập số điện thoại"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button className="btn btn-primary w-100" onClick={handleSendOTP}>
          Gửi mã OTP
        </button>
      </div>
    </div>
  );
};

export default RegisterStepPhone;
