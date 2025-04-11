import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  company: [
    {
      id: "",
      name: "",
      email: "",
      executives: [],
      dealers: [],
      leads: [],
      products: [],
      categories: [],
    },
  ],
};

export const leadsReducer = createSlice({
  name: "leads",
  initialState,
  reducers: {
    addCompany: (state, action) => {
      state.company = action.payload;
    },
    addNewLead: (state, action) => {
      state.company.leads.push(action.payload);
    },
  },
});

export const { addCompany, addNewLead } = leadsReducer.actions;

export default leadsReducer.reducer;
