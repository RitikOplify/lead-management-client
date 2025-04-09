import axios from "@/utils/axios";

import { addUser, removeUser, setLoading } from "../slices/authSlice";
import URL from "@/utils/config";
import { toast } from "react-toastify";

export const asyncSignUpUser = (user) => async (dispatch, getstate) => {
  try {
    const { data } = await axios.post(`${URL}/admin/signup`, user);
    dispatch(addUser(data.user));
    toast.success("User Registered Successfully");
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

export const asyncSignInUser = (user) => async (dispatch, getstate) => {
  try {
    const { data } = await axios.post(`${URL}/admin/signin`, user);
    dispatch(addUser(data.user));
    toast.dismiss();
    toast.success("User Logged In Successfully");
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

export const asyncCurrentUser =
  (pathname = "") =>
  async (dispatch, getstate) => {
    try {
      dispatch(setLoading(true));
      const { data } = await axios.get(`${URL}/admin/current`);
      dispatch(addUser(data.user));
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      const excludedPaths = ["/signin", "/signup"]; // customize as needed
      const isExcluded = excludedPaths.some((path) =>
        pathname.startsWith(path)
      );

      if (!isExcluded && !toast.isActive("logout")) {
        toast.error("Session expired. Please log in again.", {
          toastId: "session-expired",
        });
      }
    }
  };

export const asyncSignOutUser = () => async (dispatch, getState) => {
  return new Promise((resolve) => {
    document.cookie = `token=; Max-Age=-1; path=/;`;
    dispatch(removeUser());
    toast.success("Signed Out Successfully");
    resolve();
  });
};
