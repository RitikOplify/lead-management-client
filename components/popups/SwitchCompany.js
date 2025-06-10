import React from "react";
import { IoClose } from "react-icons/io5";
import { Select } from "../inputFields";
import { useDispatch, useSelector } from "react-redux";
import { changeCurrentCompany } from "@/store/slices/authSlice";
import { useForm } from "react-hook-form";

function SwitchCompany({ onClose }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields },
  } = useForm();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    const selectedCompany = JSON.parse(data.company);
    if (selectedCompany.id && selectedCompany.name) {
      dispatch(changeCurrentCompany(selectedCompany));
      reset();
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white  rounded-lg shadow-lg w-full max-w-md p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-gray-400  transition-colors duration-300"
        >
          <IoClose size={24} />
        </button>

        <h3 className="text-2xl font-semibold mb-6 text-gray-900  text-center">
          Change Company
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Select
            label="Company"
            name="company"
            register={register}
            options={(user?.company || []).map((company) => ({
              value: JSON.stringify({
                name: company.company.name,
                id: company.company.id,
              }),
              label: company.company.name,
            }))}
            required={"Company is required"}
            touched={touchedFields.company}
            error={errors.company}
            className="mb-6"
          />

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="inline-block bg-slate-800 hover:bg-slate-700 focus:bg-slate-700 text-white font-medium px-6 py-2 rounded-md shadow-md transition-colors duration-300"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SwitchCompany;
