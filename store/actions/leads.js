import axios from "@/utils/axios";
import URL from "@/utils/config";
import { addCompany, addNewLead } from "../slices/leads";
import { toast } from "react-toastify";

export const asyncCreateLeads = (lead) => async (dispatch, getstate) => {
  try {
    const { data } = await axios.post(`/lead/create`, lead);
    dispatch(addNewLead(data.lead));
    toast.success(data.message);
  } catch (error) {
    console.error(error.response.data.message);
    toast.error(error.response.data.message);
  }
};

export const asyncGetCompanyDtails =
  (companyId) => async (dispatch, getstate) => {
    try {
      const { data } = await axios.get(
        `/lead/alldetails?companyId=${companyId}`
      );
      console.log(data);

      dispatch(addCompany(data.company));
    } catch (error) {
      // console.error(error.response.data.message);
      // toast.error(error.response.data.message);
    }
  };

export const asyncGetAllLeads = () => async (dispatch, getstate) => {
  try {
    const { data } = await axios.get(`/lead/all-leads`);
    // dispatch(addCompany(data.company));
  } catch (error) {
    // console.error(error.response.data.message);
    // toast.error(error.response.data.message);
  }
};

export const asyncGetCategory = () => async (dispatch, getstate) => {
  try {
    const { data } = await axios.get(`/lead/category`);
    // dispatch(addCompany(data.company));
  } catch (error) {
    // console.error(error.response.data.message);
    // toast.error(error.response.data.message);
  }
};