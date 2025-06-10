import { useForm } from "react-hook-form";
import axios from "@/utils/axios";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Select } from "../inputFields";

const UpdateDealerStatus = ({ onClose, dealerId }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      const { data } = await axios.post("/admin/update-dealer-status", {
        dealerId,
        status: formData.status,
      });
    //   dispatch(UpdateDealerStatus(data.dealer));
      toast.success(data.message || "Dealer status updated successfully");
      reset();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md sm:rounded-xl shadow-2xl p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
        >
          <IoClose size={24} />
        </button>

        <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">
          Update Dealer Status
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Select
            label="Status"
            name="status"
            register={register}
            options={[
              { label: "Inactive", value: "INACTIVE" },
              { label: "Active", value: "ACTIVE" },
            ].map((e) => ({
              value: e.value,
              label: e.label,
            }))}
            placeholder="Status"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center px-5 py-2.5 rounded-md text-white text-sm font-medium transition ${
                loading
                  ? "bg-slate-600 cursor-not-allowed"
                  : "bg-slate-800 hover:bg-slate-700"
              }`}
            >
              {loading && (
                <svg
                  className="w-4 h-4 mr-2 animate-spin text-white"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M100 50.5908C100 78.2051..." fill="#E5E7EB" />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038..."
                    fill="currentColor"
                  />
                </svg>
              )}
              {loading ? "Updating..." : "Update Status"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateDealerStatus;
