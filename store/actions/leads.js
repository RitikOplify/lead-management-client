import axios from "@/utils/axios";
import {
  addDealerLead,
  addLeads,
  addMyLead,
  addNewLead,
  addProducts,
  addVisits,
  setLeadPagination,
} from "../slices/leads";
import { toast } from "react-toastify";

export const asyncCreateLeads = (lead, reset) => async (dispatch, getstate) => {
  try {
    const { data } = await axios.post(`/lead/create`, lead);
    reset();
    dispatch(addNewLead(data.lead));
    toast.success(data.message);
  } catch (error) {
    console.error(error.response.data.message);
    toast.error(error.response.data.message);
  }
};

// export const asyncGetAllLeads = () => async (dispatch, getstate) => {
//   try {
//     const { data } = await axios.get(`/lead/all-leads`);
//     dispatch(addLeads(data.leads));
//   } catch (error) {
//     // console.error(error.response.data.message);
//     // toast.error(error.response.data.message);
//   }
// };

export const asyncGetAllLeads =
  (page = 1, limit = 10, setLoading) =>
  async (dispatch, getState) => {
    try {
      if (typeof setLoading === "function") setLoading(true);
      const { data } = await axios.get(
        `/lead/all-leads?page=${page}&limit=${limit}`
      );
      dispatch(
        setLeadPagination({ leads: data.leads, total: data.totalPages, page })
      );
    } catch (error) {
      console.error(error.response?.data?.message);
      // toast.error(error.response?.data?.message || "Failed to fetch leads");
    } finally {
      if (typeof setLoading === "function") setLoading(false);
    }
  };


export const asyncAddProducts = () => async (dispatch, getstate) => {
  try {
    const { data } = await axios.get(`/company/products`);
    dispatch(addProducts(data.products));
    // toast.success(data.message);
  } catch (error) {
    console.log(error);

    // console.error(error.response.data.message);
    // toast.error(error.response.data.message);
  }
};

export const asyncAddVisits = () => async (dispatch, getstate) => {
  try {
    const { data } = await axios.get(`/visit`);
    console.log(data);
    dispatch(addVisits(data.visits));
    // toast.success(data.message);
  } catch (error) {
    // console.log(error);
    // console.error(error.response.data.message);
    // toast.error(error.response.data.message);
  }
};

export const asyncAddMyLeads =
  (company, setLoading) => async (dispatch, getstate) => {
    try {
      if (typeof setLoading === "function") setLoading(true);
      const { data } = await axios.get(`/lead/my-lead?companyId=${company.id}`);
      console.log(data);
      dispatch(addMyLead(data.leads));
      // toast.success(data.message);
    } catch (error) {
      // console.log(error);
      // console.error(error.response.data.message);
      toast.error(error.response.data.message);
    } finally {
      if (typeof setLoading === "function") setLoading(false);
    }
  };

export const asyncAddDealerLeads = () => async (dispatch, getstate) => {
  try {
    const { data } = await axios.get(`/lead/dealer-lead`);
    console.log(data);
    dispatch(addDealerLead(data.leads));
    // toast.success(data.message);
  } catch (error) {
    // console.log(error);
    // console.error(error.response.data.message);
    // toast.error(error.response.data.message);
  }
};

// const { data } = await axios.get(`/lead/dealer-lead`);
