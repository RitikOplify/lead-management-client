import { useForm } from "react-hook-form";
import axios from "@/utils/axios";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import { Input, Select } from "../inputFields";
import { useSelector } from "react-redux";

const ReassignExecutive = ({ onClose, leadId }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const { company } = useSelector((state) => state.leads);

  const onSubmit = async (executiveId) => {
    const updateData = { leadId, ...executiveId };
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/admin/reassign-executive",
        updateData
      );
      console.log(data);
      
      setLoading(false);
      toast.success(data.message);
      reset();
      onClose();
    } catch (err) {
        console.log(err);
        
      setLoading(false);
      toast.error(err.response?.data?.message);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white h-screen sm:h-auto md:rounded-xl shadow-xl w-full max-w-lg p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black cursor-pointer"
        >
          <IoClose size={24} />
        </button>

        <h3 className="text-2xl font-semibold mb-4 text-center">
          Reassign Executive
        </h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Select
            label="Executive"
            name="executiveId"
            register={register}
            options={(company?.executives || []).map((e) => ({
              value: e.id,
              label: e.username,
            }))}
            touched={touchedFields.executiveId}
            error={errors.executiveId}
          />
          <div className="text-right mt-5">
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
                Update
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReassignExecutive;
