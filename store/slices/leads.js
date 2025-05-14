import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  company: {
    name: "",
    id: "",
  },
  executives: [],
  dealers: [],
  leads: [],
  products: [],
  categories: [],
  visits: [],
  myLeads: [],
  dealerLead: [],
};

export const leadsReducer = createSlice({
  name: "leads",
  initialState,
  reducers: {
    addCompany: (state, action) => {
      state.company = action.payload;
    },
    addLeads: (state, action) => {
      state.leads = action.payload;
    },
    updateLead: (state, action) => {
      const updatedLead = action.payload;
      state.leads = state.leads.map((lead) =>
        lead.id === updatedLead.id ? { ...lead, ...updatedLead } : lead
      );
      state.myLeads = state.myLeads.map((lead) =>
        lead.id === updatedLead.id ? { ...lead, ...updatedLead } : lead
      );
      state.dealerLead = state.dealerLead.map((lead) =>
        lead.id === updatedLead.id ? { ...lead, ...updatedLead } : lead
      );
    },
    addMyLead: (state, action) => {
      state.myLeads = action.payload;
    },
    addDealerLead: (state, action) => {
      state.dealerLead = action.payload;
    },
    addNewLead: (state, action) => {
      state.leads.push(action.payload);
    },
    addVisits: (state, action) => {
      state.visits = action.payload;
    },
    addNewVisit: (state, action) => {
      state.visits.push(action.payload);
    },
    addExecutive: (state, action) => {
      state.executives = action.payload;
    },
    addNewExecutive: (state, action) => {
      state.executives.push(action.payload);
    },
    addDealer: (state, action) => {
      state.dealers = action.payload;
    },
    addNewDealer: (state, action) => {
      state.dealers.push(action.payload);
    },
    addProducts: (state, action) => {
      state.products = action.payload;
    },
    addNewProduct: (state, action) => {
      state.products.push(action.payload);
    },
    addCategories: (state, action) => {
      state.categories = action.payload;
    },
    addNewCategory: (state, action) => {
      state.categories.push(action.payload);
    },
  },
});

export const {
  addCompany,
  addLeads,
  addNewLead,
  addExecutive,
  addNewExecutive,
  addCategories,
  addNewDealer,
  addNewProduct,
  addProducts,
  addNewCategory,
  addDealer,
  addVisits,
  addNewVisit,
  updateLead,
  addMyLead,
  addDealerLead,
} = leadsReducer.actions;

export default leadsReducer.reducer;
