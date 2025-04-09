import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RegisterStepPhone = () => {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const { sendOtp } = useAuth({
    setVerificationId: (verificationId) => {
      // Sau khi gửi OTP thành công, chuyển sang bước nhập OTP
      navigate("/register/otp", { state: { phone, verificationId } });
    },
    setStep: () => {}, // Không cần trong bước này
  });

  const formatPhoneNumber = (phone) => {
    // Chuyển đổi số điện thoại thành định dạng quốc tế
    if (phone.startsWith("0")) {
      return "+84" + phone.slice(1);
    } else if (phone.startsWith("+84")) {
      if (phone[3] === "0") {
        return "+84" + phone.slice(4);
      }
      return phone;
    } else {
      return "+84" + phone;
    }
  };

  const handleSendOTP = () => {
    if (!phone) return alert("Vui lòng nhập số điện thoại");
    sendOtp({ phone: formatPhoneNumber(phone) });
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
        {/* Nơi hiển thị reCAPTCHA (invisible) */}
        <div id="recaptcha-container" />
      </div>
    </div>
  );
};

export default RegisterStepPhone;
