import axios from "@/utils/axios";
import { toast } from "react-toastify";
import {
  addItem,
  updateItem,
  loadItems,
  removeItem,
} from "../slices/inventorySlice";

export const asyncAddItem = (item) => async (dispatch) => {
  try {
    const { data } = await axios.post(`/inventory`, item, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    dispatch(addItem(data.data));
    toast.success("Item Added successfully");
  } catch (error) {
    toast.error(error.response?.data?.message || "Error Adding Item!");
  }
};

export const asyncUpdateItem = (item) => async (dispatch) => {
  try {
    const { data } = await axios.put(`/inventory/${item._id}`, item, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    dispatch(updateItem(data));
    toast.success("Item Updated Successfully");
  } catch (error) {
    toast.error(error.response?.data?.message || "Error Updating Item!");
  }
};

export const asyncLoadItems =
  (page, limit, sortBy, order) => async (dispatch) => {
    try {
      const { data } = await axios.get(
        `/inventory?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}`
      );
      dispatch(loadItems({ items: data.items, totalPages: data.totalPages }));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

export const asyncRemoveItem = (id) => async (dispatch) => {
  try {
    await axios.delete(`/inventory/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    dispatch(removeItem(id));
    toast.success("Item Removed Successfully");
  } catch (error) {
    toast.error(error.response?.data?.message || "Error Removing Item!");
  }
};
