import axios from "@/utils/axios";
import { addUser, removeUser, setLoading } from "../slices/authSlice";
import { toast } from "react-toastify";
import { setAccessToken, setRefreshToken } from "@/utils/setToken";

export const asyncSignUpUser = (user) => async (dispatch, getstate) => {
  try {
    const { data } = await axios.post(`/admin/signup`, user);
    dispatch(addUser(data.user));
    console.log(data.user);

    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    toast.success("User Registered Successfully");
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

export const asyncSignInUser = (user) => async (dispatch, getstate) => {
  try {
    const { data } = await axios.post(`/auth/signin`, user);
    console.log(data);
    console.log(data.user);

    dispatch(addUser(data.user));
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    toast.success("User Logged In Successfully");
  } catch (error) {
    console.log(error);

    // toast.error(error.response.data.message);
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

export const asyncCurrentUser = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));
    const { data } = await axios.get(`/auth/current`);
    dispatch(setLoading(false));
    dispatch(addUser(data.user));
    
  } catch (error) {
    dispatch(setLoading(false));
  }
};

export const asyncSignOutUser = () => async (dispatch, getState) => {
  try {
    const { data } = await axios.get("/auth/logout");
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
