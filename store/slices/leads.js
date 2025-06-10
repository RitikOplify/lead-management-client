import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  company: {
    name: "",
    id: "",
  },
  executives: [],
  dealers: [],
  leads: [],
  totalLeads: 0,
  currentPage: 1,
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
    setLeadPagination: (state, action) => {
      state.leads = action.payload.leads;
      state.totalLeads = action.payload.total;
      state.currentPage = action.payload.page;
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
    updateExecutive: (state, action) => {
      const updatedExecutive = action.payload;
      state.executives = state.executives.map((executive) =>
        executive.id === updatedExecutive.id
          ? { ...executive, ...updatedExecutive }
          : executive
      );
    },
    addNewExecutive: (state, action) => {
      state.executives.push(action.payload);
    },

    addDealer: (state, action) => {
      state.dealers = action.payload;
    },
    updateDealer: (state, action) => {
      const updatedDealer = action.payload;
      state.dealers = state.dealers.map((dealer) =>
        dealer.id === updatedDealer.id
          ? { ...dealer, ...updatedDealer }
          : dealer
      );
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
    updateProduct: (state, action) => {
      const updatedProduct = action.payload;
      state.products = state.products.map((product) =>
        product.id === updatedProduct.id
          ? { ...product, ...updatedProduct }
          : product
      );
    },
    addCategories: (state, action) => {
      state.categories = action.payload;
    },
    updateCategory: (state, action) => {
      const updatedCategory = action.payload;
      state.categories = state.categories.map((cat) =>
        cat.id === updatedCategory.id ? { ...cat, ...updatedCategory } : cat
      );
    },
    addNewCategory: (state, action) => {
      state.categories.push(action.payload);
    },
    updateSubCat: (state, action) => {
      const updatedSubCat = action.payload;
      state.categories = state.categories.map((cat) => {
        return {
          ...cat,
          subcategories: cat.subcategories.map((subCategory) =>
            subCategory.id === updatedSubCat.id
              ? { ...subCategory, ...updatedSubCat }
              : subCategory
          ),
        };
      });
    },
    addNewSubCat: (state, action) => {
      const newSubCat = action.payload;
      state.categories = state.categories.map((category) => {
        if (category.id === newSubCat.categoryId) {
          return {
            ...category,
            subcategories: [...(category.subcategories || []), newSubCat],
          };
        }
        return category;
      });
    },
  },
});

export const {
  setLeadPagination,
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
  updateExecutive,
  addDealerLead,
  updateProduct,
  updateCategory,
  updateSubCat,
  addNewSubCat,
} = leadsReducer.actions;

export default leadsReducer.reducer;
