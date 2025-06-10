import React, { useEffect, useRef, useState } from "react";
import { Input, Select } from "../inputFields";
import { Controller, useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import axios from "@/utils/axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { IoIosArrowDown } from "react-icons/io";
import { addNewExecutive, updateExecutive } from "@/store/slices/leads";

function CreateExecutivePopUp({ onClose, initialData }) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, touchedFields },
  } = useForm({
    defaultValues: initialData || {
      username: "",
      email: "",
      dealerIds: [],
      password: "",
      isActive: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const { company } = useSelector((state) => state.leads);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  const filteredSealers = (company?.dealers || []).filter((dealer) =>
    dealer.executiveId
      ? false
      : dealer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (initialData) {
      reset({
        username: initialData.username || "",
        email: initialData.email || "",
        dealerIds: initialData.dealerIds || [],
        password: "",
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (executive) => {
    try {
      setLoading(true);
      if (initialData?.id) {
        const { data } = await axios.put(
          `/admin/sales-executive/${initialData.id}`,
          executive
        );
        console.log(data);
        toast.success(data.message || "Success");

        dispatch(updateExecutive(data.executive));
      } else {
        const { data } = await axios.post(`/admin/sales-executive`, executive);
        dispatch(addNewExecutive(data.executive));
        console.log(data);
        toast.success(data.message || "Success");
      }

      setLoading(false);
      reset();
      onClose();
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-2"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-4xl rounded-xl shadow-2xl p-6 relative max-h-screen overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 dark:hover:text-white transition"
        >
          <IoClose size={22} />
        </button>

        <h3 className="text-2xl font-semibold mb-6 text-center">
          {initialData ? "Edit Executive" : "Create Executive"}
        </h3>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <Input
            label="Username"
            name="username"
            register={register}
            type="text"
            required="Username is required"
            error={errors.username}
            placeholder="Enter username"
            touched={touchedFields.username}
          />
          <Input
            label="Email"
            name="email"
            register={register}
            type="email"
            required="Email is required"
            error={errors.email}
            placeholder="Enter email"
            touched={touchedFields.email}
          />

          {/* Dealer Dropdown */}
          <div className="flex flex-col gap-1" ref={wrapperRef}>
            <p className="text-sm font-medium">Assign Dealers</p>
            <Controller
              name="dealerIds"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <div
                    className="flex items-center justify-between border border-slate-300 rounded-md px-3 py-2 bg-white cursor-pointer hover:border-slate-400"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <span className="text-slate-600 text-sm">
                      {field.value?.length > 0
                        ? `${field.value.length} selected`
                        : "Select Dealers"}
                    </span>
                    <IoIosArrowDown className="text-slate-500" />
                  </div>

                  {field.value?.length > 0 && !isOpen && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.value.map((id) => {
                        const dealer = company?.dealers?.find(
                          (d) => d.id === id
                        );
                        return (
                          <span
                            key={id}
                            className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs flex items-center gap-1"
                          >
                            {dealer?.dealer.name}
                            <IoClose
                              size={14}
                              className="cursor-pointer"
                              onClick={() =>
                                field.onChange(
                                  field.value.filter((val) => val !== id)
                                )
                              }
                            />
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {isOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-slate-300 rounded-md mt-1 shadow-lg z-20">
                      <input
                        ref={inputRef}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search dealers..."
                        className="w-full px-3 py-2 border-b border-slate-200 outline-none text-sm"
                      />
                      <ul className="max-h-44 overflow-y-auto">
                        {filteredSealers.map((dealer) => {
                          const isSelected = field.value.includes(dealer.id);
                          return (
                            <li
                              key={dealer.id}
                              className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer ${
                                isSelected
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "hover:bg-slate-100"
                              }`}
                              onClick={() => {
                                if (isSelected) {
                                  field.onChange(
                                    field.value.filter(
                                      (val) => val !== dealer.id
                                    )
                                  );
                                } else {
                                  field.onChange([...field.value, dealer.id]);
                                }
                              }}
                            >
                              <span>{dealer.dealer.name}</span>
                              {isSelected && (
                                <IoClose
                                  className="text-slate-500 hover:text-black"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    field.onChange(
                                      field.value.filter(
                                        (val) => val !== dealer.id
                                      )
                                    );
                                  }}
                                />
                              )}
                            </li>
                          );
                        })}
                        {filteredSealers.length === 0 && (
                          <li className="px-3 py-2 text-sm text-slate-500">
                            No dealer found
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            />
          </div>

          <Input
            label="Password"
            name="password"
            register={register}
            type="password"
            required={initialData ? false : "Password is required"}
            error={errors.password}
            placeholder={
              initialData ? "Leave blank to keep unchanged" : "Enter password"
            }
            touched={touchedFields.password}
          />

          <Select
            label="Status"
            name="isActive"
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

          <div className="col-span-full flex justify-end mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-md transition ${
                loading
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-emerald-700 hover:bg-emerald-800 text-white"
              }`}
            >
              {loading ? "Loading..." : initialData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateExecutivePopUp;
