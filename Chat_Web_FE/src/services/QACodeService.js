import axiosInstance from "../api/axios";

export const getUserBySessionId = async (sessionId) => {
  console.log("sessionId:", sessionId);
  try {
    const response = await axiosInstance.get(`/qacode/${sessionId}`);
    console.log("Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi gọi API getUserBySessionId:', error);
    throw error;
  }
};


export const getCurrentUserService = async () => {
  const response = await axiosInstance.get("/user/me");
  return response.data.response;
};
