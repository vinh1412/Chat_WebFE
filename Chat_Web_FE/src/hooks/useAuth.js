import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  loginService,
  sendOtpService,
  verifyOtpService,
  registerService,
  resetPasswordService,
  logoutService,
} from "../services/AuthService";
import { auth } from "../config/firebaseConfig";
import { toast } from "react-toastify";

const useAuth = ({ setVerificationId, setStep } = {}) => {
  const queryClient = useQueryClient();

  const login = useMutation({
    mutationFn: (formLogin) => loginService(formLogin),
    onSuccess: (response) => {
      toast.success("Đăng nhập thành công!", {
        position: "top-center",
        autoClose: 500,
      });
      // Lưu token vào localStorage hoặc state
      localStorage.setItem("accessToken", response.response.token);
      localStorage.setItem("refreshToken", response.response.refreshToken);

      // Cập nhật lại queryClient để làm mới dữ liệu
      queryClient.invalidateQueries(["user"]);
    },
    onError: (error) => {
      toast.error(error.message || "Đăng nhập thất bại", {
        position: "top-center",
        autoClose: 3000,
      });
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
      toast.success("OTP đã được gửi!", {
        position: "top-center",
        autoClose: 1000,
      });
    },
    onError: (error) => {
      toast.error("Gửi OTP thất bại: " + error.message || "Gửi OTP thất bại", {
        position: "top-center",
        autoClose: 3000,
      });
      console.error("Lỗi gửi OTP:", error);
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
        toast.success("Xác thực thành công. Tiếp tục đăng ký.", {
          position: "top-center",
          autoClose: 1000,
        });
        setStep("registerAccount");
      } else {
        toast.error("Số điện thoại chưa được đăng ký.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    },
    onError: (error) => {
      console.error("Lỗi xác thực OTP:", error);
      toast.error(
        "Xác thực OTP thất bại: " +
          (error.response?.data?.message || error.message),
        {
          position: "top-center",
          autoClose: 3000,
        }
      );
    },
  });

  const register = useMutation({
    mutationFn: (formData) => registerService(formData),
    onSuccess: () => {
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.", {
        position: "top-center",
        autoClose: 2000,
        icon: "🎉",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 2200);
    },
    onError: (error) => {
      toast.error(error.message || "Đăng ký thất bại", {
        position: "top-center",
        autoClose: 3000,
      });
    },
  });
  const resetPassword = useMutation({
    mutationFn: (data) => resetPasswordService(data),
    onSuccess: (res) => {
      if (res.status === "SUCCESS") {
        toast.success("Đặt lại mật khẩu thành công!", {
          position: "top-center",
          autoClose: 1000,
        });

        setStep && setStep("login");
      } else {
        toast.error("Đặt lại mật khẩu thất bại!", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    },
    onError: (error) => {
      toast.error(error.message || "Đặt lại mật khẩu thất bại", {
        position: "top-center",
        autoClose: 3000,
      });
      console.error("Lỗi đặt lại mật khẩu:", error);
    },
  });

  const handleLogout = () => {
    logoutService()
      .then(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        queryClient.invalidateQueries(["user"]);
      })
      .catch((error) => {
        console.error("Lỗi đăng xuất:", error);
      });
  };

  return {
    login: login.mutate,
    sendOtp: sendOtp.mutate,
    verifyOtp: verifyOtp.mutate,
    register: register.mutate,
    resetPassword: resetPassword.mutate,
    handleLogout,
  };
};

export default useAuth;
