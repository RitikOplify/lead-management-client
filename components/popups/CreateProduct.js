import axios from "@/utils/axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Input, Select } from "../inputFields";
import { addNewProduct, updateProduct } from "@/store/slices/leads";

const CreateProductForm = ({
  onClose,
  defaultValues = {},
  productId = null,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, touchedFields },
  } = useForm();

  const { categories } = useSelector((state) => state.leads);
  const [loading, setLoading] = useState(false);

  const categoryId = watch("categoryId");
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    if (categoryId) {
      const selectedCategory = categories.find((cat) => cat.id === categoryId);
      setFilteredSubcategories(selectedCategory?.subcategories || []);
    } else {
      setFilteredSubcategories([]);
    }
  }, [categoryId, categories]);
  const dispatch = useDispatch();
  const onSubmit = async (product) => {
    try {
      setLoading(true);

      if (productId) {
        const { data } = await axios.put(
          `/admin/product/${productId}`,
          product
        );
        dispatch(updateProduct(data.product));
        toast.success(data.message);
        reset();
        onClose();
      } else {
        const { data } = await axios.post("/admin/product", product);
        dispatch(addNewProduct(data.product));
        toast.success(data.message);
        reset();
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white h-screen sm:h-auto w-full max-w-4xl p-6 rounded-none sm:rounded-2xl shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 transition"
        >
          <IoClose size={24} />
        </button>

        {/* Header */}
        <h3 className="text-center text-2xl font-semibold text-slate-800 mb-6">
          {productId ? "Update Product" : "Create Product"}
        </h3>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Product Name"
              name="name"
              register={register}
              type="text"
              required="Product name is required"
              error={errors.name}
              placeholder="Enter product name"
              touched={touchedFields.name}
            />

            <Select
              label="Category"
              name="categoryId"
              register={register}
              options={categories.map((c) => ({
                value: c.id,
                label: c.name,
              }))}
              error={errors.categoryId}
              touched={touchedFields.categoryId}
            />

            {categoryId && (
              <Select
                label="Subcategory"
                name="subcategoryId"
                register={register}
                options={filteredSubcategories.map((c) => ({
                  value: c.id,
                  label: c.name,
                }))}
                error={errors.subcategoryId}
                touched={touchedFields.subcategoryId}
              />
            )}
          </div>

          {/* Submit Button */}
          <div className="text-right">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-md transition-all duration-200 font-medium 
              ${
                loading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-[#092C1C] text-white hover:bg-[#0b3a27]"
              }`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 animate-spin text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Processing...
                </div>
              ) : productId ? (
                "Update"
              ) : (
                "Create"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductForm;
