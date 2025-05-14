import { IoIosArrowDown } from "react-icons/io";
function Select({
  label,
  name,
  register,
  error,
  required,
  placeholder,
  options,
  disabled,
  touched,
  multiple = false,
}) {
  return (
    <div className="flex flex-col">
      <label className="text-sm mb-1">{label}</label>
      <div className="relative">
        <select
          multiple={multiple}
          disabled={disabled}
          {...register(name, { required })}
          className={`w-full px-3 py-2 border outline-[#092C1C] cursor-pointer ${
            error && touched ? "border-red-500" : "border-gray-300"
          } rounded-lg appearance-none`}
        >
          <option value="">Select {placeholder ? placeholder : label}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
          <IoIosArrowDown size={18} />
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}

function Input({
  label,
  name,
  placeholder,
  register,
  error,
  required,
  touched,
  type,
}) {
  return (
    <div className="flex flex-col">
      <label className="text-sm mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        {...register(name, { required })}
        className={`px-3 py-2 border outline-[#092C1C] ${
          error && touched ? "border-red-500" : "border-gray-300"
        } rounded-lg`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}


const CustomSelectInput = ({
  label,
  name,
  register,
  required,
  options = [],
  placeholder = "Select or type",
  touched,
  error,
}) => {
  return (
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          list={`${name}-options`}
          {...register(name, required && { required })}
          placeholder={placeholder}
          className={`appearance-none border px-3 py-2 pr-8 rounded-md w-full ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />
        {/* Custom arrow icon */}
        <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
          <IoIosArrowDown size={18} className="text-black" />
        </div>
        <datalist id={`${name}-options`}>
          {options.map((option) => (
            <option key={option.value} value={option.value} />
          ))}
        </datalist>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export { Select, Input, CustomSelectInput };
