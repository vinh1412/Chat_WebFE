import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  loginService,
  sendOtpService,
  verifyOtpService,
  registerService,
  resetPasswordService,
} from "../services/AuthService";
import { auth } from "../config/firebaseConfig";

const useAuth = ({ setVerificationId, setStep } = {}) => {
  const queryClient = useQueryClient();

  const login = useMutation({
    mutationFn: (formLogin) => loginService(formLogin),
    onSuccess: (response) => {
      // Lưu token vào localStorage hoặc state
      localStorage.setItem("accessToken", response.response.token);
      localStorage.setItem("refreshToken", response.response.refreshToken);
      // Cập nhật lại queryClient để làm mới dữ liệu
      queryClient.invalidateQueries(["user"]);
    },
  });
  const sendOtp = useMutation({
    mutationFn: async ({ phone }) => {
      if (!window.recaptchaVerifier) {
        const { RecaptchaVerifier } = await import("firebase/auth");

        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          { size: "invisible" }
        );
      }

      return sendOtpService(phone, window.recaptchaVerifier);
    },
    onSuccess: (verificationId) => {
      setVerificationId(verificationId);
      setStep("verifyOtp");
      alert("OTP đã được gửi!");
    },
    onError: (error) => {
      console.error("Lỗi gửi OTP:", error);
      alert("Gửi OTP thất bại: " + error.message);
    },
  });

  const verifyOtp = useMutation({
    mutationFn: async ({ verificationId, otp }) => {
      const { PhoneAuthProvider, signInWithCredential } = await import(
        "firebase/auth"
      );
      // const { auth } = await import("../firebaseConfig");

      const credential = PhoneAuthProvider.credential(verificationId, otp);
      const userCredential = await signInWithCredential(auth, credential);
      const idToken = await userCredential.user.getIdToken();
      return verifyOtpService(idToken);
    },
    onSuccess: (response) => {
      if (response.status === "SUCCESS") {
        alert("Xác thực thành công. Tiếp tục đăng ký.");
        setStep("registerAccount");
      } else {
        alert("Số điện thoại chưa được đăng ký.");
      }
    },
    onError: (error) => {
      console.error("Lỗi xác thực OTP:", error);
      alert(
        "Xác thực OTP thất bại: " +
          (error.response?.data?.message || error.message)
      );
    },
  });

  const register = useMutation({
    mutationFn: (formData) => registerService(formData),
    onSuccess: (response) => {
      if (response.status === "SUCCESS") {
        alert("Đăng ký thành công!");
        setStep("login");
      } else {
        alert("Đăng ký thất bại!");
      }
    },
    onError: (error) => {
      console.error("Lỗi đăng ký:", error);
      alert(
        "Đăng ký thất bại: " + (error.response?.data?.message || error.message)
      );
    },
  });
  const resetPassword = useMutation({
    mutationFn: (data) => resetPasswordService(data),
    onSuccess: (res) => {
      if (res.status === "SUCCESS") {
        alert("Đặt lại mật khẩu thành công!");

        setStep && setStep("login");
      } else {
        alert("Đặt lại mật khẩu thất bại!");
      }
    },
    onError: (error) => {
      console.error("Lỗi đặt lại mật khẩu:", error);
      alert(
        "Đặt lại mật khẩu thất bại: " +
          (error?.response?.data?.message || error.message)
      );
    },
  });
  return {
    login: login.mutate,
    sendOtp: sendOtp.mutate,
    verifyOtp: verifyOtp.mutate,
    register: register.mutate,
    resetPassword: resetPassword.mutate,
  };
};

export default useAuth;
