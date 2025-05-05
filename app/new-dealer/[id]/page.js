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
  useEffect(() => {}, []);

  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchStatus, setFetchStatus] = useState("loading");

  useEffect(() => {
    const getCompany = async () => {
      try {
        const { data } = await axios.get(`/company/${id}`);
        setCompany(data.company);
        setFetchStatus("success");
      } catch (error) {
        console.log(error);
        setFetchStatus("error");
      }
    };
    getCompany();
  }, [id]);

  if (fetchStatus === "error") {
    return (
      <div className="flex justify-center">
        <p className="font-semibold text-lg">Invalid URL</p>
      </div>
    );
  }

  const onSubmit = async (dealer) => {
    const dealerData = { ...dealer, companyId: id };
    try {
      setLoading(true);
      const { data } = await axios.post(`/dealer/register`, dealerData);
      setLoading(false);
      toast.success(data.message);
      reset();
      onClose();
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message);
      console.log(error.response?.data?.message);
    }
  };

  return (
    <div className="w-full py-10 flex items-center justify-center flex-col">
      <h2 className="text-2xl font-semibold mb-6 text-center text-[#092C1C]">
        Register
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 px-5 sm:px10 w-full sm:max-w-md"
      >
        <Input
          label="Name"
          name="name"
          register={register}
          type={"text"}
          required="Name is required"
          error={errors.name}
          placeholder={"Enter name"}
        />

        <Input
          label="Contact Person Name"
          name="contactPersonName"
          register={register}
          type={"text"}
          required="Contact Person Name is required"
          error={errors.contactPersonName}
          placeholder={"Enter contact person Name"}
        />

        <Input
          label="Email"
          name="email"
          register={register}
          type={"email"}
          required="Email is required"
          error={errors.email}
          placeholder={"Enter email"}
        />

        <Input
          label="Password"
          name="password"
          register={register}
          type={"password"}
          required="Password is required"
          error={errors.password}
          placeholder={"Enter password"}
        />
        <Input
          label="GST No"
          name="gstNo"
          register={register}
          type={"text"}
          required="GST No. is required"
          error={errors.gstNo}
          placeholder={"Enter GST No."}
        />

        <Input
          label="State"
          name="state"
          register={register}
          type={"text"}
          required="state is required"
          error={errors.state}
          placeholder={"Enter State"}
        />

        <Input
          label="City"
          name="city"
          register={register}
          type={"text"}
          required="City is required"
          error={errors.city}
          placeholder={"Enter city"}
        />

        <Input
          label="Pincode"
          name="pincode"
          register={register}
          type={"text"}
          required="pincode is required"
          error={errors.pincode}
          placeholder={"Enter pincode"}
        />

        <div className="col-span-full text-right mt-4">
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
              Register
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateDealerForm;
