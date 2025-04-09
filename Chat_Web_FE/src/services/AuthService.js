import axiosInstance from "../api/axios";

export const saveAccessToken = (token) => {
  localStorage.setItem("accessToken", token); // Lưu token vào localStorage
};

export const getAccessToken = () => {
  return localStorage.getItem("accessToken"); // Lấy token từ localStorage
};

export const removeAccessToken = () => {
  localStorage.removeItem("accessToken"); // Xóa token khỏi localStorage
};

export const loginService = async (formLogin) => {
  const response = await axiosInstance.post("/auth/sign-in", formLogin);
  return response.data; // Trả về dữ liệu từ server
};

export const sendOtpService = async (phone, recaptchaVerifier) => {
  const { signInWithPhoneNumber } = await import("firebase/auth");
  const { auth } = await import("../config/firebaseConfig");

  const confirmation = await signInWithPhoneNumber(
    auth,
    phone,
    recaptchaVerifier
  );
  return confirmation.verificationId;
};

export const verifyOtpService = async (idToken) => {
  const response = await axiosInstance.post("/auth/verify-otp", { idToken });
  return response.data;
};

export const registerService = async (data) => {
  const response = await axiosInstance.post("/auth/sign-up", data);
  return response.data;
};

export const resetPasswordService = async ({ idToken, newPassword }) => {
  const response = await axiosInstance.post("/auth/reset-password", {
    idToken,
    newPassword,
  });
  return response.data;
};
