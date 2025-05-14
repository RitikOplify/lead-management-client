import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/authSlice";
import leads from "./slices/leads";

export const store = configureStore({
  reducer: {
    auth,
    leads,
  },
});
