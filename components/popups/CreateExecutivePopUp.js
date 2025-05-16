import React, { useEffect, useRef, useState } from "react";
import { Input } from "../inputFields";
import { Controller, useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import axios from "@/utils/axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { IoIosArrowDown } from "react-icons/io";

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
    },
  });

  const [loading, setLoading] = useState(false);
  const { company } = useSelector((state) => state.leads);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const filteredSealers = (company?.dealers || []).filter((dealer) =>
    dealer.executiveId
      ? false
      : dealer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // When initialData changes (edit mode), reset the form with new values
  useEffect(() => {
    if (initialData) {
      reset({
        username: initialData.username || "",
        email: initialData.email || "",
        dealerIds: initialData.dealerIds || [],
        password: "", // For security, do not pre-fill password
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (executive) => {
    // If you want to enforce dealer selection uncomment below:
    // if (!executive.dealerIds || executive.dealerIds.length === 0) {
    //   toast.error("Please select at least one dealer.");
    //   return;
    // }

    try {
      setLoading(true);
      if (initialData?.id) {
        // EDIT MODE - PUT or PATCH request to update executive
        const { data } = await axios.put(
          `/admin/sales-executive/${initialData.id}`,
          executive
        );
        toast.success(data.message || "Executive updated successfully");
      } else {
        // CREATE MODE - POST request to create executive
        const { data } = await axios.post(`/admin/sales-executive`, executive);
        toast.success(data.message || "Executive created successfully");
      }
      setLoading(false);
      reset();
      onClose();
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error(
        error.response?.data?.message || "Something went wrong, please try again"
      );
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
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black cursor-pointer"
        >
          <IoClose size={24} />
        </button>

        <h3 className="text-2xl font-semibold mb-4 text-center">
          {initialData ? "Edit Executive" : "Create Executive"}
        </h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <Input
            label="Username"
            name="username"
            register={register}
            type={"text"}
            required="Username is required"
            error={errors.username}
            placeholder={"Enter Username"}
            touched={touchedFields.username}
          />
          <Input
            label="Email"
            name="email"
            register={register}
            type="email"
            required="Email is required"
            error={errors.email}
            placeholder={"Enter email"}
            touched={touchedFields.email}
          />

          <div className="flex justify-between flex-col items-center">
            <Controller
              name="dealerIds"
              control={control}
              render={({ field }) => (
                <div className="w-full relative" ref={wrapperRef}>
                  <p className="mb-1 text-sm">Assign Dealers</p>

                  <div>
                    <div
                      onClick={() => setIsOpen(!isOpen)}
                      className="border border-gray-300 flex items-center justify-between px-3 py-2 rounded-md cursor-pointer bg-white"
                    >
                      <span className="text-gray-500">
                        {field.value?.length > 0
                          ? `${field.value.length} selected`
                          : "Select Dealers"}
                      </span>
                      <IoIosArrowDown />
                    </div>

                    {!isOpen && field.value?.length > 0 && (
                      <div className="overflow-hidden sm:absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-md z-10 mt-1">
                        <div className="flex overflow-x-auto custom-scroller4 whitespace-nowrap py-2 gap-1">
                          {(field.value || []).map((id) => {
                            const dealer = company?.dealers?.find(
                              (d) => d.id === id
                            );
                            return (
                              <div
                                key={id}
                                className="flex items-center gap-1 px-2 bg-green-100 py-0.5 rounded-sm text-sm"
                              >
                                {dealer?.dealer.name}
                                <IoClose
                                  className="cursor-pointer"
                                  onClick={() =>
                                    field.onChange(
                                      field.value.filter((val) => val !== id)
                                    )
                                  }
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {(isOpen || field.value?.length > 0) && (
                    <div
                      className={`absolute ${
                        !isOpen ? "hidden" : ""
                      } top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-md z-10 mt-1 overflow-hidden`}
                    >
                      {isOpen && (
                        <div>
                          <input
                            ref={inputRef}
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 outline-none"
                            placeholder="Search..."
                          />
                          <ul className="max-h-[162.68px] overflow-y-auto custom-scroller2">
                            {filteredSealers.map((dealer) => {
                              const isSelected = field.value?.includes(
                                dealer.id
                              );

                              return (
                                <li
                                  key={dealer.id}
                                  className={`flex justify-between items-center px-3 py-2 border-t border-t-gray-300 cursor-pointer ${
                                    isSelected
                                      ? "bg-green-100"
                                      : "hover:bg-gray-100"
                                  }`}
                                  onClick={() => {
                                    if (isSelected) {
                                      field.onChange(
                                        field.value.filter(
                                          (val) => val !== dealer.id
                                        )
                                      );
                                    } else {
                                      field.onChange([
                                        ...(field.value || []),
                                        dealer.id,
                                      ]);
                                    }
                                  }}
                                >
                                  <span>{dealer.dealer.name}</span>
                                  {isSelected && (
                                    <IoClose
                                      className="text-gray-600 hover:text-black"
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
                          </ul>
                          {filteredSealers.length === 0 && (
                            <p className="flex justify-between items-center px-3 py-2 border-t border-t-gray-300">
                              No dealer found
                            </p>
                          )}
                        </div>
                      )}
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
            // In edit mode, password is optional
            required={initialData ? false : "Password is required"}
            error={errors.password}
            placeholder={initialData ? "Leave blank to keep unchanged" : "Enter password"}
            touched={touchedFields.password}
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
                {initialData ? "Update" : "Create"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateExecutivePopUp;
