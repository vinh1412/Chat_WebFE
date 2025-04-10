import axiosInstance from "../api/axios";

export const getCurrentUserService = async () => {
  const response = await axiosInstance.get("/user/me");
  return response.data.response;
};
