import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/authSlice";
import admin from "./slices/adminSlice";
import leads from "./slices/leads";

export const store = configureStore({
  reducer: {
    auth,
    admin,
    leads,
  },
});
