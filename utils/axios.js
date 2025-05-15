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
  baseURL: "https://leadmanagement.transmonk.in/",
  withCredentials: true, // Automatically sends cookies (accessToken, refreshToken)
});

instance.interceptors.request.use(
  (config) => {
    config.withCredentials = true; // Ensure cookies are included in each request
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
        }).then(() => {
          return instance(originalRequest); // Retry with cookies
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.get(
          "https://leadmanagement.transmonk.in/auth/refresh-token",
          {
            withCredentials: true,
          }
        );

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