import { useForm } from "react-hook-form";
import axios from "@/utils/axios";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import { Input } from "../inputFields";
import { useSelector } from "react-redux";

const InviteDealer = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const url = `${window.location.origin}/new-dealer/${user.id}`;

  const onSubmit = async (data) => {
    const inviteData = { ...data, companyName: user.name, url };
    try {
      setLoading(true);
      const res = await axios.post("/admin/invite/dealer", inviteData);
      toast.success(res.data.message);
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
        className="bg-white  w-full max-w-md sm:rounded-xl shadow-2xl p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800  transition"
        >
          <IoClose size={24} />
        </button>

        <h3 className="text-2xl font-bold text-slate-800mb-6 text-center">
          Invite Dealer
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Dealer Email"
            name="email"
            register={register}
            type="email"
            required="Email is required"
            error={errors.email}
            placeholder="Enter dealer's email"
            touched={touchedFields.email}
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center px-5 py-2.5 rounded-md text-white text-sm font-medium transition
                ${
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
                  <path
                    d="M100 50.5908C100 78.2051 77.6142..."
                    fill="#E5E7EB"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038..."
                    fill="currentColor"
                  />
                </svg>
              )}
              {loading ? "Sending..." : "Send Invite"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteDealer;