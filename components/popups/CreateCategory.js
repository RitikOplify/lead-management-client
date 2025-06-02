// import { useForm } from "react-hook-form";
// import axios from "@/utils/axios";
// import { toast } from "react-toastify";
// import { IoClose } from "react-icons/io5";
// import { useState } from "react";
// import { Input } from "../inputFields";
// import { useDispatch } from "react-redux";
// import { addNewCategory } from "@/store/slices/leads";

// const CreateCategoryForm = ({ onCategoryClose }) => {
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, touchedFields },
//   } = useForm();

//   const [loading, setLoading] = useState(false);
//   const dispatch = useDispatch();
//   const onSubmit = async (cat) => {
//     try {
//       setLoading(true);
//       const { data } = await axios.post("/admin/category", cat);
//       setLoading(false);
//       dispatch(addNewCategory(data.category));
//       toast.success(data.message);
//       reset();
//       onCategoryClose();
//     } catch (err) {
//       setLoading(false);
//       toast.error(err.response?.data?.message);
//     }
//   };

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
//       onClick={onCategoryClose}
//     >
//       <div
//         className="bg-white h-screen sm:h-auto md:rounded-xl shadow-xl w-full max-w-lg p-6 relative"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <button
//           onClick={onCategoryClose}
//           className="absolute top-3 right-3 text-gray-500 hover:text-black cursor-pointer"
//         >
//           <IoClose size={24} />
//         </button>

//         <h3 className="text-2xl font-semibold mb-4 text-center">
//           Create Category
//         </h3>
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <Input
//             label="Category Name"
//             name="name"
//             register={register}
//             type={"text"}
//             required="Category name is required"
//             error={errors.name}
//             placeholder={"Enter Category name"}
//             touched={touchedFields.name}
//           />
//           <div className="text-right mt-5">
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
//                     d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591..."
//                     fill="#E5E7EB"
//                   />
//                   <path
//                     d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116..."
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
// };

// export default CreateCategoryForm;


import { useForm } from "react-hook-form";
import axios from "@/utils/axios";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { useState, useEffect } from "react";
import { Input } from "../inputFields";
import { useDispatch } from "react-redux";
import { addNewCategory } from "@/store/slices/leads";

const CreateCategoryForm = ({ onClose, categoryToEdit = null }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields },
  } = useForm({
    defaultValues: {
      name: categoryToEdit?.name || "",
    },
  });

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      if (categoryToEdit) {
        // Update logic
        const { data } = await axios.put(`/admin/category/${categoryToEdit.id}`, formData);
        // dispatch(updateCategory(data.category));
        onClose();
        toast.success(data.message);
      } else {
        // Create logic
        const { data } = await axios.post("/admin/category", formData);
        dispatch(addNewCategory(data.category));
        toast.success(data.message);
      }

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
          {categoryToEdit ? "Update Category" : "Create Category"}
        </h3>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Category Name"
            name="name"
            register={register}
            type="text"
            required="Category name is required"
            error={errors.name}
            placeholder="Enter Category name"
            touched={touchedFields.name}
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
                {categoryToEdit ? "Update" : "Create"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCategoryForm;
