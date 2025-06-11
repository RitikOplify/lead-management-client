"use client";
import React, { useRef, useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  asyncAddProducts,
  asyncCreateLeads,
  asyncGetAllLeads,
} from "@/store/actions/leads";
import { CustomSelectInput, Input, Select } from "@/components/inputFields";
import { toast } from "react-toastify";
import axios from "@/utils/axios";
import {
  asyncAddCategory,
  asyncGetDealers,
  asyncGetExecutives,
} from "@/store/actions/admin";
import CustomSelect from "@/components/CustomCreatableSelectInner";
import LeadSearchComponent from "@/components/SearchComponent";
import { useSearchParams } from "next/navigation";

function Page({ onClose }) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, touchedFields },
  } = useForm({
    defaultValues: {
      enquiryPersonName: "",
      customerName: "",
      email: "",
      contact: "",
      enquiryType: "",
      source: "",
      city: "",
      state: "",
      price: "",
      comments: "",
      products: [],
      executiveId: "",
      dealerId: "",
      customerEmail: "",
      customerContact: "",
      customerCity: "",
      customerState: "",
      customerId: "",
    },
  });

  const searchParams = useSearchParams();
  const visitId = searchParams.get("visitid");
  console.log(visitId);

  const [visitDetails, setVisitDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [query, setQuery] = useState("");

  const dispatch = useDispatch();
  const { products, executives, dealers, categories } = useSelector(
    (state) => state.leads
  );
  const { user, currentCompany } = useSelector((state) => state.auth);

  const debounceTimeout = useRef(null);

  useEffect(() => {
    async function getVisitDetails() {
      try {
        const { data } = await axios.get(`/visit/${visitId}`);
        setVisitDetails(data.visit);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to fetch visit details"
        );
      }
    }

    if (visitId) getVisitDetails();
  }, [visitId]);

  useEffect(() => {
    if (visitDetails) {
      reset({
        customerName: visitDetails?.customer?.customerName || "",
        customerCity: visitDetails?.customer?.city || "",
        customerContact: visitDetails?.customer?.contact || "",
        customerEmail: visitDetails?.customer?.email || "",
        customerState: visitDetails?.customer?.state || "",
        source: "Visit",
        executiveId: visitDetails?.executiveId || "",
      });
    }
  }, [visitDetails, reset]);

  useEffect(() => {
    if (user) {
      if (user.role === "admin" || user.role === "executive") {
        dispatch(asyncGetDealers());
        dispatch(asyncGetAllLeads());
        dispatch(asyncGetExecutives());
      }
      dispatch(asyncAddCategory());
      dispatch(asyncAddProducts());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (!query.trim()) return;

    if (query.trim().length % 3 === 0) {
      callSearchApi();
    } else {
      clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        callSearchApi();
      }, 2000);
    }

    async function callSearchApi() {
      try {
        const { data } = await axios.get(
          `/lead/customers/search?query=${query}`
        );
        setCustomers(data.customers);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Search failed");
      }
    }

    return () => clearTimeout(debounceTimeout.current);
  }, [query]);

  const onSubmit = async (data) => {
    const leadData = { ...data, visitId, companyId: currentCompany.id };
    setLoading(true);

    try {
      await dispatch(asyncCreateLeads(leadData, reset));
      toast.success("Lead created successfully!");
      if (onClose) onClose();
    } catch (error) {
      toast.error("Failed to create lead");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className=" bg-white rounded-xl w-full shadow-sm">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-7xl mx-auto p-6 space-y-8 bg-white rounded-2xl shadow-xl border border-gray-100"
        >
          {/* Header Section */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <FaPlus className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Create New Lead
                  </h1>
                </div>
              </div>
            </div>
          </div>

          {user.role !== "dealer" && (
            <LeadSearchComponent
              title="Quick Search"
              variant="inline"
              placeholder="Search existing leads..."
              onEditLead={(leadId) => console.log("Edit lead:", leadId)}
            />
          )}

          {/* Contact Information Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
              <h2 className="text-xl font-semibold text-gray-800">
                Contact Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Select
                label="Type of Enquiry *"
                name="enquiryType"
                placeholder="Select enquiry type"
                register={register}
                options={[
                  { value: "project", label: "Project" },
                  { value: "general", label: "General" },
                ]}
                touched={touchedFields.enquiryType}
                error={errors.enquiryType}
              />

              <Input
                label="Enquiry Person Name *"
                name="enquiryPersonName"
                register={register}
                type="text"
                required="Enquiry Person Name is required"
                error={errors.enquiryPersonName}
                placeholder="Enter contact person name"
                touched={touchedFields.enquiryPersonName}
              />

              <Input
                label="Email Address"
                name="customerEmail"
                register={register}
                type="email"
                error={errors.customerEmail}
                placeholder="Enter email address"
                touched={touchedFields.customerEmail}
              />

              <Input
                label="Contact Number *"
                name="customerContact"
                register={register}
                required="Contact is required"
                error={errors.customerContact}
                placeholder="Enter contact number"
                touched={touchedFields.customerContact}
                type="text"
              />

              <div className="relative">
                <Input
                  label="Company Name *"
                  value={visitDetails?.companyName}
                  name="customerName"
                  register={register}
                  onChange={(val) => setQuery(val)}
                  type="text"
                  required="Company Name is required"
                  error={errors.customerName}
                  placeholder="Enter company name"
                  touched={touchedFields.customerName}
                />
                {customers?.length > 0 && (
                  <ul className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {customers.map((customer) => (
                      <li
                        key={customer.id}
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                        onClick={() => {
                          setValue("customerName", customer.customerName);
                          setValue("customerEmail", customer.email);
                          setValue("customerContact", customer.contact);
                          setValue("customerCity", customer.city);
                          setValue("customerState", customer.state);
                          setValue("customerId", customer.id);
                          setCustomers([]);
                        }}
                      >
                        <div className="font-medium text-gray-900">
                          {customer.customerName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {customer.email}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <CustomSelectInput
                label="Lead Source"
                name="source"
                register={register}
                placeholder="Select or type source"
                options={[
                  { value: "Visit" },
                  { value: "Email" },
                  { value: "Call" },
                  { value: "Web" },
                  { value: "Show" },
                ]}
              />

              <Input
                label="City *"
                name="customerCity"
                register={register}
                required="City is required"
                error={errors.customerCity}
                placeholder="Enter city"
                touched={touchedFields.customerCity}
                type="text"
              />

              <Input
                label="State"
                name="customerState"
                register={register}
                error={errors.customerState}
                placeholder="Enter state"
                touched={touchedFields.customerState}
                type="text"
              />
            </div>
          </div>

          {/* Business Details Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-1 h-6 bg-green-500 rounded-full"></div>
              <h2 className="text-xl font-semibold text-gray-800">
                Business Details
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CustomSelect
                control={control}
                name="products"
                label="Select Products"
                options={
                  products?.map((product) => ({
                    label: product.name,
                    value: product.id,
                  })) || []
                }
                isMulti
                placeholder="Choose products"
              />

              <CustomSelect
                control={control}
                name="categories"
                label="Select Categories"
                options={
                  categories?.map((cat) => ({
                    label: cat.name,
                    value: cat.id,
                  })) || []
                }
                isMulti
                placeholder="Choose categories"
              />

              <Input
                label="Estimated Price"
                name="price"
                register={register}
                type="number"
                error={errors.price}
                placeholder="Enter estimated price"
                touched={touchedFields.price}
              />

              {/* Role-based assignment fields */}
              {user?.role === "admin" && (
                <>
                  <Select
                    label="Assign Executive"
                    name="executiveId"
                    register={register}
                    options={(executives || []).map((e) => ({
                      value: e.id,
                      label: e.email,
                    }))}
                    touched={touchedFields.executiveId}
                    error={errors.executiveId}
                    placeholder="Select executive"
                  />

                  <Select
                    label="Assign Dealer"
                    name="dealerId"
                    touched={touchedFields.dealerId}
                    register={register}
                    options={(dealers || []).map((d) => ({
                      value: d.dealerId,
                      label: d.dealer.email,
                    }))}
                    error={errors.dealerId}
                    placeholder="Select dealer"
                  />
                </>
              )}

              {user?.role === "executive" && (
                <Select
                  label="Assign Dealer"
                  name="dealerId"
                  register={register}
                  options={(dealers || []).map((d) => ({
                    value: d.dealerId,
                    label: d.dealer.email,
                  }))}
                  placeholder="Select dealer"
                />
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Comments
                </label>
                <textarea
                  rows="3"
                  {...register("comments")}
                  placeholder="Add any additional notes or comments about this lead..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 ">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-all"
              >
                Cancel
              </button>
            )}

            {loading ? (
              <button
                disabled
                type="button"
                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium flex items-center space-x-2 opacity-75 cursor-not-allowed"
              >
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Creating Lead...</span>
              </button>
            ) : (
              <button
                type="submit"
                className={`px-6 py-2 rounded-md transition ${
                  loading
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-emerald-700 hover:bg-emerald-800 text-white"
                }`}
              >
                Create Lead
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}

export default Page;
