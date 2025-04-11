import React from "react";
import { Input, Select } from "../inputFields";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import axios from "@/utils/axios";
import URL from "@/utils/config";
function CreateFollowUp({ onClose, id }) {
  console.log(id);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm();

  const onSubmit = async (data) => {
    const followUpData = { ...data, leadId: id };
    try {
      const { data } = await axios.post(
        `${URL}/lead/create-followup`,
        followUpData
      );
      console.log(data);
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
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-6 relative"
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

export default CreateFollowUp;
