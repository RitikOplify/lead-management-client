"use client";

import { useForm } from "react-hook-form";
import axios from "@/utils/axios";
import { use, useEffect, useState } from "react";
import { Input } from "@/components/inputFields";
import { toast } from "react-toastify";

const CreateDealerForm = ({ params }) => {
  const { id } = use(params);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchStatus, setFetchStatus] = useState("loading");

  useEffect(() => {
    const getCompany = async () => {
      try {
        const { data } = await axios.get(`/company/${id}`);
        setCompany(data.company);
        setFetchStatus("success");
      } catch (error) {
        console.error(error);
        setFetchStatus("error");
      }
    };
    getCompany();
  }, [id]);

  const onSubmit = async (dealer) => {
    const dealerData = { ...dealer, companyId: id };
    try {
      setLoading(true);
      const { data } = await axios.post(`/dealer/register`, dealerData);
      toast.success(data.message);
      reset();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Something went wrong");
      console.error(error.response?.data);
    }
  };

  if (fetchStatus === "error") {
    return (
      <div className="flex justify-center items-center h-[40vh]">
        <p className="text-lg font-medium text-red-600">Invalid Company URL</p>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-center text-[#092C1C] mb-2">
          Dealer Registration
        </h2>
        {company && (
          <p className="text-center text-gray-600 mb-6 text-sm">
            Registering under: <span className="font-medium">{company.name}</span>
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Dealer Name"
            name="name"
            register={register}
            required="Name is required"
            error={errors.name}
            placeholder="Enter dealer name"
          />
          <Input
            label="Contact Person"
            name="contactPersonName"
            register={register}
            required="Contact person name is required"
            error={errors.contactPersonName}
            placeholder="Enter contact person's name"
          />
          <Input
            label="Email"
            name="email"
            type="email"
            register={register}
            required="Email is required"
            error={errors.email}
            placeholder="Enter email address"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            register={register}
            required="Password is required"
            error={errors.password}
            placeholder="Enter password"
          />
          <Input
            label="GST Number"
            name="gstNo"
            register={register}
            required="GST No. is required"
            error={errors.gstNo}
            placeholder="Enter GST number"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="State"
              name="state"
              register={register}
              required="State is required"
              error={errors.state}
              placeholder="Enter state"
            />
            <Input
              label="City"
              name="city"
              register={register}
              required="City is required"
              error={errors.city}
              placeholder="Enter city"
            />
          </div>
          <Input
            label="Pincode"
            name="pincode"
            register={register}
            required="Pincode is required"
            error={errors.pincode}
            placeholder="Enter pincode"
          />

          <div className="pt-4 text-right">
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center gap-2 bg-[#092C1C] text-white font-medium py-2 px-4 rounded-md transition hover:bg-[#0c3a26] ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading && (
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
              )}
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDealerForm;
