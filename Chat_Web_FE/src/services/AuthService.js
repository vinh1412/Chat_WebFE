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

export const saveRefreshToken = (refreshToken) => {
  localStorage.setItem("refreshToken", refreshToken);
};

export const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

export const removeTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const loginService = async (formLogin) => {
  try {
    const response = await axiosInstance.post("/auth/sign-in", formLogin);
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message); // Giữ log để debug
    throw new Error(
      error.response?.data?.message || "Sai số điện thoại hoặc mật khẩu"
    );
  }
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

export const registerService = async ({
  phone,
  display_name,
  password,
  avatar,
}) => {
  try {
    const formData = new FormData();
    const signUpRequest = {
      phone,
      display_name,
      password,
    };
    formData.append("signUpRequest", JSON.stringify(signUpRequest));
    if (avatar) {
      formData.append("avatar", avatar);
    }
    const response = await axiosInstance.post("/auth/sign-up", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Register error:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Không thể đăng ký tài khoản"
    );
  }
};

export const resetPasswordService = async ({ idToken, newPassword }) => {
  const response = await axiosInstance.post("/auth/reset-password", {
    idToken,
    newPassword,
  });
  return response.data;
};

export const refreshTokenService = async (refreshToken) => {
  const response = await axiosInstance.post("/auth/refresh-token", {
    refreshToken,
  });
  console.log("refreshTokenService", response.data);
  return response.data.response;
};

export const logoutService = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const generateQRCode = async () => {
  return await axiosInstance.post("/qr/generate");
};

export const verifyQRCode = async (sessionId, userId) => {
  return await axiosInstance.post("/qr/verify", { sessionId, userId });
};

export const checkQRStatus = async (sessionId) => {
  return await axiosInstance.get(`/qr/status/${sessionId}`);
};