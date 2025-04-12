import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import formatPhoneNumber from "../../utils/FormatPhoneNumber";
import { toast } from "react-toastify";
import useUser from "../../hooks/useUser";

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
  const { checkPhoneExistsAsync } = useUser();
  const handleSendOTP = async () => {
    const rawPhone = phone.trim();

    // Regex chỉ cho phép số, có thể bắt đầu bằng +84 hoặc 0
    const phoneRegex = /^(?:\+84|0)(\d{9})$/;

    if (!rawPhone) {
      return toast.error("Vui lòng nhập số điện thoại", {
        position: "top-center",
        autoClose: 3000,
      });
    }

    if (!phoneRegex.test(rawPhone)) {
      return toast.error(
        "Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng và đủ 10 số.",
        {
          position: "top-center",
          autoClose: 4000,
        }
      );
    }
    const formattedPhone = formatPhoneNumber(rawPhone);

    try {
      const exists = await checkPhoneExistsAsync(formattedPhone);
      if (exists) {
        return toast.error("Số điện thoại đã được đăng ký.", {
          position: "top-center",
          autoClose: 3000,
        });
      }

      // Gửi OTP nếu số chưa tồn tại
      sendOtp({ phone: formattedPhone });
    } catch (error) {
      toast.error(error.message || "Lỗi khi kiểm tra số điện thoại", {
        position: "top-center",
        autoClose: 3000,
      });
    }
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
