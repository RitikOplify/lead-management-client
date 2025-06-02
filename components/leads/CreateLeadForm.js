import React, { useRef, useState } from "react";
import { FaBars } from "react-icons/fa";
import Nav from "../Nav";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  asyncAddProducts,
  asyncCreateLeads,
  asyncGetAllLeads,
} from "@/store/actions/leads";
import { CustomSelectInput, Input, Select } from "../inputFields";
import { IoClose } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import axios from "@/utils/axios";
import {
  asyncAddCategory,
  asyncGetDealers,
  asyncGetExecutives,
} from "@/store/actions/admin";
import SearchLeadTable from "../popups/SearchLeadTable";
import CreatableSelectInput from "../CustomSelect";
import CustomSelect from "../CustomCreatableSelectInner";
function CreateLeadForm({ leadId, onClose }) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, touchedFields },
    watch,
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
  const visitId = searchParams.get("visitId");
  console.log(visitId);

  const [visitDetails, setVisitDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const selectedExecutive = useWatch({ control, name: "executiveId" });
  const selectedDealer = useWatch({ control, name: "dealerId" });
  const [allProducts, setAllProducts] = useState([]);

  const dispatch = useDispatch();
  const { products, executives, dealers, categories } = useSelector(
    (state) => state.leads
  );
  const { user, currentCompany } = useSelector((state) => state.auth);
  const isEditMode = Boolean(leadId);
  console.log(dealers);

  useEffect(() => {
    async function getVisitDetails() {
      try {
        const { data } = await axios.get(`/visit/${visitId}`);
        setVisitDetails(data.visit);
        console.log(data?.visit);
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
    }
    if (visitId) {
      getVisitDetails();
    }
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
      dispatch(asyncAddCategory());
      dispatch(asyncAddProducts());
      dispatch(asyncGetDealers());
      dispatch(asyncGetAllLeads());
      dispatch(asyncGetExecutives());
    }
  }, []);

  useEffect(() => {
    if (products) {
      setAllProducts(products || []);
    }
  }, [products]);

  const onSubmit = async (data) => {
    console.log(data);

    const leadData = { ...data, visitId, companyId: currentCompany.id };
    setLoading(true);
    if (isEditMode) {
      try {
        const { data } = await axios.put(`/lead/${leadId}`, leadData);
        onClose();
        console.log(data.lead);
      } catch (error) {
        console.log(error.response.data.message);
      }
    } else {
      await dispatch(asyncCreateLeads(leadData, reset));
    }

    // reset();
    setLoading(false);
  };

  const [navOpen, setNavOpen] = useState(false);

  const [isProductOpen, setProductOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProduct = (products || []).filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const inputRef = useRef(null);

  useEffect(() => {
    if (isProductOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isProductOpen]);

  const productRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (productRef.current && !productRef.current.contains(event.target)) {
        setProductOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [searchLeadData, setSeachLeadData] = useState();
  const [customers, setCustomers] = useState();
  const [selectedCustomersEp, setSelectedCustomersEp] = useState([]);
  const [query, setQuery] = useState("");

  console.log(query);

  const debounceTimeout = useRef(null);

  useEffect(() => {
    if (!query.trim()) return;

    // Only trigger if length is divisible by 3 or after 2 seconds
    if (query.trim().length % 3 === 0) {
      callSearchApi();
    } else {
      // Clear previous timeout
      clearTimeout(debounceTimeout.current);

      // Set new timeout
      debounceTimeout.current = setTimeout(() => {
        callSearchApi();
      }, 2000);
    }

    async function callSearchApi() {
      try {
        const { data } = await axios.get(
          `/lead/customers/search?query=${query}`
        );
        console.log("customers", data.customers);
        setCustomers(data.customers);
        // setSeachLeadData(data.leads);
        // console.log(data.leads);
      } catch (error) {
        console.log(error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      }
    }

    // Cleanup timeout on unmount or query change
    return () => clearTimeout(debounceTimeout.current);
  }, [query]);

  const [leadQuery, setLeadQuery] = useState("");

  useEffect(() => {
    if (!leadQuery.trim()) return;

    // Only trigger if length is divisible by 3 or after 2 seconds
    if (leadQuery.trim().length % 3 === 0) {
      callSearchLeadApi();
    } else {
      // Clear previous timeout
      clearTimeout(debounceTimeout.current);

      // Set new timeout
      debounceTimeout.current = setTimeout(() => {
        callSearchLeadApi();
      }, 2000);
    }

    async function callSearchLeadApi() {
      try {
        const { data } = await axios.get(`/lead/search?query=${leadQuery}`);
        setSeachLeadData(data.leads);
        console.log("search lead data", data.leads);

        console.log("leads", data.leads);
      } catch (error) {
        console.log(error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      }
    }

    // Cleanup timeout on unmount or query change
    return () => clearTimeout(debounceTimeout.current);
  }, [leadQuery]);

  useEffect(() => {
    if (isEditMode) {
      const getLeadDetails = async () => {
        try {
          const { data } = await axios.get(`/lead/${leadId}`);
          // setVisitDetails(data.visit);
          const products = data.lead.products.map((product) => product.id);
          reset({
            customerName: data.lead.customer?.customerName || "",
            enquiryPersonName: data.lead.enquiryPerson || "",
            customerEmail: data.lead.customer?.email || "",
            customerContact: data.lead.customer?.contact || "",
            enquiryType: data.lead.enquiryType || "",
            source: data.lead.source || "",
            customerCity: data.lead.city || "",
            customerState: data.lead.state || "",
            price: data.lead.price || "",
            comments: data.lead.comments || "",
            products: products || [],
            executiveId: data.lead.executiveId || "",
            dealerId: data.lead.dealerId || "",
          });
          console.log(data.lead.products);
        } catch (error) {
          toast.error(error?.response?.data?.message);
        }
      };
      getLeadDetails();
    }
  }, [isEditMode, leadId, reset]);

  async function handleSearchLeadTable() {
    setSeachLeadData(null);
  }

  return (
    <>
      <Nav navOpen={navOpen} setNavOpen={setNavOpen} />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`p-6 w-full ${
          !leadId ? "lg:w-[calc(100%-256px)]" : ""
        } space-y-6 overflow-y-auto custom-scroller2`}
      >
        <div className="md:hidden mb-4">
          <div
            onClick={() => setNavOpen(true)}
            className="text-2xl text-[#092C1C] cursor-pointer"
          >
            <FaBars />
          </div>
        </div>

        {!leadId && (
          <div className=" flex justify-center items-center">
            <input
              type="text"
              onChange={(e) => {
                setLeadQuery(e.target.value);
              }}
              placeholder="Search..."
              className="px-4 w-full max-w-sm rounded-full py-2 border outline-[#092C1C]"
            />
            {searchLeadData && (
              <SearchLeadTable
                leads={searchLeadData}
                onClose={handleSearchLeadTable}
              />
            )}
          </div>
        )}

        <h2 className="text-2xl font-bold mb-10">
          {isEditMode ? "Edit Lead" : "Add Lead"}
        </h2>

        <div className=" w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Select
            label="Type of Enquiry *"
            name="enquiryType"
            placeholder="type"
            register={register}
            options={[
              { value: "project", label: "Project" },
              { value: "general", label: "General" },
            ].map((e) => ({
              value: e.value,
              label: e.label,
            }))}
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
            placeholder="Enter name"
            touched={touchedFields.enquiryPersonName}
          />

          <Input
            label="Email"
            name="customerEmail"
            register={register}
            type="email"
            error={errors.customerEmail}
            placeholder={"Enter email"}
            touched={touchedFields.customerEmail}
          />
          <Input
            label="Contact *"
            name="customerContact"
            register={register}
            required="Contact is required"
            error={errors.customerContact}
            placeholder={"Enter contact"}
            touched={touchedFields.customerContact}
            type={"text"}
          />
          <div className=" relative">
            <Input
              label="Company Name *"
              value={visitDetails?.companyName}
              name="customerName"
              register={register}
              onChange={(val) => {
                console.log(val);
                setQuery(val);
              }}
              type={"text"}
              required="Company Name is required"
              error={errors.customerName}
              placeholder={"Enter company name"}
              touched={touchedFields.customerName}
            />
            {customers?.length > 0 && (
              <ul className="border absolute border-gray-300 overflow-hidden bg-white w-full z-10 rounded-md">
                {customers.map((customer) => (
                  <li
                    key={customer.id}
                    className="cursor-pointer px-3 py-2 border border-gray-100 hover:bg-gray-100"
                    onClick={() => {
                      setValue("customerName", customer.customerName);
                      setValue("customerEmail", customer.email);
                      setValue("customerContact", customer.contact);
                      setValue("customerCity", customer.city);
                      setValue("customerState", customer.state);
                      setValue("customerId", customer.id);
                      setSelectedCustomersEp(customer.enquiryPersons);
                      setCustomers([]);
                    }}
                  >
                    {customer.customerName}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <CustomSelectInput
            label="Source"
            name="source"
            register={register}
            placeholder="Select or type"
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
            placeholder={"Enter city"}
            touched={touchedFields.customerCity}
            type={"text"}
          />
          <Input
            label="State"
            name="customerState"
            register={register}
            error={errors.customerState}
            placeholder={"Enter state"}
            touched={touchedFields.customerState}
            type={"text"}
          />
        </div>

        <div className="border-t pt-6 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* <div className="flex justify-between flex-col items-center">
            <Controller
              name="products"
              control={control}
              render={({ field }) => (
                <div className="w-full relative" ref={productRef}>
                  <p className="mb-1 text-sm">Select Product</p>
                  <div>
                    <div
                      onClick={() => setProductOpen(!isProductOpen)}
                      className="border border-gray-300 overflow-x-auto custom-scroller4 flex items-center justify-between px-3 py-2 rounded-md cursor-pointer bg-white"
                    >
                      <span className="text-gray-500">
                        {field.value?.length > 0 ? (
                          <div className="flex  whitespace-nowrap  gap-1 ">
                            {(field.value || []).map((id) => {
                              const product = allProducts.find(
                                (d) => d.id === id
                              );
                              return (
                                <div
                                  key={id}
                                  className="flex items-center gap-1 px-2 bg-green-100 py-0.5 rounded-sm text-sm"
                                >
                                  {product?.name}
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
                        ) : (
                          "Select Product"
                        )}
                      </span>
                      <IoIosArrowDown />
                    </div>
                  </div>

                  {(isProductOpen || field.value?.length > 0) && (
                    <div
                      className={`absolute ${
                        !isProductOpen ? "hidden" : ""
                      } top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-md z-10 mt-1 overflow-hidden`}
                    >
                      {isProductOpen && (
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
                            {filteredProduct.map((product) => {
                              const isSelected = field.value?.includes(
                                product.id
                              );

                              return (
                                <li
                                  key={product.id}
                                  className={`flex justify-between items-center px-3 py-2 border-t border-t-gray-300 cursor-pointer ${
                                    isSelected
                                      ? "bg-green-100"
                                      : "hover:bg-gray-100"
                                  }`}
                                  onClick={() => {
                                    if (isSelected) {
                                      field.onChange(
                                        field.value.filter(
                                          (val) => val !== product.id
                                        )
                                      );
                                    } else {
                                      field.onChange([
                                        ...(field.value || []),
                                        product.id,
                                      ]);
                                    }
                                  }}
                                >
                                  <span>{product.name}</span>
                                  {isSelected && (
                                    <IoClose
                                      className="text-gray-600 hover:text-black"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        field.onChange(
                                          field.value.filter(
                                            (val) => val !== product.id
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

                  {errors?.products && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.products.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div> */}

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
            placeholder="Select Products"
          />
          <CustomSelect
            control={control}
            name="categories"
            label="Select Categories"
            options={
              categories?.map((cat) => ({ label: cat.name, value: cat.id })) ||
              []
            }
            isMulti
            placeholder="Select categories"
          />

          <Input
            label="Price"
            name="price"
            register={register}
            type="number"
            error={errors.price}
            placeholder={"Enter price"}
            touched={touchedFields.price}
          />
          {user?.role === "admin" && (
            <>
              <Select
                label="Executive"
                name="executiveId"
                register={register}
                options={(executives || []).map((e) => ({
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
                disabled={!!selectedExecutive}
                options={(dealers || []).map((d) => ({
                  value: d.dealerId,
                  label: d.dealer.email,
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
              options={(dealers || []).map((d) => ({
                value: d.dealerId,
                label: d.dealer.email,
              }))}
              error={errors.dealerId}
            />
          )}
          <div className="flex flex-col">
            <label className="text-sm mb-1">Comments</label>
            <textarea
              rows="3"
              {...register("comments")}
              placeholder="Type your comments here"
              className="px-3 py-2 border outline-[#092C1C] border-gray-300 rounded-sm"
            ></textarea>
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
              className="px-6 py-2 rounded-lg bg-green-950 text-white font-semibold hover:bg-green-800 transition"
            >
              {isEditMode ? "Update Lead" : "Create Lead"}
            </button>
          )}
        </div>
      </form>
    </>
  );
}

export default CreateLeadForm;
