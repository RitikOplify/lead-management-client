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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white h-screen sm:h-auto md:rounded-xl shadow-xl w-full max-w-lg p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black cursor-pointer"
        >
          <IoClose size={24} />
        </button>

        <h3 className="text-2xl font-semibold mb-4 text-center">
          Change Company
        </h3>
        <form onSubmit={handleSubmit(onSubmit)}>
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
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#092C1C] text-white px-6 py-2 mt-6 rounded cursor-pointer"
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
