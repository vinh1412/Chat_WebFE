import axios from "axios";
import { getAccessToken } from "../services/AuthService";
const API_URL = "http://localhost:8080/api/v1";

// Tạo một instance của axios với baseURL là API_URL
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Tạo một interceptor cho axiosInstance để tự đông  thêm token vào header mỗi khi có request tới
axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
