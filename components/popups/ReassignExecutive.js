import { useForm } from "react-hook-form";
import axios from "@/utils/axios";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import { Input, Select } from "../inputFields";
import { useDispatch, useSelector } from "react-redux";
import { updateLead } from "@/store/slices/leads";

const ReassignExecutive = ({ onClose, leadId }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const { executives } = useSelector((state) => state.leads);
  const dispatch = useDispatch();

  const onSubmit = async (executiveId) => {
    const updateData = { leadId, ...executiveId };
    try {
      setLoading(true);
      const { data } = await axios.post("/admin/reassign-executive", updateData);
      dispatch(updateLead(data.lead));
      toast.success(data.message);
      reset();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white h-screen sm:h-auto rounded-none sm:rounded-2xl shadow-xl w-full max-w-lg p-6 relative transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
        >
          <IoClose size={24} />
        </button>

        <h3 className="text-xl font-semibold mb-6 text-center text-slate-800">
          Reassign Executive
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Select
            label="Select Executive"
            name="executiveId"
            register={register}
            options={(executives || []).map((e) => ({
              value: e.id,
              label: e.username,
            }))}
            touched={touchedFields.executiveId}
            error={errors.executiveId}
          />

          <div className="text-right">
            <button
              type="submit"
              disabled={loading}
              className={`px-5 py-2 rounded-lg transition font-medium ${
                loading
                  ? "bg-slate-300 text-slate-600 cursor-not-allowed"
                  : "bg-blue-700 text-white hover:bg-blue-800"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
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
                      d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 100 16v-4l-3.5 3.5L12 24v-4a8 8 0 01-8-8z"
                    />
                  </svg>
                  Updating...
                </span>
              ) : (
                "Update"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReassignExecutive;
