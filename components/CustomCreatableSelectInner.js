// 'use client';
// import React from "react";
// import CreatableSelect from "react-select/creatable";
// import { Controller } from "react-hook-form";

// const CustomCreatableSelect = ({
//   control,
//   name,
//   label,
//   options = [],
//   isMulti = false,
//   placeholder,
// }) => {
 

//   const customStyles = {
//     control: (provided) => ({
//       ...provided,
//       display: "flex",
//       overflowX: "auto",
//       whiteSpace: "nowrap",
//     }),
//     valueContainer: (provided) => ({
//       ...provided,
//       display: "flex",
//       flexWrap: "nowrap",
//       overflowX: "auto",
//       scrollbarWidth: "none",
//       whiteSpace: "nowrap",
//       paddingBottom: 4,
//     }),
//     multiValue: (provided) => ({
//       ...provided,
//       backgroundColor: "#d1fae5",
//       marginRight: 4,
//       flexShrink: 0,
//     }),
//     multiValueLabel: (provided) => ({
//       ...provided,
//       color: "#065f46",
//       whiteSpace: "nowrap",
//     }),
//     multiValueRemove: (provided) => ({
//       ...provided,
//       color: "#047857",
//       ":hover": {
//         backgroundColor: "#10b981",
//         color: "white",
//       },
//     }),
//     singleValue: (provided) => ({
//       ...provided,
//       whiteSpace: "nowrap",
//       overflow: "hidden",
//       textOverflow: "ellipsis",
//     }),
//     option: (provided, state) => ({
//       ...provided,
//       backgroundColor: state.isSelected
//         ? "#ecfdf5"
//         : state.isFocused
//         ? "#f0fdf4"
//         : "white",
//       color: "black",
//       fontWeight: state.isSelected ? "600" : "normal",
//       whiteSpace: "nowrap",
//     }),
//   };

//   return (
//     <div>
//       {label && <label className="block mb-1 font-semibold">{label}</label>}
//       <Controller
//         name={name}
//         control={control}
//         defaultValue={isMulti ? [] : null}
//         render={({ field }) => (
//           <CreatableSelect
//             {...field}
//             isMulti={isMulti}
//             closeMenuOnSelect={!isMulti}
//             hideSelectedOptions={false}
//             options={options}
//             styles={customStyles}
//             placeholder={placeholder || "Select or create..."}
//             isClearable={isMulti || !!field.value}
//             onChange={(val) => {
//               if (isMulti) {
//                 field.onChange(val);
//               } else {
//                 field.onChange(val);
//               }
//             }}
//             onCreateOption={(inputValue) => {
//               const newOption = { label: inputValue, value: inputValue };
//               if (isMulti) {
//                 const currentValues = field.value || [];
//                 field.onChange([...currentValues, newOption]);
//               } else {
//                 field.onChange(newOption);
//               }
//             }}
//             value={
//               isMulti
//                 ? field.value
//                 : typeof field.value === "object"
//                 ? field.value
//                 : options.find((opt) => opt.value === field.value) ||
//                   null
//             }
//           />
//         )}
//       />
//     </div>
//   );
// };

// export default CustomCreatableSelect;


'use client';
import React from "react";
import Select from "react-select";
import { Controller } from "react-hook-form";

const CustomSelect = ({
  control,
  name,
  label,
  options = [],
  isMulti = false,
  placeholder,
}) => {
  const customStyles = {
    control: (provided) => ({
      ...provided,
      display: "flex",
      overflowX: "auto",
      whiteSpace: "nowrap",
    }),
    valueContainer: (provided) => ({
      ...provided,
      display: "flex",
      flexWrap: "nowrap",
      overflowX: "auto",
      scrollbarWidth: "none",
      whiteSpace: "nowrap",
      paddingBottom: 4,
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#d1fae5",
      marginRight: 4,
      flexShrink: 0,
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#065f46",
      whiteSpace: "nowrap",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#047857",
      ":hover": {
        backgroundColor: "#10b981",
        color: "white",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#ecfdf5"
        : state.isFocused
        ? "#f0fdf4"
        : "white",
      color: "black",
      fontWeight: state.isSelected ? "600" : "normal",
      whiteSpace: "nowrap",
    }),
  };

  return (
    <div>
      {label && <label className="block mb-1 font-semibold">{label}</label>}
      <Controller
        name={name}
        control={control}
        defaultValue={isMulti ? [] : null}
        render={({ field }) => {
          // Map form value(s) (id(s)) to option object(s)
          const value = isMulti
            ? options.filter((opt) => field.value?.includes(opt.value))
            : options.find((opt) => opt.value === field.value) || null;

          return (
            <Select
              {...field}
              isMulti={isMulti}
              closeMenuOnSelect={!isMulti}
              hideSelectedOptions={false}
              options={options}
              styles={customStyles}
              placeholder={placeholder || "Select..."}
              isClearable={isMulti || !!field.value}
              value={value}
              onChange={(selected) => {
                if (isMulti) {
                  const values = selected ? selected.map((opt) => opt.value) : [];
                  field.onChange(values);
                } else {
                  field.onChange(selected ? selected.value : null);
                }
              }}
            />
          );
        }}
      />
    </div>
  );
};

export default CustomSelect;
