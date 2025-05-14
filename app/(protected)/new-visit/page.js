"use client";
import React, { useState } from "react";
import Nav from "@/components/Nav";
import { Input, Select } from "@/components/inputFields";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";
import axios from "@/utils/axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const page = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Select Action");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSelect = (value) => {
    setSelected(value);
    setIsOpen(false);
  };
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, touchedFields },
    watch,
  } = useForm();

  const onSubmit = async (visit) => {
    const visitData = { ...visit, action: selected };
    try {
      setLoading(true);
      const { data } = await axios.post(`/visit/create`, visitData);
      console.log(data);
      console.log(data.visit.action);
      
      if (data.visit.action == "Convert to new lead") {
        router.push(`/new-lead?visitId=${data.visit.id}`);
      }
      setLoading(false);
      toast.success(data.message);
      reset();
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.response.data.message);
      console.error(error.response.data.message);
    }
  };

  return (
    <div className="flex h-screen">
      <Nav navOpen={navOpen} setNavOpen={setNavOpen} />
      <div className="p-6 w-full lg:w-[calc(100%-256px)] space-y-6 overflow-y-auto">
        <h1 className="text-xl font-bold mb-4">Add Visit</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className=" w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="Customer Name *"
              name="customerName"
              register={register}
              type={"text"}
              required="Customer is required"
              error={errors.customerName}
              placeholder={"Enter Customer name"}
              touched={touchedFields.customerName}
            />
            <Input
              label="Company Name *"
              name="companyName"
              register={register}
              type="text"
              required="Company Name is required"
              error={errors.companyName}
              placeholder={"Enter Company name"}
              touched={touchedFields.companyName}
            />
            <Select
              label="Purpose of Visit *"
              name="purpose"
              placeholder="purpose"
              register={register}
              options={[
                { value: "general", label: "General" },
                { value: "followup", label: "Followup" },
                { value: "promotion", label: "Promotion" },
                { value: "awareness", label: "Awareness" },
              ].map((e) => ({
                value: e.value,
                label: e.label,
              }))}
              touched={touchedFields.purpose}
              error={errors.purpose}
            />
            <Input
              label="Visit Date *"
              name="visitDate"
              register={register}
              required="Visit Date is required"
              type="date"
              placeholder="DD/MM/YYYY"
              error={errors.visitDate}
              touched={touchedFields.visitDate}
            />
            <Input
              label="Remarks"
              name="remarks"
              register={register}
              type={"text"}
              placeholder={"Enter remarks"}
            />

            <div className="flex flex-col relative">
              <label className="text-sm mb-1">Select Action</label>
              <div className="relative">
                <div
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left"
                >
                  {selected}
                </div>
                <div className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none">
                  <IoIosArrowDown size={18} className="text-black" />
                </div>
              </div>

              {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 border border-gray-300 rounded-lg bg-white shadow-md z-10">
                  <button
                    className="block px-3 py-2 w-full text-start hover:bg-gray-100 border-b border-gray-300"
                    onClick={() => handleSelect("Convert to new lead")}
                  >
                    Convert to new lead
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-gray-100"
                    onClick={() => handleSelect("NA")}
                  >
                    NA
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end mt-6">
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
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
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

export default page;
