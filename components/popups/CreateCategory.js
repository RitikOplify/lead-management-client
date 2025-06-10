import { useForm } from "react-hook-form";
import axios from "@/utils/axios";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import { Input } from "../inputFields";
import { useDispatch } from "react-redux";
import { addNewCategory, updateCategory } from "@/store/slices/leads";

const CreateCategoryForm = ({ onClose, categoryToEdit = null }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields },
  } = useForm({
    defaultValues: {
      name: categoryToEdit?.name || "",
    },
  });

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      if (categoryToEdit) {
        const { data } = await axios.put(
          `/admin/category/${categoryToEdit.id}`,
          formData
        );
        dispatch(updateCategory(data.category));
        onClose();
        toast.success(data.message);
      } else {
        const { data } = await axios.post("/admin/category", formData);
        dispatch(addNewCategory(data.category));
        toast.success(data.message);
      }
      reset();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg h-screen sm:h-auto md:rounded-xl shadow-2xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 transition"
        >
          <IoClose size={24} />
        </button>

        {/* Title */}
        <h3 className="text-2xl font-semibold mb-6 text-center text-slate-800">
          {categoryToEdit ? "Update Category" : "Create Category"}
        </h3>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Category Name"
            name="name"
            register={register}
            type="text"
            required="Category name is required"
            error={errors.name}
            placeholder="Enter category name"
            touched={touchedFields.name}
          />

          {/* Button */}
          <div className="mt-6 flex justify-end">
            {loading ? (
              <button
                disabled
                type="button"
                className="px-5 py-2 rounded-md bg-emerald-800 text-white flex items-center gap-2 cursor-not-allowed"
              >
                <svg
                  aria-hidden="true"
                  role="status"
                  className="w-4 h-4 animate-spin"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142..."
                    fill="#E5E7EB"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038..."
                    fill="currentColor"
                  />
                </svg>
                Loading...
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {categoryToEdit ? "Update" : "Create"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCategoryForm;
