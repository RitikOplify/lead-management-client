"use client";
import React, { useEffect, useRef, useState } from "react";
import { CustomSelectInput, Input, Select } from "@/components/inputFields";
import { useForm } from "react-hook-form";
import axios from "@/utils/axios";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addNewVisit } from "@/store/slices/leads";

const Page = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { executives } = useSelector((state) => state.leads);
  const { user } = useSelector((state) => state.auth);
  const searchParams = useSearchParams();
  const [lead, setLead] = useState(null);
  const leadId = searchParams.get("leadId");
  const [customers, setCustomers] = useState([]);
  const [query, setQuery] = useState("");

  const debounceTimeout = useRef(null);

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
        const { data } = await axios.get(`/lead/customers/search?query=${query}`);
        setCustomers(data.customers);
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
    }

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
      toast.success(data.message);
      reset();

      if (data.visit.action === "Convert to new lead") {
        router.push(`/new-lead?visitId=${data.visit.id}`);
      }
    } catch (error) {
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
        setLead(data.lead);
      } catch (error) {
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
    <main className="flex-1 p-4 md:p-6 bg-white rounded-xl max-w-7xl mx-auto shadow-sm overflow-y-auto">
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">Add Visit</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 min-w-full sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

          <div className="relative">
            <Input
              label="Company Name *"
              name="customerName"
              onChange={(val) => setQuery(val)}
              register={register}
              type="text"
              required="Company Name is required"
              error={errors.customerName}
              placeholder="Enter Company name"
              touched={touchedFields.customerName}
            />
            {customers.length > 0 && (
              <ul className="absolute border z-10 w-full bg-white rounded-md shadow mt-1 overflow-hidden">
                {customers.map((customer) => (
                  <li
                    key={customer.id}
                    className="px-3 py-2 hover:bg-slate-100 cursor-pointer text-sm"
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
            required="Purpose is required"
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
              required="Executive is required"
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
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded text-white transition-all ${
              loading
                ? "bg-slate-600 cursor-not-allowed"
                : "bg-emerald-800 hover:bg-emerald-900"
            }`}
          >
            {loading ? "Submitting..." : "Create"}
          </button>
        </div>
      </form>
    </main>
  );
};

export default Page;
