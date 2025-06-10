import React, { useState } from "react";
import { CustomSelectInput, Input, Select } from "../inputFields";
import { useForm, useWatch } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import axios from "@/utils/axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateLead } from "@/store/slices/leads";

function CreateFollowUp({ onClose, id }) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, touchedFields },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const currentStatus = useWatch({ control, name: "status" });
  const nextFollowUpStep = useWatch({ control, name: "nextFollowUpStep" });

  const onSubmit = async (data) => {
    const followUpData = { ...data, leadId: id };
    try {
      setLoading(true);
      const { data } = await axios.post(`/lead/create-followup`, followUpData);
      setLoading(false);
      dispatch(updateLead(data.lead));
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
        className="bg-white w-full max-w-5xl h-screen sm:h-auto p-6 md:rounded-xl shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <IoClose size={24} />
        </button>

        <h3 className="text-2xl font-semibold mb-6 text-center text-slate-800">
          Follow-Up
        </h3>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {/* Status */}
          <CustomSelectInput
            label="Current Status"
            name="status"
            register={register}
            required="Status is required"
            options={[
              { value: "NEW" },
              { value: "FOLLOW_UP" },
              { value: "OPEN" },
              { value: "TECHNICAL_DISCUSSION" },
              { value: "QUOATION" },
              { value: "NEGOTIATION" },
              { value: "CLOSED" },
            ]}
            touched={touchedFields.status}
            error={errors?.status}
          />
          <Input
            label="Price"
            name="price"
            register={register}
            type="number"
            placeholder="Price"
          />
          {/* Final Status if CLOSED */}
          {currentStatus === "CLOSED" && (
            <Select
              label="Final Status"
              name="finalStatus"
              register={register}
              required="Final status is required"
              options={["CONVERTED", "LOST"].map((val) => ({
                value: val,
                label: val,
              }))}
              touched={touchedFields.finalStatus}
              error={errors.finalStatus}
            />
          )}

          {/* Next Follow Up */}
          {currentStatus !== "CLOSED" && (
            <>
              <CustomSelectInput
                label="Next Follow Up Step"
                name="nextFollowUpStep"
                register={register}
                options={[
                  { value: "NEGOTIATION" },
                  { value: "CALL" },
                  { value: "VISIT" },
                  { value: "MAIL" },
                ]}
                touched={touchedFields.nextFollowUpStep}
                error={errors?.nextFollowUpStep}
              />

              {nextFollowUpStep && (
                <Input
                  label="Next Follow Up Date"
                  name="nextFollowUpDate"
                  register={register}
                  type="date"
                  placeholder="DD/MM/YYYY"
                  required="Date is required"
                  touched={touchedFields.nextFollowUpDate}
                  error={errors?.nextFollowUpDate}
                />
              )}
            </>
          )}

          {/* Comments */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-slate-700 mb-1">
              Additional Comments
            </label>
            <textarea
              rows="3"
              {...register("message")}
              placeholder="Type your message here"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-600 resize-none transition-shadow"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="col-span-full text-right mt-4">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                loading
                  ? "bg-slate-600 cursor-not-allowed text-white"
                  : "bg-slate-800 hover:bg-slate-900 text-white"
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="w-4 h-4 animate-spin text-white"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="#E5E7EB"
                      strokeWidth="10"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539..."
                      fill="currentColor"
                    />
                  </svg>
                  Loading...
                </span>
              ) : (
                "Create"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateFollowUp;
