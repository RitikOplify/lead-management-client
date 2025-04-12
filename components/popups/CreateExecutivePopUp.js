import React from "react";
import { Input, Select } from "../inputFields";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import axios from "@/utils/axios";
import URL from "@/utils/config";
function CreateExecutivePopUp({ onClose }) {
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm();

  const onSubmit = async (executive) => {
    try {
      const { data } = await axios.post(
        `${URL}/admin/sales-executive`,
        executive
      );
      onClose();
    } catch (error) {
      console.error(error.response.data.message);
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
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <IoClose size={24} />
        </button>

        <h3 className="text-2xl font-semibold mb-4 text-center">
          Create Executive
        </h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <Input
            label="Username"
            name="username"
            register={register}
            type={"text"}
            required="Username is required"
            error={errors.name}
            placeholder={"Enter Username"}
            touched={touchedFields.name}
          />
          <Input
            label="Email"
            name="email"
            register={register}
            type="email"
            required="Email is required"
            error={errors.email}
            placeholder={"Enter email"}
            touched={touchedFields.email}
          />
          <Input
            label="Password"
            name="password"
            register={register}
            type="password"
            required="Password is required"
            error={errors.password}
            placeholder={"Enter password"}
            touched={touchedFields.password}
          />

          <div className="col-span-full text-right mt-4">
            <button
              type="submit"
              className="bg-[#092C1C] text-white px-6 py-2 rounded-lg hover:bg-[#074425] transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateExecutivePopUp;
