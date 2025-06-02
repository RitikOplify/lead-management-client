"use client";
import React, { useEffect, useRef, useState } from "react";
import Nav from "@/components/Nav";
import { CustomSelectInput, Input, Select } from "@/components/inputFields";
import { useForm } from "react-hook-form";
import axios from "@/utils/axios";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addNewVisit } from "@/store/slices/leads";
import { FaBars } from "react-icons/fa";

const Page = () => {
  const dispatch = useDispatch();
  const [navOpen, setNavOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { executives } = useSelector((state) => state.leads);
  const { user } = useSelector((state) => state.auth);
  const searchParams = useSearchParams();
  const [lead, setLead] = useState(null);
  const leadId = searchParams.get("leadId");
  const [customers, setCustomers] = useState();

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

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, touchedFields },
  } = useForm({
    defaultValues: {
      customerName: "",
      contactPersonName: "",
      executiveId: "",
      customerId: "",
    },
  });

  const onSubmit = async (visit) => {
    const visitData = { ...visit, leadId };

    try {
      setLoading(true);
      const { data } = await axios.post(`/visit/create`, visitData);
      dispatch(addNewVisit(data.visit));
      reset();
      if (data.visit.action === "Convert to new lead") {
        router.push(`/new-lead?visitId=${data.visit.id}`);
      }
      toast.success(data.message);
      reset();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (lead) {
      reset({
        contactPersonName: lead?.enquiryPerson || "",
        customerName: lead?.customer?.customerName || "",
        executiveId: lead?.executiveId || "",
        customerId: lead?.customer?.id || "",
        purpose: "",
      });
    }
  }, [lead, reset]);

  useEffect(() => {
    const fetchLeadDetails = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/lead/${leadId}`);
        console.log(data);

        setLead(data.lead);
      } catch (error) {
        console.error("Error fetching lead details:", error);
        toast.error(error?.response?.data?.message || "Failed to fetch lead");
      } finally {
        setLoading(false);
      }
    };

    if (leadId) {
      fetchLeadDetails();
    }
  }, [leadId]);

  return (
    <div className="flex h-screen">
      <Nav navOpen={navOpen} setNavOpen={setNavOpen} />
      <div className="p-6 w-full lg:w-[calc(100%-256px)] space-y-6 overflow-y-auto">
        <div className="md:hidden mb-4">
          <div
            onClick={() => setNavOpen(true)}
            className="text-2xl text-[#092C1C] cursor-pointer"
          >
            <FaBars />
          </div>
        </div>
        <h1 className="text-xl font-bold mb-4">Add Visit</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="Contact Person Name *"
              name="contactPersonName"
              register={register}
              type="text"
              required="Contact Person is required"
              error={errors.contactPersonName}
              placeholder="Enter Contact Person"
              touched={touchedFields.contactPersonName}
            />

            <div className=" relative">
              <Input
                label="Company Name *"
                name="customerName"
                onChange={(value) => setQuery(value)}
                register={register}
                type="text"
                required="Company Name is required"
                error={errors.customerName}
                placeholder="Enter Company name"
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
                        setValue("customerId", customer.id);
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
              label="Purpose of Visit *"
              name="purpose"
              register={register}
              required={"Purpose is required"}
              placeholder="Select or type"
              options={[
                { value: "General" },
                { value: "Followup" },
                { value: "Promotion" },
                { value: "Awareness" },
              ]}
              touched={touchedFields.purpose}
              error={errors.purpose}
            />
            <Input
              label="Visit Date *"
              name="visitDate"
              register={register}
              required="Visit Date is required"
              type="date"
              placeholder="DD/MM/YYYY"
              error={errors.visitDate}
              touched={touchedFields.visitDate}
            />
            {user?.role === "admin" && (
              <Select
                label="Executive"
                name="executiveId"
                register={register}
                required={"Executive is required"}
                options={(executives || []).map((e) => ({
                  value: e.id,
                  label: e.email,
                }))}
                touched={touchedFields.executiveId}
                error={errors.executiveId}
              />
            )}
            <Input
              label="Remarks"
              name="remarks"
              register={register}
              type="text"
              placeholder="Enter remarks"
            />
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
    </div>
  );
};

export default Page;
