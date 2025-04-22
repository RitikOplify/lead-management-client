import { useForm } from "react-hook-form";
import axios from "@/utils/axios";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import { Input, Select } from "../inputFields";
import { useSelector } from "react-redux";

const CreateSubcategoryForm = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const { company } = useSelector((state) => state.leads);

  const onSubmit = async (cat) => {
    try {
      setLoading(true);
      const { data } = await axios.post("/admin/subcategory", cat);
      setLoading(false);
      toast.success(data.message);
      reset();
      onCategoryClose();
    } catch (err) {
      setLoading(false);
      toast.error(err.response?.data?.message);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white h-screen sm:h-auto md:rounded-xl shadow-xl w-full max-w-4xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black cursor-pointer"
        >
          <IoClose size={24} />
        </button>

        <h3 className="text-2xl font-semibold mb-4 text-center">
          Create Sub Category
        </h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <Input
            label="Subcategory Name"
            name="name"
            register={register}
            type={"text"}
            required="Sub Category Name is required"
            error={errors.name}
            placeholder={"Enter Sub Category name"}
            touched={touchedFields.name}
          />
          <Select
            label="Category"
            name="categoryId"
            register={register}
            options={(company.categories || []).map((c) => ({
              value: c.id,
              label: c.name,
            }))}
            error={errors.categoryId}
            touched={touchedFields.categoryId}
          />

          <div className="text-right mt-5">
            {loading ? (
              <button
                disabled
                type="button"
                className="px-3 py-2 rounded-lg bg-green-950 text-white"
              >
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline w-4 h-4 me-3 text-white animate-spin"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591..."
                    fill="#E5E7EB"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116..."
                    fill="currentColor"
                  />
                </svg>
                Loading...
              </button>
            ) : (
              <button
                type="submit"
                className="bg-[#092C1C] text-white px-6 py-2 rounded cursor-pointer"
              >
                Create
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSubcategoryForm;
