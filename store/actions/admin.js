import axios from "@/utils/axios";
import { toast } from "react-toastify";
import {
  addCategories,
  addDealer,
  addExecutive,
  addNewDealer,
  addNewExecutive,
} from "../slices/leads";

export const asyncCreateExecutive =
  (executive) => async (dispatch, getstate) => {
    try {
      const { data } = await axios.post(`/admin//sales-executive`, executive);
      toast.success(data.message);
      dispatch(addNewExecutive(data.executive));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

export const asyncGetExecutives = () => async (dispatch, getstate) => {
  try {
    const { data } = await axios.get(`/admin/sales-executives`);
    dispatch(addExecutive(data.executives));
  } catch (error) {

    // console.error(error.response.data.message);
    // toast.error(error.response.data.message);
  }
};

export const asyncApproveDealer = (dealerId) => async (dispatch, getstate) => {
  try {
    const { data } = await axios.post(`/admin/approve-dealer/${dealerId}`);
    toast.success(data.message);
    dispatch(addNewDealer(data.dealer));
  } catch (error) {
    console.log(error);

    toast.error(error.response.data.message);
  }
};

export const asyncGetDealers = () => async (dispatch, getstate) => {
  try {
    const { data } = await axios.get(`/admin/dealers`);
    dispatch(addDealer(data.dealers));
  } catch (error) {
    console.log(error);
    
    // console.error(error.response.data.message);
    // toast.error(error.response.data.message);
  }
};

export const asyncAddCategory = () => async (dispatch, getstate) => {
  try {
    const { data } = await axios.get(`/lead/categories`);
    console.log(data);
    dispatch(addCategories(data.categories));
  } catch (error) {
    // console.error(error.response.data.message);
    // toast.error(error.response.data.message);
  }
};
