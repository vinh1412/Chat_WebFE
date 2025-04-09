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

const ForgotPasswordPage = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [step, setStep] = useState("sendOtp");
  const navigate = useNavigate();

  const { resetPassword } = useAuth({ setStep });

  const handleSendOtp = async () => {
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          { size: "invisible" }
        );
      }

      const confirmation = await signInWithPhoneNumber(
        auth,
        phone,
        window.recaptchaVerifier
      );
      setVerificationId(confirmation.verificationId);
      setStep("verifyOtp");
      alert("OTP đã được gửi!");
    } catch (error) {
      console.error("Gửi OTP lỗi:", error);
      alert("Không thể gửi OTP: " + error.message);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      const userCredential = await signInWithCredential(auth, credential);
      const idToken = await userCredential.user.getIdToken();

      resetPassword({ idToken, newPassword });
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("Xác thực OTP lỗi:", error);
      alert("Xác thực OTP thất bại: " + error.message);
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
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
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
