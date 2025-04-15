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

export const asyncGetCompanyDtails = () => async (dispatch, getstate) => {
  try {
    const { data } = await axios.get(`/lead/alldetails`);
    console.log(data);

    dispatch(addCompany(data.company));
  } catch (error) {
    console.error(error.response.data.message);

    toast.error(error.response.data.message);
  }
};
