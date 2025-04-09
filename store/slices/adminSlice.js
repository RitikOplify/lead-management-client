import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  executives: [],
  dealers: [],
  isLoading: true,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    addExecutive: (state, action) => {
      state.executives = action.payload;
    },
    newExecutive: (state, action) => {
      state.executives = [...state.executives, action.payload];
    },

    addDealers: (state, action) => {
      state.dealers = action.payload;
    },
    newDealers: (state, action) => {
      state.dealers = [...state.dealers, action.payload];
    },
  },
});

export const { addDealers, addExecutive, newDealers, newExecutive } =
  adminSlice.actions;

export default adminSlice.reducer;
