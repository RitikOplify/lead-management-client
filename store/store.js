import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/authSlice";
import admin from "./slices/adminSlice";

export const store = configureStore({
  reducer: {
    auth,
    admin,
  },
});
