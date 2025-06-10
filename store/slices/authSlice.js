import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  currentCompany: {
    name: "",
    id: "",
  },
  isAuthenticated: false,
  isLoading: true,
};

export const userReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      if (action.payload.role === "dealer") {
        state.currentCompany.name = action.payload?.company[0]?.company?.name;
        state.currentCompany.id = action.payload?.company[0]?.company?.id;
      }
    },
    removeUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    changeCurrentCompany: (state, action) => {
      state.currentCompany.name = action.payload.name;
      state.currentCompany.id = action.payload.id;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { addUser, removeUser, setLoading, changeCurrentCompany } =
  userReducer.actions;

export default userReducer.reducer;
