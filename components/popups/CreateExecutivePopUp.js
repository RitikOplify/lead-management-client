// import React, { useState } from "react";
// import { Input, Select } from "../inputFields";
// import { Controller, useForm } from "react-hook-form";
// import { IoClose } from "react-icons/io5";
// import axios from "@/utils/axios";
// import { toast } from "react-toastify";
// import { useSelector } from "react-redux";
// import { IoIosArrowDown } from "react-icons/io";
// function CreateExecutivePopUp({ onClose }) {
//   const {
//     register,
//     handleSubmit,
//     reset,
//     control,
//     formState: { errors, touchedFields },
//   } = useForm();
//   const [loading, setLoading] = useState(false);
//   const { company } = useSelector((state) => state.leads);
//   const [searchTerm, setSearchTerm] = useState("");
//   const filteredSealers = (company?.dealers || []).filter((dealer) =>
//     dealer.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );
//   const [isOpen, setIsOpen] = useState(false);
//   const onSubmit = async (executive) => {
//     if (!executive.dealerIds || executive.dealerIds.length === 0) {
//       toast.error("Please select at least one dealer.");
//       return;
//     }

//     console.log(executive); // dealerIds will be an array
//     // your axios logic here
//     // console.log(executive);
//     return;

//     try {
//       setLoading(true);
//       const { data } = await axios.post(`/admin/sales-executive`, executive);
//       setLoading(false);
//       toast.success(data.message);
//       reset();
//       onClose();
//     } catch (error) {
//       setLoading(false);
//       toast.error(error.response.data.message);
//       console.error(error.response.data.message);
//     }
//   };

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
//       onClick={onClose}
//     >
//       <div
//         className="bg-white h-screen sm:h-auto md:rounded-xl shadow-xl w-full max-w-4xl p-6 relative"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-gray-500 hover:text-black"
//         >
//           <IoClose size={24} />
//         </button>

//         <h3 className="text-2xl font-semibold mb-4 text-center">
//           Create Executive
//         </h3>
//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
//         >
//           <Input
//             label="Username"
//             name="username"
//             register={register}
//             type={"text"}
//             required="Username is required"
//             error={errors.name}
//             placeholder={"Enter Username"}
//             touched={touchedFields.name}
//           />
//           <Input
//             label="Email"
//             name="email"
//             register={register}
//             type="email"
//             required="Email is required"
//             error={errors.email}
//             placeholder={"Enter email"}
//             touched={touchedFields.email}
//           />

//           <div className="flex justify-between flex-col items-center">
//             <Controller
//               name="dealerIds"
//               control={control}
//               rules={{ required: "At least one dealer must be selected" }}
//               render={({ field }) => (
//                 <div className="w-full relative">
//                   <p className="mb-1 text-sm">Assign Dealers</p>

//                   {/* Dropdown toggle */}
//                   <div
//                     onClick={() => setIsOpen(!isOpen)}
//                     className="border border-gray-300 flex items-center justify-between px-3 py-2 rounded-md cursor-pointer bg-white"
//                   >
//                     <span className="text-gray-500">
//                       {field.value?.length > 0
//                         ? `${field.value.length} selected`
//                         : "Select Dealers"}
//                     </span>
//                     <IoIosArrowDown />
//                   </div>

//                   {(isOpen || field.value?.length > 0) && (
//                     <div className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-md z-10 mt-1">
//                       {/* Selected dealers badges */}
//                       {field.value?.length > 0 && (
//                         <div className="flex overflow-x-auto custom-scroller3 whitespace-nowrap py-2 px-3 gap-1 border-b">
//                           {(field.value || []).map((id) => {
//                             const dealer = company?.dealers?.find(
//                               (d) => d.id === id
//                             );
//                             return (
//                               <div
//                                 key={id}
//                                 className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-sm text-sm"
//                               >
//                                 {dealer?.name}
//                                 <IoClose
//                                   className="cursor-pointer"
//                                   onClick={() =>
//                                     field.onChange(
//                                       field.value.filter((val) => val !== id)
//                                     )
//                                   }
//                                 />
//                               </div>
//                             );
//                           })}
//                         </div>
//                       )}

