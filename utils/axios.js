import axios from "axios";
import { store } from "@/store/store";
import { toast } from "react-toastify";
import Router from "next/router";
import { removeUser } from "@/store/slices/authSlice";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

const instance = axios.create({
  baseURL: "http://localhost:8000/",
});

instance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return instance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token found");

        const { data } = await axios.post(
          "http://localhost:8000/auth/refresh-token",
          { refreshToken },
          { withCredentials: false }
        );

        const newAccessToken = data.accessToken;
        const newRefreshToken = data.refreshToken;

        // Save new tokens
        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        processQueue(null, newAccessToken);

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (err) {
        processQueue(err);

        store.dispatch(removeUser());
        Router.replace("/signin");

        const pathname = window.location.pathname;
        const excludedPaths = ["/signin", "/signup"];
        const isExcluded = excludedPaths.some((path) =>
          pathname.startsWith(path)
        );
        if (!isExcluded && !toast.isActive("logout-toast")) {
          toast.error("Session expired. Please log in again.", {
            toastId: "logout-toast",
          });
        }

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
