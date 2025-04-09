"use client";
import { ToastContainer } from "react-toastify";
import { store } from "@/store/store";
import { Provider } from "react-redux";

const Wrapper = ({ children }) => {
  return (
    <>
      <Provider store={store}>
        {children}
        <ToastContainer
          limit={1}
          position="top-right"
          autoClose={1500}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          pauseOnHover
        />
      </Provider>
    </>
  );
};

export default Wrapper;
