import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  totalPages: 0,
  loader:false,
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    addItem: (state, action) => {
      state.items.push(action.payload);
    },
    updateItem: (state, action) => {
      const index = state.items.findIndex(
        (item) => item._id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
    },
    loadItems: (state, action) => {
      state.items = action.payload.items;
      state.totalPages = action.payload.totalPages;
    },
    setLoader: (state, action) => {
      state.loader = true;
    },
    removeLoader: (state, action) => {
      state.loader = false;
    }
  },
});

export const { addItem, updateItem, removeItem, loadItems,setLoader,removeLoader } =
  inventorySlice.actions;

export default inventorySlice.reducer;
