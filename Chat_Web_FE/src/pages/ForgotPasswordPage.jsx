import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { auth } from "../config/firebaseConfig";
import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Stack,
} from "@mui/material";
import { toast } from "react-toastify";
import formatPhoneNumber from "../utils/FormatPhoneNumber";
import useUser from "../hooks/useUser";

const ForgotPasswordPage = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [step, setStep] = useState("sendOtp");
  const navigate = useNavigate();

  const { resetPassword } = useAuth({ setStep });
  const { checkPhoneExistsAsync } = useUser();

  const handleSendOtp = async () => {
    try {
      const formattedPhone = formatPhoneNumber(phone.trim());
      const phoneRegex = /^(?:\+84|0)(\d{9})$/;

      if (!phoneRegex.test(formattedPhone)) {
        return toast.error(
          "Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng và đủ 10 số.",
          { position: "top-center", autoClose: 2000 }
        );
      }

      // Kiểm tra số điện thoại tồn tại
      const exists = await checkPhoneExistsAsync(formattedPhone);
      if (!exists) {
        return toast.error("Số điện thoại chưa được đăng ký.", {
          position: "top-center",
          autoClose: 2000,
        });
      }

      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          { size: "invisible" }
        );
      }

      const confirmation = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        window.recaptchaVerifier
      );

      setVerificationId(confirmation.verificationId);
      setStep("verifyOtp");
      toast.success("OTP đã được gửi!", {
        position: "top-center",
        autoClose: 1000,
      });
    } catch (error) {
      console.error("Gửi OTP lỗi:", error);
      toast.error("Gửi OTP thất bại: " + error.message, {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const handleVerifyOtp = async () => {
    try {
      if (!otp) {
        return toast.error("Vui lòng nhập mã OTP", {
          position: "top-center",
          autoClose: 1000,
        });
      }

      if (!newPassword) {
        return toast.error("Vui lòng nhập mật khẩu mới", {
          position: "top-center",
          autoClose: 1000,
        });
      }

      if (newPassword.length < 8) {
        return toast.error("Mật khẩu mới phải có ít nhất 8 ký tự", {
          position: "top-center",
          autoClose: 1000,
        });
      }

      if (!confirmPassword) {
        return toast.error("Vui lòng xác nhận mật khẩu mới", {
          position: "top-center",
          autoClose: 1000,
        });
      }

      const credential = PhoneAuthProvider.credential(verificationId, otp);
      const userCredential = await signInWithCredential(auth, credential);
      const idToken = await userCredential.user.getIdToken();

      resetPassword({ idToken, newPassword });
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("Xác thực OTP lỗi:", error);
      toast.error("Xác thực OTP thất bại: " + error.message, {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={10}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" gutterBottom align="center">
            🔒 Quên Mật Khẩu
          </Typography>

          <div id="recaptcha-container" />

          {step === "sendOtp" && (
            <Stack spacing={2}>
              <TextField
                label="Số điện thoại"
                variant="outlined"
                fullWidth
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Button variant="contained" onClick={handleSendOtp}>
                Gửi OTP
              </Button>
            </Stack>
          )}

          {step === "verifyOtp" && (
            <Stack spacing={2}>
              <TextField
                label="Mã OTP"
                variant="outlined"
                fullWidth
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <TextField
                label="Mật khẩu mới"
                type="password"
                variant="outlined"
                className={`form-control ${
                  newPassword && newPassword.length < 8 ? "is-invalid" : ""
                }`}
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              {newPassword && newPassword.length < 8 && (
                <div className="invalid-feedback d-block">
                  Mật khẩu phải có ít nhất 8 ký tự.
                </div>
              )}
              <TextField
                label="Mật khẩu xác nhận"
                type="password"
                variant="outlined"
                className={`form-control ${
                  confirmPassword && confirmPassword !== newPassword
                    ? "is-invalid"
                    : ""
                }`}
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {confirmPassword && confirmPassword !== newPassword && (
                <div className="invalid-feedback d-block">
                  Mật khẩu xác nhận không khớp.
                </div>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={handleVerifyOtp}
              >
                Xác Nhận
              </Button>
            </Stack>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPasswordPage;
