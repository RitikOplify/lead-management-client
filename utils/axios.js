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
  baseURL: "https://leadmanagementapi.transmonk.in/",
  withCredentials: true, // only needed here because accessToken is in cookie
});

instance.interceptors.request.use(
  (config) => {
    // Do not touch cookies manually — let browser send them via `withCredentials: true`
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
        }).then(() => instance(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token found");

        // Call refresh token API manually with token from localStorage
        const { data } = await axios.post(
          "https://leadmanagementapi.transmonk.in/auth/refresh-token",
          { refreshToken },
          { withCredentials: false }
        );

        const newRefreshToken = data.refreshToken;
        localStorage.setItem("refreshToken", newRefreshToken);
        // Backend will set accessToken as a secure HTTP-only cookie
        processQueue(null);
        return instance(originalRequest); // Retry original request
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
