import axios from "@/utils/axios";
import URL from "@/utils/config";
import { toast } from "react-toastify";
import { addDealers, addExecutive, newExecutive } from "../slices/adminSlice";

export const asyncCreateExecutive =
  (executive) => async (dispatch, getstate) => {
    try {
      const { data } = await axios.post(
        `${URL}/admin//sales-executive`,
        executive
      );
      toast.success(data.message);
      dispatch(newExecutive(data.executive));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

export const asyncGetExecutive = () => async (dispatch, getstate) => {
  try {
    const { data } = await axios.get(`${URL}/admin/sales-executives`);
    console.log(data);
    dispatch(addExecutive(data.executives));
    toast.success(data.message);
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.message);
  }
};

// export const asyncCreateAprove = (executive) => async (dispatch, getstate) => {
//   try {
//     const { data } = await axios.post(
//       `${URL}/admin//sales-executive`,
//       executive
//     );
//     toast.success(data.message);
//     dispatch(newExecutive(data.executive));
//   } catch (error) {
//     toast.error(error.response.data.message);
//   }
// };

export const asyncGetDealers = () => async (dispatch, getstate) => {
  try {
    const { data } = await axios.get(`${URL}/admin/dealers`);
    console.log(data);
    dispatch(addDealers(data.dealers));
    toast.success(data.message);
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.message);
  }
};
