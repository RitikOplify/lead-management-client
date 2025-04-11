import axios from "@/utils/axios";
import { addUser, removeUser, setLoading } from "../slices/authSlice";
import URL from "@/utils/config";
import { toast } from "react-toastify";
import { setAccessToken, setRefreshToken } from "@/utils/setToken";

export const asyncSignUpUser = (user) => async (dispatch, getstate) => {
  try {
    const { data } = await axios.post(`${URL}/admin/signup`, user);
    dispatch(addUser(data.user));
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    toast.success("User Registered Successfully");
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

export const asyncSignInUser = (user) => async (dispatch, getstate) => {
  try {
    const { data } = await axios.post(`${URL}/admin/signin`, user);
    dispatch(addUser(data.user));
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    toast.success("User Logged In Successfully");
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

// export const asyncCurrentUser =
//   (pathname = "") =>
//   async (dispatch, getstate) => {
//     try {
//       dispatch(setLoading(true));
//       const { data } = await axios.get(`${URL}/admin/current`);
//       dispatch(setLoading(false));
//       dispatch(addUser(data.user));
//     } catch (error) {
//       dispatch(setLoading(false));
//       const excludedPaths = ["/signin", "/signup"];
//       const isExcluded = excludedPaths.some((path) =>
//         pathname.startsWith(path)
//       );

//       if (!isExcluded && !toast.isActive("logout")) {
//         toast.error("Session expired. Please log in again.", {
//           toastId: "session-expired",
//         });
//       }
//     }
//   };

export const asyncCurrentUser =
  (pathname = "") =>
  async (dispatch, getState) => {
    try {
      dispatch(setLoading(true));
      const { data } = await axios.get(`${URL}/admin/current`);
      dispatch(setLoading(false));
      dispatch(addUser(data.user));
    } catch (error) {
      const excludedPaths = ["/signin", "/signup"];
      const isExcluded = excludedPaths.some((path) =>
        pathname.startsWith(path)
      );
      if (error.response && [401, 403].includes(error.response.status)) {
        try {
          const { data: token } = await axios.get(`${URL}/admin/refresh-token`);
          setAccessToken(token.accessToken);
          setRefreshToken(token.refreshToken);
          const { data } = await axios.get(`${URL}/admin/current`);
          dispatch(addUser(data.user));
          dispatch(setLoading(false));
          return;
        } catch (refreshError) {
          dispatch(setLoading(false));
        }
      }
      dispatch(setLoading(false));
      if (!isExcluded && !toast.isActive("logout")) {
        toast.error("Session expired. Please log in again.", {
          toastId: "session-expired",
        });
      }
    }
  };

export const asyncSignOutUser = () => async (dispatch, getState) => {
  try {
    const { data } = await axios.get("/admin/logout");
    if (data.success) {
      dispatch(removeUser());
      toast.warn(data.message, { toastId: "logout" });
    } else {
      toast.error("Logout failed. Please try again.");
    }
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong during logout.");
  }
};
