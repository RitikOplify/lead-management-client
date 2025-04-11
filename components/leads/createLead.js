import { useForm, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncCreateLeads, asyncGetCompanyDtails } from "@/store/actions/leads";
import { asyncCurrentUser } from "@/store/actions/auth";

export default function CreateLeadForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, touchedFields },
    watch,
  } = useForm();

  const categoryId = watch("categoryId");
  const subcategoryId = watch("subcategoryId");
  const selectedExecutive = useWatch({ control, name: "executiveId" });
  const selectedDealer = useWatch({ control, name: "dealerId" });
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const dispatch = useDispatch();
  const { company } = useSelector((state) => state.leads);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(asyncGetCompanyDtails());
    }
  }, []);

  useEffect(() => {
    if (company) {
      setAllProducts(company.products || []);
      setCategories(company.categories || []);
    }
  }, [company]);

  useEffect(() => {
    if (categoryId) {
      const selectedCategory = categories.find((cat) => cat.id === categoryId);
      setFilteredSubcategories(selectedCategory?.subcategories || []);
    } else {
      setFilteredSubcategories([]);
    }
  }, [categoryId, categories]);

  useEffect(() => {
    if (categoryId && subcategoryId) {
      setFilteredProducts(
        allProducts.filter(
          (p) =>
            p.categoryId === categoryId && p.subcategoryId === subcategoryId
        )
      );
    } else if (categoryId) {
      setFilteredProducts(
        allProducts.filter((p) => p.categoryId === categoryId)
      );
    } else {
      setFilteredProducts(allProducts);
    }
  }, [categoryId, subcategoryId, allProducts]);

  const onSubmit = async (data) => {
    console.log(data);
    // return
    dispatch(asyncCreateLeads(data));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl space-y-4"
    >
      <h2 className="text-2xl font-bold">Create Lead</h2>

      <Input
        label="Name"
        name="name"
        register={register}
        required="Name is required"
        error={errors.name}
      />
      <Input
        label="Email"
        name="email"
        register={register}
        type="email"
        required="Email is required"
        error={errors.email}
      />
      <Input
        label="Contact"
        name="contact"
        register={register}
        required="Contact is required"
        error={errors.contact}
      />
      <Input
        label="Company Name"
        name="companyName"
        register={register}
        required={"Company Name is required"}
        error={errors.companyName}
      />
      <Input
        label="Source"
        name="source"
        register={register}
        required="Source is required"
        error={errors.source}
      />
      <Input
        label="City"
        name="city"
        register={register}
        required="City is required"
        error={errors.city}
      />
      <Input
        label="State"
        name="state"
        register={register}
        required="State is required"
        error={errors.state}
      />
      <Input
        label="Price"
        name="price"
        register={register}
        type="number"
        required="Price is required"
        error={errors.price}
      />
      <Input label="Comments" name="comments" register={register} />

      <Select
        label="Status"
        name="status"
        register={register}
        required="Status is required"
        options={["NEW", "IN_PROGRESS", "CLOSED"].map((val) => ({
          value: val,
          label: val,
        }))}
        error={errors.status}
      />

      <Select
        label="Stage"
        name="stage"
        register={register}
        required="Stage is required"
        options={["INQUIRY", "NEGOTIATION", "FINALIZED"].map((val) => ({
          value: val,
          label: val,
        }))}
        error={errors.stage}
      />

      <Select
        label="Category"
        name="categoryId"
        register={register}
        options={categories.map((c) => ({ value: c.id, label: c.name }))}
        error={errors.categoryId}
      />

      {categoryId && (
        <Select
          label="Subcategory"
          name="subcategoryId"
          register={register}
          options={filteredSubcategories.map((sc) => ({
            value: sc.id,
            label: sc.name,
          }))}
          error={errors.subcategoryId}
        />
      )}

      <Select
        label="Product"
        name="productId"
        register={register}
        options={filteredProducts.map((p) => ({
          value: p.id,
          label: p.name,
        }))}
        error={errors.productId}
      />

      {user?.role === "admin" && (
        <>
          <Select
            label="Executive"
            name="executiveId"
            register={register}
            disabled={!!selectedDealer} // disable if dealer is selected
            options={(company?.executives || []).map((e) => ({
              value: e.id,
              label: e.email,
            }))}
            error={errors.executiveId}
          />

          <Select
            label="Dealer"
            name="dealerId"
            register={register}
            disabled={!!selectedExecutive} // disable if executive is selected
            options={(company?.dealers || []).map((d) => ({
              value: d.id,
              label: d.email,
            }))}
            error={errors.dealerId}
          />
        </>
      )}

      {user?.role === "executive" && (
        <Select
          label="Dealer"
          name="dealerId"
          register={register}
          options={(company?.dealers || []).map((d) => ({
            value: d.id,
            label: d.email,
          }))}
          error={errors.dealerId}
        />
      )}

      <div className="pt-4 border-t">
        <h3 className="text-xl font-semibold mb-2">Follow-Up</h3>
        <Select
          label="Follow-Up Status"
          name="followUp.status"
          register={register}
          required="Follow-up status is required"
          options={["NEW", "IN_PROGRESS", "CLOSED"].map((val) => ({
            value: val,
            label: val,
          }))}
          error={errors?.followUp?.status}
        />
        <Select
          label="Follow-Up Stage"
          name="followUp.stage"
          register={register}
          required="Follow-up stage is required"
          options={["INQUIRY", "NEGOTIATION", "FINALIZED"].map((val) => ({
            value: val,
            label: val,
          }))}
          error={errors?.followUp?.stage}
        />
        <Input
          label="Follow-Up Date"
          name="followUp.date"
          register={register}
          type="date"
          required="Date is required"
          error={errors?.followUp?.date}
        />
        <Input
          label="Follow-Up Time"
          name="followUp.time"
          register={register}
          type="time"
          required="Time is required"
          error={errors?.followUp?.time}
        />
        <Input
          label="Follow-Up Message"
          name="followUp.message"
          register={register}
          required="Message is required"
          error={errors?.followUp?.message}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg mt-4"
      >
        Submit
      </button>
    </form>
  );
}

// 🧩 Input Component
function Input({ label, name, register, error, required, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        {...register(name, { required })}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
}

// 🧩 Select Component
function Select({ label, name, register, error, required, options, disabled }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select
        disabled={disabled}
        {...register(name, { required })}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
}
