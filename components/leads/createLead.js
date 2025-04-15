import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import Nav from "../Nav";
import { useForm, useWatch } from "react-hook-form";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncCreateLeads, asyncGetCompanyDtails } from "@/store/actions/leads";
import { Input, Select } from "../inputFields";
const CreateLead = () => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, touchedFields },
    watch,
  } = useForm();
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    await dispatch(asyncCreateLeads(data));
    reset();
    setLoading(false);
  };
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <Nav navOpen={navOpen} setNavOpen={setNavOpen} />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 w-full lg:w-[calc(100%-256px)] space-y-6 overflow-y-auto custom-scroller2"
      >
        {/* Mobile Nav Toggle */}
        <div className="md:hidden mb-4">
          <div
            onClick={() => setNavOpen(true)}
            className="text-2xl text-[#092C1C] cursor-pointer"
          >
            <FaBars />
          </div>
        </div>

        {/* Header */}
        <h2 className="text-2xl font-bold">Add Lead</h2>

        {/* Form Sections */}
        <div className=" w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input
            label="Name"
            name="name"
            register={register}
            type={"text"}
            required="Name is required"
            error={errors.name}
            placeholder={"Enter name"}
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
          <Input
            label="Contact"
            name="contact"
            register={register}
            required="Contact is required"
            error={errors.contact}
            placeholder={"Enter contact"}
            touched={touchedFields.contact}
            type={"text"}
          />
          <Input
            label="Company Name"
            name="companyName"
            register={register}
            type={"text"}
            required="Company Name is required"
            error={errors.companyName}
            placeholder={"Enter company name"}
            touched={touchedFields.companyName}
          />
          <Input
            label="Source"
            name="source"
            register={register}
            required="Source is required"
            error={errors.source}
            placeholder={"Enter source"}
            touched={touchedFields.source}
            type={"text"}
          />
          <Input
            label="City"
            name="city"
            register={register}
            required="City is required"
            error={errors.city}
            placeholder={"Enter city"}
            touched={touchedFields.city}
            type={"text"}
          />
          <Input
            label="State"
            name="state"
            register={register}
            required="State is required"
            error={errors.state}
            placeholder={"Enter state"}
            touched={touchedFields.state}
            type={"text"}
          />
          <Input
            label="Price"
            name="price"
            register={register}
            type="number"
            required="Price is required"
            error={errors.price}
            placeholder={"Enter price"}
            touched={touchedFields.price}
          />
          <Input
            label="Comments"
            name="comments"
            register={register}
            placeholder={"Enter comments"}
            error={errors.comments}
            touched={touchedFields.comments}
            type={"text"}
          />
        </div>

        <div className="border-t pt-6 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Select
            label="Status"
            name="status"
            register={register}
            required="Status is required"
            options={["NEW", "IN_PROGRESS", "CLOSED"].map((val) => ({
              value: val,
              label: val,
            }))}
            touched={touchedFields.status}
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
            touched={touchedFields.stage}
            error={errors.stage}
          />

          <Select
            label="Category"
            name="categoryId"
            register={register}
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            error={errors.categoryId}
            touched={touchedFields.categoryId}
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
              touched={touchedFields.subcategoryId}
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
            touched={touchedFields.productId}
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
                touched={touchedFields.executiveId}
                error={errors.executiveId}
              />

              <Select
                label="Dealer"
                name="dealerId"
                touched={touchedFields.dealerId}
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
              touched={touchedFields.dealerId}
              register={register}
              options={(company?.dealers || []).map((d) => ({
                value: d.id,
                label: d.email,
              }))}
              error={errors.dealerId}
            />
          )}
        </div>

        <div className="border-t pt-6 w-full">
          <h3 className="text-xl font-semibold mb-2">Follow-Up</h3>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select
              label="Follow-Up Status"
              name="followUp.status"
              register={register}
              required="Follow-up status is required"
              options={["NEW", "IN_PROGRESS", "CLOSED"].map((val) => ({
                value: val,
                label: val,
              }))}
              touched={touchedFields.followUp?.status}
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
              touched={touchedFields.followUp?.stage}
              error={errors?.followUp?.stage}
            />
            <Input
              label="Follow-Up Date"
              name="followUp.date"
              register={register}
              type="date"
              placeholder="DD/MM/YYYY"
              required="Date is required"
              touched={touchedFields.followUp?.date}
              error={errors?.followUp?.date}
            />
            <Input
              label="Follow-Up Time"
              name="followUp.time"
              register={register}
              type="time"
              touched={touchedFields.followUp?.time}
              required="Time is required"
              error={errors?.followUp?.time}
            />
            <Input
              label="Follow-Up Message"
              name="followUp.message"
              register={register}
              touched={touchedFields.followUp?.message}
              placeholder={"Enter message"}
              required="Message is required"
              error={errors?.followUp?.message}
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
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
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
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
  );
};

export default CreateLead;
