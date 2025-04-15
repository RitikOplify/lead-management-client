import React, { useState } from "react";
import { Input, Select } from "../inputFields";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import axios from "@/utils/axios";
import URL from "@/utils/config";
import { toast } from "react-toastify";
function CreateFollowUp({ onClose, id }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields },
  } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    const followUpData = { ...data, leadId: id };
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${URL}/lead/create-followup`,
        followUpData
      );
      setLoading(false);
      toast.success(data.message);
      reset();
      onClose();
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message);
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
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <IoClose size={24} />
        </button>

        <h3 className="text-2xl font-semibold mb-4 text-center">Follow-Up</h3>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <Select
            label="Follow-Up Status"
            name="status"
            register={register}
            required="Follow-up status is required"
            options={["NEW", "IN_PROGRESS", "CLOSED"].map((val) => ({
              value: val,
              label: val,
            }))}
            touched={touchedFields.followUp?.status}
            error={errors?.followUp?.status}
          />
          <Select
            label="Follow-Up Stage"
            name="stage"
            register={register}
            required="Follow-up stage is required"
            options={["INQUIRY", "NEGOTIATION", "FINALIZED"].map((val) => ({
              value: val,
              label: val,
            }))}
            touched={touchedFields.followUp?.stage}
            error={errors?.followUp?.stage}
          />
          <Input
            label="Follow-Up Date"
            name="date"
            register={register}
            type="date"
            placeholder="DD/MM/YYYY"
            required="Date is required"
            touched={touchedFields.followUp?.date}
            error={errors?.followUp?.date}
          />
          <Input
            label="Follow-Up Time"
            name="time"
            register={register}
            type="time"
            touched={touchedFields.followUp?.time}
            required="Time is required"
            error={errors?.followUp?.time}
          />
          <Input
            label="Follow-Up Message"
            name="message"
            register={register}
            touched={touchedFields.followUp?.message}
            placeholder="Enter message"
            required="Message is required"
            error={errors?.followUp?.message}
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
}

export default CreateFollowUp;
