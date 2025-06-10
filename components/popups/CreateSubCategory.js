import { useForm } from "react-hook-form";
import axios from "@/utils/axios";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { useState, useEffect } from "react";
import { Input, Select } from "../inputFields";
import { useDispatch, useSelector } from "react-redux";
import { addNewSubCat, updateSubCat } from "@/store/slices/leads";

const CreateSubcategoryForm = ({ onClose, subCategoryToEdit }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields },
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      categoryId: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const { categories } = useSelector((state) => state.leads);

  useEffect(() => {
    if (subCategoryToEdit) {
      setValue("name", subCategoryToEdit.name);
      setValue("categoryId", subCategoryToEdit.categoryId);
    } else {
      reset();
    }
  }, [subCategoryToEdit, setValue, reset]);
  const dispatch = useDispatch();
  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      let response;
      if (subCategoryToEdit) {
        response = await axios.put(
          `/admin/subcategory/${subCategoryToEdit.id}`,
          formData
        );
        dispatch(updateSubCat(response.data.subcategory));
      } else {
        response = await axios.post("/admin/subcategory", formData);
        dispatch(addNewSubCat(response.data.subcategory));
      }
      toast.success(response.data.message);
      reset();
      onClose();
    } catch (err) {
      console.log(err.response?.data?.message);
      toast.error(err.response?.data?.message || "Something went wrong");
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
        className="bg-white h-screen sm:h-auto w-full max-w-3xl rounded-xl shadow-2xl p-6 relative transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <IoClose size={24} />
        </button>

        <h3 className="text-2xl font-semibold mb-6 text-center text-slate-800">
          {subCategoryToEdit ? "Update Sub Category" : "Create Sub Category"}
        </h3>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Subcategory Name"
              name="name"
              register={register}
              type="text"
              required="Sub Category Name is required"
              error={errors.name}
              touched={touchedFields.name}
              placeholder="Enter Sub Category name"
            />
            <Select
              label="Category"
              name="categoryId"
              register={register}
              options={(categories || []).map((c) => ({
                value: c.id,
                label: c.name,
              }))}
              error={errors.categoryId}
              touched={touchedFields.categoryId}
            />
          </div>

          <div className="text-right mt-8">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                loading
                  ? "bg-emerald-900 text-white cursor-not-allowed"
                  : "bg-emerald-700 hover:bg-emerald-800 text-white shadow-md hover:shadow-lg"
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Loading...
                </div>
              ) : subCategoryToEdit ? (
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

export default CreateSubcategoryForm;