//                       {/* Search + Dropdown list */}
//                       {isOpen && (
//                         <div>
//                           <input
//                             type="text"
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             className="w-full px-3 py-2 outline-none"
//                             placeholder="Search..."
//                           />
//                           <ul className="max-h-40 overflow-y-auto custom-scroller2">
//                             {filteredSealers.length > 0 ? (
//                               filteredSealers.map((dealer) => (
//                                 <li
//                                   key={dealer.id}
//                                   onClick={() => {
//                                     if (!field.value?.includes(dealer.id)) {
//                                       field.onChange([
//                                         ...(field.value || []),
//                                         dealer.id,
//                                       ]);
//                                     }
//                                   }}
//                                   className="px-3 py-2 hover:bg-gray-100 border-t border-t-gray-300 cursor-pointer"
//                                 >
//                                   {dealer.name}
//                                 </li>
//                               ))
//                             ) : (
//                               <li className="px-3 py-2 text-gray-500">
//                                 No results found
//                               </li>
//                             )}
//                           </ul>
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   {/* Validation error */}
//                   {errors?.dealerIds && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.dealerIds.message}
//                     </p>
//                   )}
//                 </div>
//               )}
//             />
//           </div>

//           <Input
//             label="Password"
//             name="password"
//             register={register}
//             type="password"
//             required="Password is required"
//             error={errors.password}
//             placeholder={"Enter password"}
//             touched={touchedFields.password}
//           />

//           <div className="col-span-full text-right mt-4">
//             {loading ? (
//               <button
//                 disabled
//                 type="button"
//                 className="px-3 py-2 rounded-lg bg-green-950 text-white"
//               >
//                 <svg
//                   aria-hidden="true"
//                   role="status"
//                   className="inline w-4 h-4 me-3 text-white animate-spin"
//                   viewBox="0 0 100 101"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
//                     fill="#E5E7EB"
//                   />
//                   <path
//                     d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
//                     fill="currentColor"
//                   />
//                 </svg>
//                 Loading...
//               </button>
//             ) : (
//               <button
//                 type="submit"
//                 className="bg-[#092C1C] text-white px-6 py-2 rounded cursor-pointer"
//               >
//                 Create
//               </button>
//             )}
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default CreateExecutivePopUp;

import React, { useEffect, useRef, useState } from "react";
import { Input, Select } from "../inputFields";
import { Controller, useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import axios from "@/utils/axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { IoIosArrowDown } from "react-icons/io";

function CreateExecutivePopUp({ onClose }) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, touchedFields },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const { company } = useSelector((state) => state.leads);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = React.useRef(null);
  const filteredSealers = (company?.dealers || []).filter((dealer) =>
    dealer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const inputRef = useRef(null);

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

  const onSubmit = async (executive) => {
    if (!executive.dealerIds || executive.dealerIds.length === 0) {
      toast.error("Please select at least one dealer.");
      return;
    }

    console.log(executive); // For now

    // Uncomment to actually send data
    /*
    try {
      setLoading(true);
      const { data } = await axios.post(`/admin/sales-executive`, executive);
      setLoading(false);
      toast.success(data.message);
      reset();
      onClose();
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message);
      console.error(error.response.data.message);
    }
    */
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
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <IoClose size={24} />
        </button>

        <h3 className="text-2xl font-semibold mb-4 text-center">
          Create Executive
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
            error={errors.name}
            placeholder={"Enter Username"}
            touched={touchedFields.name}
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
              rules={{ required: "At least one dealer must be selected" }}
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
                      <div className="overflow-hidden sm:absolute top-full left-0 right-0 bg-white border b border-gray-300 rounded-md shadow-md z-10 mt-1">
                        <div className="flex overflow-x-auto custom-scroller4 whitespace-nowrap py-2  gap-1 ">
                          {(field.value || []).map((id) => {
                            const dealer = company?.dealers?.find(
                              (d) => d.id === id
                            );
                            return (
                              <div
                                key={id}
                                className="flex items-center gap-1 px-2 bg-green-100 py-0.5 rounded-sm text-sm"
                              >
                                {dealer?.name}
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
                                  <span>{dealer.name}</span>
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
                        </div>
                      )}
                    </div>
                  )}

                  {errors?.dealerIds && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.dealerIds.message}
                    </p>
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
            required="Password is required"
            error={errors.password}
            placeholder={"Enter password"}
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
                Create
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateExecutivePopUp;
