// src/api/axiosInstance.js
import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  refreshTokenService,
  saveAccessToken,
  saveRefreshToken,
  removeTokens,
} from "../services/AuthService";

const API_URL = "http://localhost:8080/api/v1";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

let hasRefreshFailed = false;
// Thêm token vào mỗi request
axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  console.log("🔑 Access token:", token);
  return config;
});

// Xử lý token hết hạn
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (hasRefreshFailed) {
      console.error("Refresh token has already failed, redirecting to login");
      removeTokens();
      window.location.replace("/login");
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      getRefreshToken()
    ) {
      console.log("🔄 Refresh token:", getRefreshToken());

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        const response = await refreshTokenService(getRefreshToken());
        const { accessToken, refreshToken } = response.response;
        console.log("🚀 New access token:", accessToken);
        console.log("🚀 New refresh token:", refreshToken);
        saveAccessToken(accessToken);
        if (refreshToken) saveRefreshToken(refreshToken);

        processQueue(null, accessToken);
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        hasRefreshFailed = true;
        console.error("🔄 Refresh token failed:", err);
        processQueue(err, null);
        removeTokens();
        window.location.href = "/login";
        isRefreshing = false;
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
